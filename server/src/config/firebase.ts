import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import admin from 'firebase-admin';
import { firebaseEnv, firebaseAdminEnv } from './env';

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

// Initialize Firebase Client SDK
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

// Initialize Firebase Admin SDK
let adminApp: admin.app.App;
let adminAuth: admin.auth.Auth;
let adminDb: admin.firestore.Firestore;

try {
  // Inicjalizacja Firebase Admin SDK używając zmiennych środowiskowych z .env
  if (!firebaseAdminEnv.projectId || !firebaseAdminEnv.privateKey || !firebaseAdminEnv.clientEmail) {
    throw new Error(
      'Brak wymaganych zmiennych Firebase Admin SDK w .env!\n' +
      'Wymagane zmienne:\n' +
      '  - ADMIN_SDK_PROJECT_ID\n' +
      '  - ADMIN_SDK_PRIVATE_KEY\n' +
      '  - ADMIN_SDK_CLIENT_EMAIL\n\n' +
      'Wygeneruj nowy Service Account Key z Firebase Console i skopiuj dane do .env'
    );
  }

  console.log('📝 Inicjalizacja Firebase Admin SDK z zmiennych środowiskowych');
  console.log('📍 Project ID:', firebaseAdminEnv.projectId);
  console.log('📍 Client Email:', firebaseAdminEnv.clientEmail);
  
  adminApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: firebaseAdminEnv.projectId,
      clientEmail: firebaseAdminEnv.clientEmail,
      // Zamień literalne \n na prawdziwe znaki nowej linii
      privateKey: firebaseAdminEnv.privateKey.replace(/\\n/g, '\n'),
    }),
    projectId: firebaseAdminEnv.projectId,
  });

  adminAuth = adminApp.auth();
  adminDb = adminApp.firestore();
  
  console.log('✅ Firebase Admin SDK initialized successfully');
  console.log('');
} catch (error) {
  console.error('❌ BŁĄD: Nie udało się zainicjalizować Firebase Admin SDK');
  console.error('');
  
  const errorCode = (error as { code?: string }).code;
  if (errorCode === 'app/invalid-credential') {
    console.error('🔴 BŁĄD: Nieprawidłowe dane Service Account!');
    console.error('');
    console.error('Twój Service Account Key jest nieważny lub został cofnięty.');
  } else {
    console.error('🔍 Wymagane zmienne w server/.env:');
    console.error('   - ADMIN_SDK_PROJECT_ID');
    console.error('   - ADMIN_SDK_PRIVATE_KEY (z \\n jako literalne znaki)');
    console.error('   - ADMIN_SDK_CLIENT_EMAIL');
  }
  
  console.error('');
  console.error('Szczegóły błędu:', error instanceof Error ? error.message : String(error));
  console.error('');
  throw error;
}

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

export { app, db, adminAuth, adminDb, adminApp };
