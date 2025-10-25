import dotenv from 'dotenv';

// Załaduj zmienne środowiskowe
dotenv.config();

// Wyeksportuj konfigurację Firebase
export const firebaseEnv = {
  apiKey: process.env.FIREBASE_API_KEY || '',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.FIREBASE_APP_ID || '',
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || '',
};

// Sprawdź czy wszystkie wymagane zmienne są ustawione
const requiredVars = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];
const missingVars = requiredVars.filter(key => !firebaseEnv[key as keyof typeof firebaseEnv]);

if (missingVars.length > 0) {
  console.error('❌ Brakujące zmienne środowiskowe Firebase:');
  missingVars.forEach(varName => {
    console.error(`   - FIREBASE_${varName.toUpperCase()}`);
  });
  console.error('\n📝 Utwórz plik server/.env i dodaj brakujące zmienne.');
  console.error('Szczegóły: https://console.firebase.google.com/\n');
}

// Firebase Admin SDK configuration (z .env - TYLKO TO!)
export const firebaseAdminEnv = {
  projectId: process.env.ADMIN_SDK_PROJECT_ID || '',
  privateKey: process.env.ADMIN_SDK_PRIVATE_KEY || '',
  clientEmail: process.env.ADMIN_SDK_CLIENT_EMAIL || '',
};

export const serverEnv = {
  port: process.env.PORT || '3001',
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5173',
    'http://localhost:3001',
  ],
};

export const geminiEnv = {
  apiKey: process.env.GEMINI_API_KEY || '',
};

if (!geminiEnv.apiKey) {
  console.warn('⚠️  GEMINI_API_KEY nie jest ustawiony w pliku .env');
  console.warn('📝 Dodaj GEMINI_API_KEY do pliku server/.env aby korzystać z AI planera');
}
