import { ref, computed } from 'vue';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  updateProfile,
  type User,
  type Auth
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { useRouter } from 'vue-router';

export const useAuth = () => {
  const user = ref<User | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);
  const router = useRouter();
  
  // rzutowanie typu dla auth - bo typescript się czepia
  const firebaseAuth: Auth | null = auth;

  // computed properties - reaktywne gettery
  const isAuthenticated = computed(() => !!user.value);
  const isEmailVerified = computed(() => user.value?.emailVerified || false);

  // inicjalizacja listenera auth - nasłuchuje czy user się zalogował/wylogował
  try {
    if (!firebaseAuth) {
      console.warn('Firebase auth not available, using mock mode');
      loading.value = false;
    } else {
      console.log('🔍 Inicjalizacja auth listener...');
      onAuthStateChanged(firebaseAuth, (firebaseUser) => {
        console.log('🔍 Auth state changed:', firebaseUser ? 'User logged in' : 'User logged out');
        if (firebaseUser) {
          console.log('🔍 User details:', {
            email: firebaseUser.email,
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            emailVerified: firebaseUser.emailVerified
          });
        }
        user.value = firebaseUser;
        loading.value = false;
      });
    }
  } catch (error) {
    console.error('Auth state listener error:', error);
    loading.value = false;
  }

  // logowanie - email + hasło, opcjonalnie "zapamiętaj mnie"
  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      error.value = null;
      loading.value = true;
      
      if (!firebaseAuth) {
        error.value = 'Firebase nie jest skonfigurowany. Sprawdź konfigurację.';
        return { success: false, error: error.value };
      }
      
      // ustawienie persistence PRZED logowaniem - to jest kluczowe!
      if (rememberMe) {
        await setPersistence(firebaseAuth, browserLocalPersistence);
        console.log('✅ Ustawiono persistence: LOCAL (zapamiętaj mnie)');
      } else {
        await setPersistence(firebaseAuth, browserSessionPersistence);
        console.log('✅ Ustawiono persistence: SESSION (tylko ta sesja)');
      }
      
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      user.value = userCredential.user;
      
      return { success: true, user: userCredential.user };
    } catch (err: any) {
      error.value = getErrorMessage(err.code);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // rejestracja - tworzy nowe konto i wysyła email weryfikacyjny
  const register = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      error.value = null;
      loading.value = true;
      
      if (!firebaseAuth) {
        error.value = 'Firebase nie jest skonfigurowany. Sprawdź konfigurację.';
        return { success: false, error: error.value };
      }
      
      // ustawienie persistence na LOCAL dla rejestracji - żeby user został zalogowany
      await setPersistence(firebaseAuth, browserLocalPersistence);
      console.log('✅ Ustawiono persistence: LOCAL (rejestracja)');
      
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      user.value = userCredential.user;
      
      // ustawienie displayName jeśli podano imię i nazwisko
      if (firstName && lastName) {
        try {
          await updateProfile(userCredential.user, {
            displayName: `${firstName} ${lastName}`
          });
          console.log('✅ Ustawiono imię i nazwisko:', `${firstName} ${lastName}`);
        } catch (profileError) {
          console.error('❌ Błąd ustawiania imienia i nazwiska:', profileError);
          // nie przerywamy rejestracji jak się nie uda ustawić imienia
        }
      }
      
      // wysyłanie emaila weryfikacyjnego - żeby user potwierdził że to jego email
      try {
        await sendEmailVerification(userCredential.user);
        console.log('✅ Email weryfikacyjny został wysłany na:', email);
      } catch (emailError) {
        console.error('❌ Błąd wysyłania emaila weryfikacyjnego:', emailError);
        // nie przerywamy rejestracji jak email się nie wyśle - user i tak może się zalogować
      }
      
      return { success: true, user: userCredential.user };
    } catch (err: any) {
      error.value = getErrorMessage(err.code);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // wylogowanie - czyści usera i przekierowuje na login
  const logout = async () => {
    try {
      error.value = null;
      
      if (!firebaseAuth) {
        user.value = null;
        router.push('/login');
        return { success: true };
      }
      
      await signOut(firebaseAuth);
      user.value = null;
      router.push('/login');
      return { success: true };
    } catch (err: any) {
      error.value = getErrorMessage(err.code);
      return { success: false, error: error.value };
    }
  };

  // reset hasła - wysyła email z linkiem do zmiany hasła
  const resetPassword = async (email: string) => {
    try {
      error.value = null;
      loading.value = true;
      
      if (!firebaseAuth) {
        error.value = 'Firebase nie jest skonfigurowany. Sprawdź konfigurację.';
        return { success: false, error: error.value };
      }
      
      await sendPasswordResetEmail(firebaseAuth, email);
      console.log('✅ Email resetujący hasło został wysłany na:', email);
      return { success: true };
    } catch (err: any) {
      error.value = getErrorMessage(err.code);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // ponowne wysłanie emaila weryfikacyjnego - jak user nie dostał pierwszego
  const resendEmailVerification = async () => {
    try {
      error.value = null;
      
      if (!firebaseAuth) {
        error.value = 'Firebase nie jest skonfigurowany. Sprawdź konfigurację.';
        return { success: false, error: error.value };
      }
      
      if (user.value) {
        await sendEmailVerification(user.value);
        return { success: true };
      }
      return { success: false, error: 'No user logged in' };
    } catch (err: any) {
      error.value = getErrorMessage(err.code);
      return { success: false, error: error.value };
    }
  };

  // czyszczenie błędów - żeby nie pokazywały się stare błędy
  const clearError = () => {
    error.value = null;
  };

  // funkcja do debugowania persistence - sprawdza jaki typ jest ustawiony
  const checkPersistence = async () => {
    if (!firebaseAuth) return 'Firebase nie dostępny';
    
    try {
      // sprawdzenie czy user jest zalogowany
      if (user.value) {
        console.log('🔍 User jest zalogowany:', user.value.email);
        console.log('🔍 UID:', user.value.uid);
        console.log('🔍 Email verified:', user.value.emailVerified);
        console.log('🔍 Display name:', user.value.displayName);
      } else {
        console.log('🔍 User nie jest zalogowany');
      }
    } catch (error) {
      console.error('❌ Błąd sprawdzania persistence:', error);
    }
  };

  // tłumaczenia błędów firebase na polski - bo domyślne są po angielsku
  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Nie znaleziono użytkownika z tym adresem email.';
      case 'auth/wrong-password':
        return 'Nieprawidłowe hasło.';
      case 'auth/invalid-email':
        return 'Nieprawidłowy adres email.';
      case 'auth/user-disabled':
        return 'Konto zostało wyłączone.';
      case 'auth/email-already-in-use':
        return 'Adres email jest już używany przez inne konto.';
      case 'auth/weak-password':
        return 'Hasło jest za słabe. Użyj co najmniej 8 znaków, dużą literę, cyfrę i znak specjalny.';
      case 'auth/invalid-credential':
        return 'Nieprawidłowe dane logowania.';
      case 'auth/too-many-requests':
        return 'Zbyt wiele prób logowania. Spróbuj ponownie później.';
      case 'auth/network-request-failed':
        return 'Błąd połączenia sieciowego. Sprawdź połączenie internetowe.';
      default:
        return 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.';
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isEmailVerified,
    signIn,
    register,
    logout,
    resetPassword,
    resendEmailVerification,
    clearError,
    checkPersistence
  };
};
