<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <div class="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-6">
      <div class="text-center">
        <h1 class="text-2xl font-semibold text-blue-600">Travel Mate</h1>
        <p class="mt-2 text-gray-600">Utwórz konto w Travel Mate</p>
      </div>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Imię</label>
            <input v-model="firstName" class="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2" />
            <p v-if="errors.firstName" class="text-red-500 text-sm mt-1">{{ errors.firstName }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Nazwisko</label>
            <input v-model="lastName" class="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2" />
            <p v-if="errors.lastName" class="text-red-500 text-sm mt-1">{{ errors.lastName }}</p>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" class="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2" />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Hasło</label>
          <input v-model="password" type="password" class="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2" />
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
          
          <!-- Password requirements -->
          <div v-if="password && passwordErrors.length > 0" class="mt-2 space-y-1">
            <p class="text-sm font-medium text-gray-700">Hasło musi spełniać następujące wymagania:</p>
            <ul class="list-disc list-inside space-y-1">
              <li v-for="(error, index) in passwordErrors" 
                  :key="index" 
                  class="text-sm text-red-500 ml-2">
                {{ error }}
              </li>
            </ul>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Potwierdź hasło</label>
          <input v-model="confirmPassword" type="password" class="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2" />
          <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">{{ errors.confirmPassword }}</p>
        </div>

        <div class="flex items-center">
          <input type="checkbox" v-model="accepted" class="h-4 w-4 text-blue-600" />
          <label class="ml-2 text-sm">Akceptuję regulamin i politykę prywatności</label>
        </div>
        <p v-if="errors.accepted" class="text-red-500 text-sm">{{ errors.accepted }}</p>

        <div>
          <button :disabled="loading" type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md disabled:opacity-60">
            <span v-if="!loading">Zarejestruj się</span>
            <span v-else>Rejestrowanie...</span>
          </button>
        </div>

        <p v-if="serverError" class="text-red-500 text-sm text-center">{{ serverError }}</p>

        <div class="text-center text-sm">
          Masz już konto? <router-link to="/login" class="text-blue-600">Zaloguj się</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { validatePassword } from '../utils/passwordValidation';

export default {
  name: 'RegisterView',
  setup() {
    const firstName = ref('');
    const lastName = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const accepted = ref(false);
    const serverError = ref('');
    const errors = ref<{ [k: string]: string }>({});
    const passwordErrors = ref<string[]>([]);
    const loading = ref(false);
    const router = useRouter();

    // Validate password in real-time as user types
    watch(password, (newPassword) => {
      if (newPassword) {
        const validation = validatePassword(newPassword);
        passwordErrors.value = validation.errors;
      } else {
        passwordErrors.value = [];
      }
    });

    const validate = () => {
      errors.value = {};
      if (!firstName.value) errors.value.firstName = 'Imię jest wymagane';
      if (!lastName.value) errors.value.lastName = 'Nazwisko jest wymagane';
      if (!email.value) errors.value.email = 'Email jest wymagany';
      
      // Password validation
      if (!password.value) {
        errors.value.password = 'Hasło jest wymagane';
      } else {
        const validation = validatePassword(password.value);
        if (!validation.isValid && validation.errors.length > 0) {
          errors.value.password = validation.errors[0] || 'Nieprawidłowe hasło';
        }
      }

      if (password.value !== confirmPassword.value) {
        errors.value.confirmPassword = 'Hasła nie są identyczne';
      }
      
      if (!accepted.value) errors.value.accepted = 'Musisz zaakceptować regulamin';
      return Object.keys(errors.value).length === 0;
    };

    const registerUser = async () => {
      serverError.value = '';
      loading.value = true;
      try {
        const res = await fetch('/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName: firstName.value, lastName: lastName.value, email: email.value, password: password.value })
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (data?.errors && typeof data.errors === 'object') {
            errors.value = { ...errors.value, ...data.errors };
            serverError.value = data?.message || 'Wystąpiły błędy walidacji';
          } else {
            serverError.value = data?.message || 'Błąd rejestracji';
          }
          return;
        }

        router.push('/login');
      } catch (err) {
        serverError.value = (err as Error).message || 'Błąd sieci';
      } finally {
        loading.value = false;
      }
    };

    const onSubmit = async () => {
      if (!validate()) return;
      await registerUser();
    };

    return { 
      firstName, 
      lastName, 
      email, 
      password, 
      confirmPassword, 
      accepted, 
      serverError, 
      errors, 
      passwordErrors, 
      onSubmit, 
      loading 
    };
  }
};
</script>

