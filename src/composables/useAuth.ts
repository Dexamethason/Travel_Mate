import { ref, computed } from 'vue';
import type {
  User,
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  AuthResponse,
} from '../types/user';

// API endpoint
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// stan globalny usera
const currentUser = ref<User | null>(null);
const authToken = ref<string | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

export function useAuth() {
  const isAuthenticated = computed(() => currentUser.value !== null);

// rejestracja usera
  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<AuthResponse> => {
    isLoading.value = true;
    error.value = null;

    try {
      const requestData: RegisterRequest = {
        email,
        password,
        firstName,
        lastName,
      };

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Nie udało się zarejestrować');
      }

      // zapisuje dane usera i token
      if (data.user && data.token) {
        currentUser.value = data.user;
        authToken.value = data.token;

        // zapisuje w localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
      }

      return data;
    } catch (err: any) {
      error.value = err.message || 'Wystąpił nieoczekiwany błąd';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // logowanie usera
  const login = async (email: string, password: string): Promise<AuthResponse> => {
    isLoading.value = true;
    error.value = null;

    try {
      const requestData: LoginRequest = {
        email,
        password,
      };

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Nie udało się zalogować');
      }

      // zapisuje dane usera i token
      if (data.user && data.token) {
        currentUser.value = data.user;
        authToken.value = data.token;

        // zapisuje w localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
      }

      return data;
    } catch (err: any) {
      error.value = err.message || 'Wystąpił nieoczekiwany błąd';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // wysyłanie emaila z linkiem do resetowania hasła
  const forgotPassword = async (email: string): Promise<AuthResponse> => {
    isLoading.value = true;
    error.value = null;

    try {
      const requestData: ForgotPasswordRequest = {
        email,
      };

      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Nie udało się wysłać emaila');
      }

      return data;
    } catch (err: any) {
      error.value = err.message || 'Wystąpił nieoczekiwany błąd';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // wylogowanie usera
  const logout = () => {
    currentUser.value = null;
    authToken.value = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  };

  // przywracanie sesji z localStorage
  const restoreSession = () => {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('currentUser');

    if (token && userStr) {
      try {
        authToken.value = token;
        currentUser.value = JSON.parse(userStr);
      } catch (err) {
        console.error('Błąd podczas przywracania sesji:', err);
        logout();
      }
    }
  };

  return {
    currentUser: computed(() => currentUser.value),
    authToken: computed(() => authToken.value),
    isAuthenticated,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    register,
    login,
    forgotPassword,
    logout,
    restoreSession,
  };
}

