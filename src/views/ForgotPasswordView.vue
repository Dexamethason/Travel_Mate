<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <div class="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-6">
      <div class="text-center">
        <h1 class="text-2xl font-semibold text-blue-600">Travel Mate</h1>
        <p class="mt-2 text-gray-600">Odzyskaj swoje hasło</p>
      </div>

      <p class="text-sm text-gray-600">Podaj adres e-mail, na który wyślemy link do zresetowania hasła.</p>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" class="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2" />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <div>
          <button :disabled="loading" type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md disabled:opacity-60">
            <span v-if="!loading">Wyślij link resetujący</span>
            <span v-else>Wysyłanie...</span>
          </button>
        </div>

        <p v-if="successMessage" class="text-green-600 text-sm text-center">{{ successMessage }}</p>
        <p v-if="serverError" class="text-red-500 text-sm text-center">{{ serverError }}</p>

        <div class="text-center text-sm">
          <router-link to="/login" class="text-blue-600">Wróć do logowania</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';

export default {
  name: 'ForgotPasswordView',
  setup() {
    const email = ref('');
  const serverError = ref('');
  const successMessage = ref('');
  const errors = ref<{ [k: string]: string }>({});
  const loading = ref(false);

    const validate = () => {
      errors.value = {};
      if (!email.value) errors.value.email = 'Email jest wymagany';
      return Object.keys(errors.value).length === 0;
    };

    const sendReset = async () => {
      serverError.value = '';
      successMessage.value = '';
      loading.value = true;
      try {
        const res = await fetch('/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.value })
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          serverError.value = data?.message || 'Błąd podczas wysyłania linku';
          return;
        }

        successMessage.value = 'Wysłaliśmy wiadomość e-mail z linkiem do resetu hasła.';
      } catch (err) {
        serverError.value = (err as Error).message || 'Błąd sieci';
      } finally {
        loading.value = false;
      }
    };

    const onSubmit = async () => {
      if (!validate()) return;
      await sendReset();
    };

    return { email, serverError, successMessage, errors, onSubmit, loading };
  }
};
</script>

