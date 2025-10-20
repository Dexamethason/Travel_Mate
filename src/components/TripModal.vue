<template>
  <div 
    v-if="show"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
        {{ isEditing ? 'Edytuj trip' : 'Stwórz nowy trip' }}
      </h3>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1">Nazwa podróży</label>
          <input 
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Np. Wakacje w Paryżu"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1">Budżet (zł)</label>
          <input 
            v-model.number="form.budget"
            type="number"
            required
            min="0"
            step="0.01"
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="0.00"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">Uczestnicy</label>
          <div class="space-y-2 mb-3">
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
                class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input 
                v-model="participant.lastName"
                type="text"
                required
                placeholder="Nazwisko"
                class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button 
                type="button"
                @click="removeParticipant(index)"
                class="px-3 py-2 rounded-lg border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <button 
            type="button"
            @click="addParticipant"
            class="w-full px-3 py-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
          >
            + Dodaj uczestnika
          </button>
        </div>

        <div class="flex gap-3 pt-4">
          <button 
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Anuluj
          </button>
          <button 
            v-if="isEditing"
            type="button"
            @click="$emit('delete')"
            class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
          >
            Usuń trip
          </button>
          <button 
            type="submit"
            class="flex-1 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
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
  participants: []
});

const addParticipant = () => {
  form.value.participants.push({
    id: `temp-${Date.now()}`,
    firstName: '',
    lastName: ''
  });
};

const removeParticipant = (index: number) => {
  form.value.participants.splice(index, 1);
};

const handleSubmit = () => {
  emit('submit', { ...form.value });
};

// Reset modulu formularza kiedy modal jest otwarty/zamknięty lub dane początkowe się zmienia
watch([() => props.show, () => props.initialData], () => {
  if (props.show) {
    if (props.initialData) {
      form.value = {
        name: props.initialData.name,
        budget: props.initialData.budget,
        participants: JSON.parse(JSON.stringify(props.initialData.participants))
      };
    } else {
      form.value = {
        name: '',
        budget: 0,
        participants: []
      };
    }
  }
}, { immediate: true });
</script>

<script lang="ts">
export default {
  name: 'TripModal'
};
</script>
