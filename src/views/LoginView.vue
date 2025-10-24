<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { login } = useAuth();

// Dane formularza
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const errorMessage = ref('');
const isLoading = ref(false);

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
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo aplikacji -->
      <div class="flex justify-center">
        <div class="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 shadow-lg">
          <span class="text-3xl">✈️</span>
        </div>
      </div>
      
      <!-- Nazwa aplikacji -->
      <h1 class="mt-6 text-center text-3xl font-bold text-gray-900">
        Travel Mate
      </h1>
      
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
                placeholder="twoj@email.com"
              />
            </div>
          </div>

          <!-- Pole hasła -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Hasło
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                placeholder="Twoje hasło"
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
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Zapamiętaj mnie
              </label>
            </div>
          </div>

          <!-- Komunikat błędu -->
          <div v-if="errorMessage" class="rounded-lg bg-red-50 p-4">
            <div class="flex">
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
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
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
