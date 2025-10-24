import { adminAuth, adminDb } from '../config/firebase';
import { User } from '../types/user';
import { getAuth, signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { app } from '../config/firebase';
import admin from 'firebase-admin';

export const authService = {
  // rejestracja usera w firebase auth i zapisanie danych usera w firestore
  async registerUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<{ user: User; token: string }> {
    try {
      // 1. utworzenie usera w firebase auth
      const userRecord = await adminAuth.createUser({
        email,
        password,
        displayName: `${firstName} ${lastName}`,
      });

      // 2. przygotowanie danych usera do zapisu w firestore
      const userData: User = {
        uid: userRecord.uid,
        email,
        firstName,
        lastName,
        createdAt: new Date(),
      };

      // 3. zapisanie danych usera w firestore
      await adminDb.collection('users').doc(userRecord.uid).set({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: admin.firestore.Timestamp.fromDate(userData.createdAt),
      });

      // 4. wygenerowanie custom tokena dla usera
      const customToken = await adminAuth.createCustomToken(userRecord.uid);

      console.log(`✅ Użytkownik zarejestrowany: ${email}`);

      return {
        user: userData,
        token: customToken,
      };
    } catch (error) {
      const err = error as Error & { code?: string };
      console.error('Błąd podczas rejestracji użytkownika:', err.message);
      
      // obsługa specyficznych błędów firebase
      if (err.code === 'auth/email-already-exists') {
        throw new Error('Ten adres e-mail jest już używany');
      } else if (err.code === 'auth/invalid-email') {
        throw new Error('Nieprawidłowy adres e-mail');
      } else if (err.code === 'auth/weak-password') {
        throw new Error('Hasło jest zbyt słabe');
      }
      
      throw new Error('Nie udało się zarejestrować użytkownika');
    }
  },

  /**
   * loguje usera - weryfikuje email i hasło, zwraca custom token
   * używa firebase client sdk do weryfikacji hasła (admin sdk nie może tego zrobić)
   */
  async loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      // 1. weryfikacja hasła - użyj firebase client sdk
      const auth = getAuth(app);
      let uid: string;
      
      try {
        // próba zalogowania - to zweryfikuje email i hasło
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        uid = userCredential.user.uid;
        
        console.log(`✅ Hasło zweryfikowane poprawnie dla: ${email}`);
      } catch (authError) {
        const error = authError as AuthError;
        console.error('Błąd weryfikacji hasła:', error.code);
        
        // obsługa błędów autentykacji
        if (error.code === 'auth/invalid-credential' || 
            error.code === 'auth/wrong-password' ||
            error.code === 'auth/user-not-found') {
          throw new Error('Nieprawidłowy email lub hasło');
        } else if (error.code === 'auth/too-many-requests') {
          throw new Error('Zbyt wiele prób logowania. Spróbuj ponownie później');
        } else if (error.code === 'auth/user-disabled') {
          throw new Error('Konto zostało zablokowane');
        }
        
        throw new Error('Błąd podczas logowania');
      }

      // 2. pobiera danye usera z firestore
      const userDoc = await adminDb.collection('users').doc(uid).get();

      if (!userDoc.exists) {
        throw new Error('Nie znaleziono danych użytkownika');
      }

      const userData = userDoc.data();

      // 3. przygotowuje obiekt usera
      const user: User = {
        uid,
        email,
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        createdAt: userData?.createdAt?.toDate() || new Date(),
      };

      // 4. generuje custom token (dla frontendu)
      const customToken = await adminAuth.createCustomToken(uid);

      console.log(`✅ Użytkownik zalogowany: ${email}`);

      return {
        user,
        token: customToken,
      };
    } catch (error) {
      const err = error as Error;
      console.error('Błąd podczas logowania użytkownika:', err.message);

      // jeśli to już jest nasz custom error, przekazuje go dalej
      if (err.message.includes('Nieprawidłowy') || 
          err.message.includes('Zbyt wiele') ||
          err.message.includes('zablokowane')) {
        throw err;
      }

      throw new Error('Nie udało się zalogować');
    }
  },

  // wysyła email z linkiem do resetowania hasła
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      // sprawdza czy usera istnieje
      await adminAuth.getUserByEmail(email);

      // generuje link do resetowania hasła
      const resetLink = await adminAuth.generatePasswordResetLink(email);

      console.log(`✅ Link do resetowania hasła wygenerowany dla: ${email}`);
      console.log(`🔗 Link: ${resetLink}`);

      // Uwaga: Ten kod tylko generuje link. W produkcji należy użyć
      // usługi wysyłania emaili (np. SendGrid, Mailgun, Firebase Extensions)
      // Firebase Auth automatycznie wysyła email gdy używany jest z Client SDK
      
      // TODO: Zintegrować z usługą wysyłania emaili
      
    } catch (error) {
      const err = error as Error & { code?: string };
      console.error('Błąd podczas resetowania hasła:', err.message);

      if (err.code === 'auth/user-not-found') {
        // z bezpieczeństwa nie ujawniamy czy user istnieje
        console.log('Użytkownik nie znaleziony, ale nie informujemy o tym klienta');
        return;
      }

      throw new Error('Nie udało się wysłać emaila resetującego hasło');
    }
  },

  // pobiera dane usera po uid
  async getUserByUid(uid: string): Promise<User | null> {
    try {
      const userDoc = await adminDb.collection('users').doc(uid).get();

      if (!userDoc.exists) {
        return null;
      }

      const userData = userDoc.data();
      const userRecord = await adminAuth.getUser(uid);

      return {
        uid,
        email: userRecord.email!,
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        createdAt: userData?.createdAt?.toDate() || new Date(),
      };
    } catch (error) {
      console.error('Błąd podczas pobierania użytkownika:', error);
      return null;
    }
  },
};

