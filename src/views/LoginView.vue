<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline';

const router = useRouter();
const route = useRoute();
const { login } = useAuth();

// Dane formularza
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

// Sprawdź czy użytkownik został właśnie zarejestrowany
onMounted(() => {
  if (route.query.registered === 'true') {
    const userEmail = route.query.email as string;
    email.value = userEmail || '';
    successMessage.value =
      'Konto zostało utworzone! Sprawdź swoją skrzynkę email i kliknij link weryfikacyjny, aby aktywować konto.';
  }
});

// Funkcja logowania z integracją z backendem
const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Proszę wypełnić wszystkie pola';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    await login(email.value, password.value);
    // Przekierowanie do dashboard po udanym logowaniu
    router.push('/dashboard');
  } catch (error: any) {
    errorMessage.value = error.message || 'Nie udało się zalogować';
    console.error('Błąd logowania:', error);
  } finally {
    isLoading.value = false;
  }
};

const goToRegister = () => {
  router.push('/register');
};

const goToForgotPassword = () => {
  router.push('/forgot-password');
};

const goToHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo aplikacji -->
      <div class="flex justify-center">
        <div
          class="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 shadow-lg"
        >
          <span class="text-3xl">✈️</span>
        </div>
      </div>

      <!-- Nazwa aplikacji -->
      <h1 class="mt-6 text-center text-3xl font-bold text-gray-900">Travel Mate</h1>

      <!-- Nagłówek -->
      <h2 class="mt-6 text-center text-2xl font-semibold text-gray-900">
        Zaloguj się do Travel Mate
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Uzyskaj dostęp do swoich zapisanych podróży
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
        <!-- Przycisk powrotu do strony głównej -->
        <div class="mb-6">
          <button
            type="button"
            @click="goToHome"
            class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <ArrowLeftIcon class="w-4 h-4 mr-2" />
            Powrót do strony głównej
          </button>
        </div>

        <form class="space-y-6" @submit.prevent="handleLogin">
          <!-- Pole email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Adres e-mail
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                placeholder="Wprowadź swój adres email"
              />
            </div>
          </div>

          <!-- Pole hasła -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700"> Hasło </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                placeholder="Wprowadź swoje hasło"
              />
            </div>
          </div>

          <!-- Checkbox "Zapamiętaj mnie" -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Zapamiętaj mnie
              </label>
            </div>
          </div>

          <!-- Komunikat sukcesu (po rejestracji) -->
          <div v-if="successMessage" class="rounded-lg bg-green-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <CheckCircleIcon class="h-5 w-5 text-green-400" />
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-800">
                  {{ successMessage }}
                </p>
              </div>
            </div>
          </div>

          <!-- Komunikat błędu -->
          <div v-if="errorMessage" class="rounded-lg bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <XCircleIcon class="h-5 w-5 text-red-400" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  {{ errorMessage }}
                </h3>
              </div>
            </div>
          </div>

          <!-- Przycisk logowania -->
          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <ArrowPathIcon class="animate-spin h-5 w-5 text-white" />
              </span>
              {{ isLoading ? 'Logowanie...' : 'Zaloguj się' }}
            </button>
          </div>

          <!-- Linki pomocnicze -->
          <div class="text-center space-y-2">
            <div>
              <button
                type="button"
                @click="goToRegister"
                class="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
              >
                Nie masz konta? Zarejestruj się
              </button>
            </div>
            <div>
              <button
                type="button"
                @click="goToForgotPassword"
                class="text-sm text-gray-600 hover:text-gray-500 transition-colors"
              >
                Nie pamiętasz hasła?
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
