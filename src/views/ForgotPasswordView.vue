<template>
  <AuthLayout>
    <div>
      <h2 class="text-2xl font-bold text-gray-900 text-center mb-8">Odzyskaj hasło</h2>
      
      <div v-if="!emailSent" class="space-y-6">
        <p class="text-sm text-gray-600 text-center">
          Wprowadź swój adres email, a wyślemy Ci link do resetowania hasła.
        </p>
        
        <form @submit.prevent="handleResetPassword" class="space-y-6">
          <!-- input email do resetowania hasla-->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Adres e-mail
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="twoj@email.com"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- blad resetowania hasla -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex">
              <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="ml-3">
                <p class="text-sm text-red-800">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- przycisk resetowania hasla -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Wysyłanie...' : 'Wyślij link resetujący' }}
          </button>

          <!-- wroc do logowania -->
          <div class="text-center">
            <router-link
              to="/login"
              class="text-sm text-blue-600 hover:text-blue-500 transition duration-200"
            >
              ← Wróć do logowania
            </router-link>
          </div>
        </form>
      </div>

      <!-- resetowanie hasla -->
      <div v-else class="text-center space-y-6">
        <div class="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Email został wysłany!</h3>
          <p class="text-sm text-gray-600 mb-4">
            Wysłaliśmy link do resetowania hasła na adres <strong>{{ form.email }}</strong>
          </p>
          <p class="text-xs text-gray-500">
            Sprawdź swoją skrzynkę odbiorczą i folder ze spamem. Link jest ważny przez 1 godzinę.
          </p>
        </div>

        <div class="space-y-3">
          <button
            @click="resendEmail"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Wysyłanie...' : 'Wyślij ponownie' }}
          </button>
          
          <router-link
            to="/login"
            class="block w-full text-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
          >
            Wróć do logowania
          </router-link>
        </div>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuth } from '../composables/useAuth';
import AuthLayout from '../layouts/AuthLayout.vue';

const { resetPassword, loading, error, clearError } = useAuth();

const emailSent = ref(false);

const form = reactive({
  email: ''
});

const errors = reactive({
  email: ''
});

const validateForm = () => {
  errors.email = '';
  
  if (!form.email) {
    errors.email = 'Adres email jest wymagany';
    return false;
  }
  
  return true;
};

const handleResetPassword = async () => {
  clearError();
  
  if (!validateForm()) {
    return;
  }
  
  const result = await resetPassword(form.email);
  
  if (result.success) {
    emailSent.value = true;
  }
};

const resendEmail = async () => {
  clearError();
  const result = await resetPassword(form.email);
  
  if (result.success) {
    console.log('Email resent successfully');
  }
};
</script>
