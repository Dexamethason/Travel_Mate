<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="$emit('close')"
  >
    <div
      class="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800"
    >
      <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        {{ isEditing ? 'Edytuj trip' : 'Stwórz nowy trip' }}
      </h3>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
            >Nazwa podróży</label
          >
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Np. Wakacje w Paryżu"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
            >Budżet (zł)</label
          >
          <input
            v-model.number="form.budget"
            type="number"
            required
            min="0"
            step="0.01"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="0.00"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >Uczestnicy</label
          >
          <div class="mb-3 space-y-2">
            <div
              v-for="(participant, index) in form.participants"
              :key="participant.id"
              class="flex gap-2"
            >
              <input
                v-model="participant.firstName"
                type="text"
                required
                placeholder="Imię"
                class="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <input
                v-model="participant.lastName"
                type="text"
                required
                placeholder="Nazwisko"
                class="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                class="rounded-lg border border-red-300 px-3 py-2 text-red-600 transition-colors hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                @click="removeParticipant(index)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          <button
            type="button"
            class="w-full rounded-lg border-2 border-dashed border-gray-300 px-3 py-2 text-gray-600 transition-colors hover:border-blue-500 hover:text-blue-500 dark:border-gray-600 dark:text-gray-400"
            @click="addParticipant"
          >
            + Dodaj uczestnika
          </button>
        </div>

        <div class="flex gap-3 pt-4">
          <button
            type="button"
            class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            @click="$emit('close')"
          >
            Anuluj
          </button>
          <button
            v-if="isEditing"
            type="button"
            class="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
            @click="$emit('delete')"
          >
            Usuń trip
          </button>
          <button
            type="submit"
            class="flex-1 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-600"
          >
            {{ isEditing ? 'Zapisz zmiany' : 'Utwórz trip' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Participant } from '../types/trip';

interface TripForm {
  name: string;
  budget: number;
  participants: Participant[];
}

interface Props {
  show: boolean;
  isEditing: boolean;
  initialData?: TripForm;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  submit: [data: TripForm];
  delete: [];
}>();

const form = ref<TripForm>({
  name: '',
  budget: 0,
  participants: [],
});

const addParticipant = () => {
  form.value.participants.push({
    id: `temp-${Date.now()}`,
    firstName: '',
    lastName: '',
  });
};

const removeParticipant = (index: number) => {
  form.value.participants.splice(index, 1);
};

const handleSubmit = () => {
  emit('submit', { ...form.value });
};

// Reset modulu formularza kiedy modal jest otwarty/zamknięty lub dane początkowe się zmienia
watch(
  [() => props.show, () => props.initialData],
  () => {
    if (props.show) {
      if (props.initialData) {
        form.value = {
          name: props.initialData.name,
          budget: props.initialData.budget,
          participants: JSON.parse(JSON.stringify(props.initialData.participants)),
        };
      } else {
        form.value = {
          name: '',
          budget: 0,
          participants: [],
        };
      }
    }
  },
  { immediate: true }
);
</script>

<script lang="ts">
export default {
  name: 'TripModal',
};
</script>
