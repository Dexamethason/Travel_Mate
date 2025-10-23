<template>
  <AuthLayout>
    <div>
      <h2 class="text-2xl font-bold text-gray-900 text-center mb-8">Zarejestruj się w Travel Mate</h2>
      
      <form @submit.prevent="handleRegister" class="space-y-6">
        <!-- Imię i Nazwisko -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Imię -->
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
              Imię
            </label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Jan"
              :class="{ 'border-red-500': errors.firstName }"
            />
            <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">{{ errors.firstName }}</p>
          </div>

          <!-- Nazwisko -->
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
              Nazwisko
            </label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Kowalski"
              :class="{ 'border-red-500': errors.lastName }"
            />
            <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">{{ errors.lastName }}</p>
          </div>
        </div>

        <!-- inputy do emaila -->
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

        <!-- inputy do hasla -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Hasło
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 pr-10"
              placeholder="Min. 8 znaków, duża litera, cyfra, znak specjalny"
              :class="{ 'border-red-500': errors.password }"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg v-if="showPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
              </svg>
            </button>
          </div>
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          
          <!-- wskaźnik siły hasła -->
          <div v-if="form.password && !errors.password" class="mt-2">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs text-gray-600">Siła hasła:</span>
              <div class="flex gap-1">
                <div 
                  v-for="i in 4" 
                  :key="i"
                  class="h-1 w-6 rounded"
                  :class="getPasswordStrengthColor(i)"
                ></div>
              </div>
            </div>
            <div class="text-xs text-gray-500">
              <div class="flex flex-wrap gap-2">
                <span :class="getRequirementClass('length')">8+ znaków</span>
                <span :class="getRequirementClass('uppercase')">Duża litera</span>
                <span :class="getRequirementClass('number')">Cyfra</span>
                <span :class="getRequirementClass('special')">Znak specjalny</span>
              </div>
            </div>
          </div>
        </div>

        <!-- input do potwiedzenia hasla-->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
            Potwierdź hasło
          </label>
          <div class="relative">
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 pr-10"
              placeholder="Powtórz hasło"
              :class="{ 'border-red-500': errors.confirmPassword }"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg v-if="showConfirmPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
              </svg>
            </button>
          </div>
          <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
        </div>

        <!-- checkbox regulaminow i polityki -->
        <div class="flex items-start">
          <input
            id="terms"
            v-model="form.acceptTerms"
            type="checkbox"
            required
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
          />
          <label for="terms" class="ml-2 block text-sm text-gray-700">
            Akceptuję 
            <a href="#" class="text-blue-600 hover:text-blue-500">warunki użytkowania</a>
            i 
            <a href="#" class="text-blue-600 hover:text-blue-500">politykę prywatności</a>
          </label>
        </div>
        <p v-if="errors.acceptTerms" class="text-sm text-red-600">{{ errors.acceptTerms }}</p>

        <!-- blad rejestracji -->
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

        <!-- wiadomosc o udanej rejestracji -->
        <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex">
            <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="ml-3">
              <p class="text-sm text-green-800">{{ successMessage }}</p>
            </div>
          </div>
        </div>

        <!-- przcycisk rejestracji -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Rejestracja...' : 'Zarejestruj się' }}
        </button>

        <!-- przekierowanie do loginu jezeli user ma konto -->
        <div class="text-center">
          <p class="text-sm text-gray-600">
            Masz już konto?
            <router-link
              to="/login"
              class="font-medium text-blue-600 hover:text-blue-500 transition duration-200"
            >
              Zaloguj się
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuth } from '../composables/useAuth';
import AuthLayout from '../layouts/AuthLayout.vue';


const { register, loading, error, clearError } = useAuth();

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const successMessage = ref('');

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
});

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: ''
});

const validateForm = () => {
  errors.firstName = '';
  errors.lastName = '';
  errors.email = '';
  errors.password = '';
  errors.confirmPassword = '';
  errors.acceptTerms = '';
  
  if (!form.firstName.trim()) {
    errors.firstName = 'Imię jest wymagane';
    return false;
  }
  
  if (!form.lastName.trim()) {
    errors.lastName = 'Nazwisko jest wymagane';
    return false;
  }
  
  if (!form.email) {
    errors.email = 'Adres email jest wymagany';
    return false;
  }
  
  if (!form.password) {
    errors.password = 'Hasło jest wymagane';
    return false;
  }
  
  if (form.password.length < 8) {
    errors.password = 'Hasło musi mieć co najmniej 8 znaków';
    return false;
  }
  
  // sprawdzenie czy hasło ma dużą literę
  if (!/[A-Z]/.test(form.password)) {
    errors.password = 'Hasło musi zawierać co najmniej jedną dużą literę';
    return false;
  }
  
  // sprawdzenie czy hasło ma cyfrę
  if (!/\d/.test(form.password)) {
    errors.password = 'Hasło musi zawierać co najmniej jedną cyfrę';
    return false;
  }
  
  // sprawdzenie czy hasło ma znak specjalny
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password)) {
    errors.password = 'Hasło musi zawierać co najmniej jeden znak specjalny (!@#$%^&* itp.)';
    return false;
  }
  
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Hasła nie są identyczne';
    return false;
  }
  
  if (!form.acceptTerms) {
    errors.acceptTerms = 'Musisz zaakceptować warunki użytkowania';
    return false;
  }
  
  return true;
};

// funkcje do wskaźnika siły hasła
const getPasswordStrength = () => {
  if (!form.password) return 0;
  
  let strength = 0;
  if (form.password.length >= 8) strength++;
  if (/[A-Z]/.test(form.password)) strength++;
  if (/\d/.test(form.password)) strength++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password)) strength++;
  
  return strength;
};

const getPasswordStrengthColor = (index: number) => {
  const strength = getPasswordStrength();
  if (index <= strength) {
    if (strength <= 1) return 'bg-red-500';
    if (strength <= 2) return 'bg-orange-500';
    if (strength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  }
  return 'bg-gray-200';
};

const getRequirementClass = (type: string) => {
  const password = form.password;
  let isValid = false;
  
  switch (type) {
    case 'length':
      isValid = password.length >= 8;
      break;
    case 'uppercase':
      isValid = /[A-Z]/.test(password);
      break;
    case 'number':
      isValid = /\d/.test(password);
      break;
    case 'special':
      isValid = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
      break;
  }
  
  return isValid ? 'text-green-600' : 'text-gray-400';
};

const handleRegister = async () => {
  clearError();
  successMessage.value = '';
  
  if (!validateForm()) {
    return;
  }
  
  const result = await register(form.email, form.password, form.firstName, form.lastName);
  
  if (result.success) {
    successMessage.value = 'Konto zostało utworzone! Sprawdź swój email, aby zweryfikować konto.';
    form.firstName = '';
    form.lastName = '';
    form.email = '';
    form.password = '';
    form.confirmPassword = '';
    form.acceptTerms = false;
  }
};
</script>
