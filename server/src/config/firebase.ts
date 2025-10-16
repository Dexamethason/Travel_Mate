import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore/lite';
// import { getAnalytics } from "firebase/analytics";
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

// Initialize Firebase function
export const initializeFirebase = () => {
  console.log('✅ Firebase initialized successfully');
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