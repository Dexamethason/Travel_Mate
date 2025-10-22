import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import { firebaseEnv } from './env';

// Firebase configuration loaded from environment variables
const firebaseConfig = {
  apiKey: firebaseEnv.apiKey,
  authDomain: firebaseEnv.authDomain,
  projectId: firebaseEnv.projectId,
  storageBucket: firebaseEnv.storageBucket,
  messagingSenderId: firebaseEnv.messagingSenderId,
  appId: firebaseEnv.appId,
  measurementId: firebaseEnv.measurementId,
};

// Debug - sprawdź czy zmienne są załadowane
if (!firebaseConfig.projectId) {
  console.error('❌ BŁĄD: Firebase projectId jest undefined!');
  console.error('Sprawdź czy plik server/.env jest poprawnie skonfigurowany.');
  console.error('Uruchom: cd server && npm run check-env');
  throw new Error('Firebase configuration is missing required fields');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

// Initialize Firebase function
export const initializeFirebase = () => {
  console.log('✅ Firebase initialized successfully');
  console.log(`📍 Project ID: ${firebaseConfig.projectId}`);
  return { app, db };
};

// // Firestore helpers
// export const firestoreHelpers = {
//   // Dodaj dokument do kolekcji
//   addDocument: async (collectionName: string, data: any) => {
//     try {
//       const docRef = await addDoc(collection(db, collectionName), data);
//       return docRef.id;
//     } catch (error) {
//       console.error('Error adding document:', error);
//       throw error;
//     }
//   },

//   // Pobierz wszystkie dokumenty z kolekcji
//   getCollection: async (collectionName: string) => {
//     try {
//       const querySnapshot = await getDocs(collection(db, collectionName));
//       return querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//     } catch (error) {
//       console.error('Error getting collection:', error);
//       throw error;
//     }
//   }
// };

// // Get a list of cities from your database
// async function getCities(db: any) {
//   const citiesCol = collection(db, 'cities');
//   const citySnapshot = await getDocs(citiesCol);
//   const cityList = citySnapshot.docs.map(doc => doc.data());
//   return cityList;
// }

export { app, db };
