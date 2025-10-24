<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { 
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();
const { forgotPassword } = useAuth();

// Dane formularza
const email = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);
const emailSent = ref(false);

// Funkcja resetowania hasła z integracją z backendem
const handleForgotPassword = async () => {
  if (!email.value) {
    errorMessage.value = 'Proszę podać adres e-mail';
    return;
  }

  // Prosta walidacja email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    errorMessage.value = 'Proszę podać prawidłowy adres e-mail';
    return;
  }
  
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  
  try {
    await forgotPassword(email.value);
    emailSent.value = true;
    successMessage.value = `Link do resetowania hasła został wysłany na adres ${email.value}`;
  } catch (error: any) {
    errorMessage.value = error.message || 'Nie udało się wysłać emaila';
    console.error('Błąd resetowania hasła:', error);
  } finally {
    isLoading.value = false;
  }
};

const goToLogin = () => {
  router.push('/login');
};

const goToRegister = () => {
  router.push('/register');
};

const resendEmail = () => {
  emailSent.value = false;
  successMessage.value = '';
  errorMessage.value = '';
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
        Resetowanie hasła
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Podaj swój adres e-mail, aby otrzymać link do resetowania hasła
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
        <!-- Formularz resetowania -->
        <div v-if="!emailSent">
          <form class="space-y-6" @submit.prevent="handleForgotPassword">
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

            <!-- Przycisk resetowania -->
            <div>
              <button
                type="submit"
                :disabled="isLoading"
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <ArrowPathIcon class="animate-spin h-5 w-5 text-white" />
                </span>
                {{ isLoading ? 'Wysyłanie...' : 'Wyślij link resetujący' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Potwierdzenie wysłania -->
        <div v-else class="space-y-6">
          <!-- Komunikat sukcesu -->
          <div class="rounded-lg bg-green-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <CheckCircleIcon class="h-5 w-5 text-green-400" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800">
                  {{ successMessage }}
                </h3>
                <div class="mt-2 text-sm text-green-700">
                  <p>Sprawdź swoją skrzynkę e-mail i kliknij w link, aby zresetować hasło.</p>
                  <p class="mt-1">Jeśli nie widzisz wiadomości, sprawdź folder spam.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Przycisk ponownego wysłania -->
          <div>
            <button
              type="button"
              @click="resendEmail"
              class="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Wyślij ponownie
            </button>
          </div>
        </div>

        <!-- Linki pomocnicze -->
        <div class="mt-6 text-center space-y-2">
          <div>
            <button
              type="button"
              @click="goToLogin"
              class="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
            >
              Powrót do logowania
            </button>
          </div>
          <div>
            <button
              type="button"
              @click="goToRegister"
              class="text-sm text-gray-600 hover:text-gray-500 transition-colors"
            >
              Nie masz konta? Zarejestruj się
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
