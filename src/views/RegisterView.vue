<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { register } = useAuth();

// Dane formularza
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const acceptTerms = ref(false);
const errorMessage = ref('');
const isLoading = ref(false);

// Walidacja hasła
const passwordValidation = ref({
  minLength: false,
  hasUpperCase: false,
  hasLowerCase: false,
  hasNumber: false,
});

const validatePassword = () => {
  const pwd = password.value;
  passwordValidation.value = {
    minLength: pwd.length >= 8,
    hasUpperCase: /[A-Z]/.test(pwd),
    hasLowerCase: /[a-z]/.test(pwd),
    hasNumber: /\d/.test(pwd),
  };
};

const isPasswordValid = () => {
  return Object.values(passwordValidation.value).every(Boolean);
};

// Funkcja rejestracji z integracją z backendem
const handleRegister = async () => {
  if (!firstName.value || !lastName.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Proszę wypełnić wszystkie pola';
    return;
  }

  if (!acceptTerms.value) {
    errorMessage.value = 'Musisz zaakceptować regulamin';
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Hasła nie są identyczne';
    return;
  }

  if (!isPasswordValid()) {
    errorMessage.value = 'Hasło nie spełnia wymagań bezpieczeństwa';
    return;
  }
  
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    await register(email.value, password.value, firstName.value, lastName.value);
    
    // rejestracja zakończona - email wysłany
    // przekierowanie do logowania z komunikatem
    router.push({
      path: '/login',
      query: { 
        registered: 'true',
        email: email.value 
      }
    });
  } catch (error) {
    const err = error as Error;
    errorMessage.value = err.message || 'Nie udało się zarejestrować';
    console.error('Błąd rejestracji:', err);
  } finally {
    isLoading.value = false;
  }
};

const goToLogin = () => {
  router.push('/login');
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
        Stwórz nowe konto
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Dołącz do społeczności podróżników
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleRegister">
          <!-- Imię i nazwisko -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">
                Imię
              </label>
              <div class="mt-1">
                <input
                  id="firstName"
                  v-model="firstName"
                  name="firstName"
                  type="text"
                  autocomplete="given-name"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                  placeholder="Jan"
                />
              </div>
            </div>
            
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">
                Nazwisko
              </label>
              <div class="mt-1">
                <input
                  id="lastName"
                  v-model="lastName"
                  name="lastName"
                  type="text"
                  autocomplete="family-name"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                  placeholder="Kowalski"
                />
              </div>
            </div>
          </div>

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
                autocomplete="new-password"
                required
                @input="validatePassword"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                placeholder="Twoje hasło"
              />
            </div>
            
            <!-- Wymagania hasła -->
            <div v-if="password" class="mt-2 space-y-1">
              <div class="text-xs text-gray-600">
                Hasło musi zawierać:
              </div>
              <div class="space-y-1">
                <div class="flex items-center text-xs">
                  <span :class="passwordValidation.minLength ? 'text-green-600' : 'text-gray-400'">
                    {{ passwordValidation.minLength ? '✓' : '○' }}
                  </span>
                  <span :class="passwordValidation.minLength ? 'text-green-600' : 'text-gray-500'" class="ml-2">
                    Minimum 8 znaków
                  </span>
                </div>
                <div class="flex items-center text-xs">
                  <span :class="passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-400'">
                    {{ passwordValidation.hasUpperCase ? '✓' : '○' }}
                  </span>
                  <span :class="passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-500'" class="ml-2">
                    Wielką literę
                  </span>
                </div>
                <div class="flex items-center text-xs">
                  <span :class="passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-400'">
                    {{ passwordValidation.hasLowerCase ? '✓' : '○' }}
                  </span>
                  <span :class="passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-500'" class="ml-2">
                    Małą literę
                  </span>
                </div>
                <div class="flex items-center text-xs">
                  <span :class="passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-400'">
                    {{ passwordValidation.hasNumber ? '✓' : '○' }}
                  </span>
                  <span :class="passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'" class="ml-2">
                    Cyfrę
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Potwierdzenie hasła -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Potwierdź hasło
            </label>
            <div class="mt-1">
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                name="confirmPassword"
                type="password"
                autocomplete="new-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                placeholder="Powtórz hasło"
              />
            </div>
            <div v-if="confirmPassword && password !== confirmPassword" class="mt-1 text-xs text-red-600">
              Hasła nie są identyczne
            </div>
          </div>

          <!-- Checkbox regulaminu -->
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="acceptTerms"
                v-model="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                required
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="acceptTerms" class="text-gray-700">
                Akceptuję 
                <a href="#" class="text-blue-600 hover:text-blue-500 font-medium">regulamin</a>
                i 
                <a href="#" class="text-blue-600 hover:text-blue-500 font-medium">politykę prywatności</a>
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

          <!-- Przycisk rejestracji -->
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
              {{ isLoading ? 'Tworzenie konta...' : 'Zarejestruj się' }}
            </button>
          </div>

          <!-- Linki pomocnicze -->
          <div class="text-center space-y-2">
            <div>
              <button
                type="button"
                @click="goToLogin"
                class="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
              >
                Masz już konto? Zaloguj się
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
