<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <div class="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-6">
      <div class="text-center">
        <h1 class="text-2xl font-semibold text-blue-600">Travel Mate</h1>
        <p class="mt-2 text-gray-600">Zaloguj się do Travel Mate</p>
      </div>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" class="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2" />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Hasło</label>
          <input v-model="password" type="password" class="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2" />
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center space-x-2 text-sm">
            <input type="checkbox" v-model="remember" class="h-4 w-4 text-blue-600" />
            <span>Zapamiętaj mnie</span>
          </label>
          <router-link to="/forgot-password" class="text-sm text-blue-600">Nie pamiętasz hasła?</router-link>
        </div>

        <div>
          <button :disabled="loading" type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md disabled:opacity-60">
            <span v-if="!loading">Zaloguj się</span>
            <span v-else>Logowanie...</span>
          </button>
        </div>

        <p v-if="serverError" class="text-red-500 text-sm text-center">{{ serverError }}</p>

        <div class="text-center text-sm">
          Nie masz konta? <router-link to="/register" class="text-blue-600">Zarejestruj się</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginView',
  setup() {
    const email = ref('');
    const password = ref('');
    const remember = ref(false);
  const serverError = ref('');
  const errors = ref<{ [k: string]: string }>({});
  const loading = ref(false);
    const router = useRouter();

    const validate = () => {
      errors.value = {};
      if (!email.value) errors.value.email = 'Email jest wymagany';
      if (!password.value) errors.value.password = 'Hasło jest wymagane';
      return Object.keys(errors.value).length === 0;
    };

    const loginUser = async () => {
      serverError.value = '';
      loading.value = true;
      try {
        const res = await fetch('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.value, password: password.value })
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          // handle validation errors if backend returns object with errors
          if (data?.errors && typeof data.errors === 'object') {
            errors.value = { ...errors.value, ...data.errors };
            serverError.value = data?.message || 'Wystąpiły błędy walidacji';
          } else {
            // Display the error message from the server or a default message
            serverError.value = data?.message || 'Nie udało się zalogować. Sprawdź swoje dane i spróbuj ponownie.';
          }
          return;
        }

        const { token } = data;
        if (token) {
          localStorage.setItem('token', token);
        }

        // Use named route to match router config (Dashboard is registered as name)
        router.push({ name: 'Dashboard' });
      } catch (err) {
        serverError.value = (err as Error).message || 'Problem z połączeniem. Spróbuj ponownie później.';
      } finally {
        loading.value = false;
      }
    };

    const onSubmit = async () => {
      if (!validate()) return;
      await loginUser();
    };

    return { email, password, remember, serverError, errors, onSubmit, loading };
  }
};
</script>

