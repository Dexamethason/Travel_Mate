import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// konfiguracja firebase - trzeba skopiować z firebase console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-XXXXXXXXXX'
};

// sprawdzenie czy to demo konfiguracja
const isDemoConfig = firebaseConfig.apiKey === 'demo-api-key' || firebaseConfig.projectId === 'demo-project';
if (isDemoConfig) {
  console.warn('⚠️ Używasz demo konfiguracji Firebase!');
  console.warn('⚠️ Stwórz plik .env z prawdziwymi danymi Firebase');
  console.warn('⚠️ Persistence może nie działać z demo konfiguracją');
}

// inicjalizacja firebase z obsługą błędów - bo może się nie udać
let app: any;
let auth: any;
let db: any;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log('✅ Firebase initialized successfully');

  // to do wyjebania po testach
  console.log('🔍 Firebase config:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    apiKey: firebaseConfig.apiKey ? 'Set' : 'Missing'
  });
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  auth = null;
  db = null;
}

export { auth, db };
export default app;
