<template>
  <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
    <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
      🤖 Planer podróży z AI
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label for="destination" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            🗺️ Cel podróży *
          </label>
          <input
            id="destination"
            v-model="formData.destination"
            type="text"
            required
            placeholder="np. Paryż, Tokio, Włochy"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label for="participants" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            👥 Liczba uczestników *
          </label>
          <input
            id="participants"
            v-model.number="formData.participants"
            type="number"
            min="1"
            required
            placeholder="1"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label for="start_date" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            📅 Data wyjazdu *
          </label>
          <input
            id="start_date"
            v-model="formData.start_date"
            type="date"
            required
            :min="today"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label for="end_date" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            📅 Data powrotu *
          </label>
          <input
            id="end_date"
            v-model="formData.end_date"
            type="date"
            required
            :min="formData.start_date || today"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label for="budget" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            💰 Budżet całkowity (PLN) *
          </label>
          <input
            id="budget"
            v-model.number="formData.budget"
            type="number"
            min="0"
            step="100"
            required
            placeholder="5000"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label for="transport" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            ✈️ Środek transportu *
          </label>
          <select
            id="transport"
            v-model="formData.transport"
            required
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Wybierz transport</option>
            <option value="samolot">✈️ Samolot</option>
            <option value="samochód">🚗 Samochód</option>
            <option value="pociąg">🚂 Pociąg</option>
            <option value="autobus">🚌 Autobus</option>
            <option value="inne">🚶 Inne</option>
          </select>
        </div>

        <div>
          <label for="accommodation" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            🏨 Typ noclegu *
          </label>
          <select
            id="accommodation"
            v-model="formData.accommodation"
            required
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Wybierz nocleg</option>
            <option value="hotel">🏨 Hotel</option>
            <option value="hostel">🏠 Hostel</option>
            <option value="apartament">🏢 Apartament</option>
            <option value="camping">⛺ Camping</option>
            <option value="inne">🛏️ Inne</option>
          </select>
        </div>

        <div>
          <label for="intensity" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            ⚡ Intensywność planu
          </label>
          <select
            id="intensity"
            v-model="formData.intensity"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="relaxed">😌 Spokojny (relaks i odpoczynek)</option>
            <option value="moderate">🚶 Umiarkowany (zrównoważony)</option>
            <option value="active">🏃 Aktywny (pełen atrakcji)</option>
          </select>
        </div>
      </div>

      <div>
        <label class="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
          🎯 Zainteresowania (wybierz przynajmniej jedno) *
        </label>
        <div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          <label
            v-for="interest in interestOptions"
            :key="interest.value"
            class="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 p-3 transition-all hover:border-blue-500 dark:border-gray-600"
            :class="{
              'border-blue-500 bg-blue-50 dark:bg-blue-900/20': formData.interests.includes(interest.value),
            }"
          >
            <input
              type="checkbox"
              :value="interest.value"
              v-model="formData.interests"
              class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span class="text-sm dark:text-gray-300">{{ interest.icon }} {{ interest.label }}</span>
          </label>
        </div>
      </div>

      <div>
        <label for="must_visit" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          ✨ Miejsca, które chcesz odwiedzić (opcjonalne, oddziel przecinkami)
        </label>
        <input
          id="must_visit"
          v-model="mustVisitInput"
          type="text"
          placeholder="np. Wieża Eiffla, Luwr, Notre Dame"
          class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label for="avoid" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          ⛔ Miejsca, których chcesz uniknąć (opcjonalne, oddziel przecinkami)
        </label>
        <input
          id="avoid"
          v-model="avoidInput"
          type="text"
          placeholder="np. Tłumy turystów, drogie restauracje"
          class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div class="flex items-center justify-end gap-4">
        <button
          type="button"
          @click="resetForm"
          class="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Wyczyść
        </button>
        <button
          type="submit"
          :disabled="!isFormValid || generating"
          class="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          <span v-if="generating" class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          <span>{{ generating ? 'Generuję plan...' : '🤖 Wygeneruj plan' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { INTERESTS_OPTIONS } from '../types/plan';
import type { PlannerInput } from '../types/plan';

const emit = defineEmits<{
  generate: [input: PlannerInput];
}>();

const props = defineProps<{
  generating?: boolean;
}>();

// dzisiejsza data jako min.
const today = computed(() => {
  const date = new Date();
  return date.toISOString().split('T')[0];
});

const interestOptions = INTERESTS_OPTIONS;

// dane formularza
const formData = ref<PlannerInput>({
  destination: '',
  start_date: '',
  end_date: '',
  budget: 5000,
  participants: 1,
  interests: [],
  transport: '',
  accommodation: '',
  intensity: 'moderate',
});

const mustVisitInput = ref('');
const avoidInput = ref('');

// walidacja formularza
const isFormValid = computed(() => {
  return (
    formData.value.destination.trim() !== '' &&
    formData.value.start_date !== '' &&
    formData.value.end_date !== '' &&
    formData.value.budget > 0 &&
    formData.value.participants > 0 &&
    formData.value.interests.length > 0 &&
    formData.value.transport !== '' &&
    formData.value.accommodation !== ''
  );
});

// obsługa wysyłki formularza
const handleSubmit = () => {
  if (!isFormValid.value || props.generating) return;

  const input: PlannerInput = {
    ...formData.value,
    must_visit: mustVisitInput.value
      ? mustVisitInput.value.split(',').map(s => s.trim()).filter(Boolean)
      : undefined,
    avoid: avoidInput.value
      ? avoidInput.value.split(',').map(s => s.trim()).filter(Boolean)
      : undefined,
  };

  emit('generate', input);
};

// reset
const resetForm = () => {
  formData.value = {
    destination: '',
    start_date: '',
    end_date: '',
    budget: 5000,
    participants: 1,
    interests: [],
    transport: '',
    accommodation: '',
    intensity: 'moderate',
  };
  mustVisitInput.value = '';
  avoidInput.value = '';
};
</script>

