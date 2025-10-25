import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore/lite';
import { db } from '../config/firebase';
import { geminiEnv } from '../config/env';
import { PlannerInput, TravelPlan } from '../types/plan';

const genAI = new GoogleGenerativeAI(geminiEnv.apiKey);

export const planService = {
  /**
   * Generuje plan podróży przy użyciu Gemini AI
   */
  async generatePlan(input: PlannerInput, userId: string): Promise<TravelPlan> {
    if (!geminiEnv.apiKey) {
      throw new Error('Klucz API Gemini nie jest skonfigurowany');
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      // przygotowanie promptu dla gemini
      const prompt = `
Jesteś ekspertem od planowania podróży. Wygeneruj szczegółowy plan podróży na podstawie poniższych danych.
Zwróć TYLKO czysty obiekt JSON bez dodatkowych oznaczeń markdown, komentarzy czy tekstu.

DANE WEJŚCIOWE:
- Cel podróży: ${input.destination}
- Data rozpoczęcia: ${input.start_date}
- Data zakończenia: ${input.end_date}
- Budżet całkowity: ${input.budget} PLN
- Liczba uczestników: ${input.participants}
- Zainteresowania: ${input.interests.join(', ')}
- Środek transportu: ${input.transport}
- Typ noclegu: ${input.accommodation}
${input.must_visit?.length ? `- Miejsca do odwiedzenia: ${input.must_visit.join(', ')}` : ''}
${input.avoid?.length ? `- Miejsca do uniknięcia: ${input.avoid.join(', ')}` : ''}
- Intensywność: ${input.intensity || 'moderate'}

WYGENERUJ plan podróży w formacie JSON zgodnie ze strukturą:

{
  "destination": "nazwa miejsca",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD",
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "name": "Nazwa atrakcji",
          "type": "museum|restaurant|walk|attraction|transport|accommodation|other",
          "time": "HH:MM-HH:MM",
          "cost_estimate": liczba w PLN,
          "notes": "Dodatkowe informacje",
          "location": "Dokładny adres lub współrzędne"
        }
      ],
      "daily_cost": suma kosztów dnia
    }
  ],
  "total_estimated_cost": suma całkowita,
  "tips": ["rada 1", "rada 2", "rada 3"]
}

WAŻNE:
- Plan musi zawierać aktywności na każdy dzień podróży
- Koszt aktywności musi być w PLN (dla ${input.participants} osób)
- Całkowity koszt nie powinien przekraczać budżetu ${input.budget} PLN
- Uwzględnij czas na posiłki, transport i odpoczynek
- Dodaj 3-5 praktycznych porad dotyczących podróży
- Nie dodawaj żadnego tekstu poza JSON - tylko czysty obiekt JSON
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // wywala markdown gdyby ai przypadkiem dało
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      // parsowanie jsona
      const planData = JSON.parse(text);

      const travelPlan: TravelPlan = {
        ...planData,
        userId,
        created_at: new Date(),
        updated_at: new Date(),
      };

      // zapisanie w bazie
      const docRef = await addDoc(collection(db, 'plans'), {
        ...travelPlan,
        created_at: Timestamp.fromDate(travelPlan.created_at!),
        updated_at: Timestamp.fromDate(travelPlan.updated_at!),
      });

      return {
        ...travelPlan,
        id: docRef.id,
      };
    } catch (error) {
      console.error('Błąd podczas generowania planu:', error);
      throw new Error('Nie udało się wygenerować planu podróży. Spróbuj ponownie.');
    }
  },

  async getUserPlans(userId: string): Promise<TravelPlan[]> {
    try {
      const q = query(
        collection(db, 'plans'),
        where('userId', '==', userId),
        orderBy('created_at', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          created_at: data.created_at?.toDate(),
          updated_at: data.updated_at?.toDate(),
        } as TravelPlan;
      });
    } catch (error) {
      console.error('Błąd podczas pobierania planów:', error);
      throw new Error('Nie udało się pobrać planów podróży');
    }
  },

  async getPlanById(planId: string, userId: string): Promise<TravelPlan | null> {
    try {
      const docRef = doc(db, 'plans', planId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      
      // sprawdza dostęp do planu
      if (data.userId !== userId) {
        throw new Error('Brak dostępu do tego planu');
      }

      return {
        id: docSnap.id,
        ...data,
        created_at: data.created_at?.toDate(),
        updated_at: data.updated_at?.toDate(),
      } as TravelPlan;
    } catch (error) {
      console.error('Błąd podczas pobierania planu:', error);
      throw error;
    }
  },

  async updatePlan(planId: string, userId: string, updates: Partial<TravelPlan>): Promise<TravelPlan> {
    try {
      const docRef = doc(db, 'plans', planId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Plan nie istnieje');
      }

      const data = docSnap.data();
      
      if (data.userId !== userId) {
        throw new Error('Brak dostępu do tego planu');
      }

      // usuwa pola, które nie powinny być aktualizowane
      const { id, userId: _, created_at, ...safeUpdates } = updates;

      await updateDoc(docRef, {
        ...safeUpdates,
        updated_at: Timestamp.fromDate(new Date()),
      });

      // pobiera zaktualizowany dokument
      const updatedDoc = await getDoc(docRef);
      const updatedData = updatedDoc.data();

      return {
        id: updatedDoc.id,
        ...updatedData,
        created_at: updatedData?.created_at?.toDate(),
        updated_at: updatedData?.updated_at?.toDate(),
      } as TravelPlan;
    } catch (error) {
      console.error('Błąd podczas aktualizacji planu:', error);
      throw error;
    }
  },

  async deletePlan(planId: string, userId: string): Promise<void> {
    try {
      const docRef = doc(db, 'plans', planId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Plan nie istnieje');
      }

      const data = docSnap.data();
      
      if (data.userId !== userId) {
        throw new Error('Brak dostępu do tego planu');
      }

      await deleteDoc(docRef);
    } catch (error) {
      console.error('Błąd podczas usuwania planu:', error);
      throw error;
    }
  },
};

