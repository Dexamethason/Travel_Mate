<template>
  <div 
    v-if="show"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
        {{ isEditing ? 'Edytuj wydatek' : 'Dodaj wydatek' }}
      </h3>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1">Data</label>
          <input 
            v-model="form.date"
            type="date"
            required
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1">Kategoria</label>
          <select 
            v-model="form.category"
            required
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Wybierz kategorię</option>
            <option value="Loty">Loty</option>
            <option value="Noclegi">Noclegi</option>
            <option value="Jedzenie">Jedzenie</option>
            <option value="Atrakcje">Atrakcje</option>
            <option value="Transport">Transport</option>
            <option value="Inne">Inne</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1">Opis</label>
          <input 
            v-model="form.description"
            type="text"
            required
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Np. Bilet lotniczy do Paryża"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1">Kwota całkowita (zł)</label>
          <input 
            v-model.number="form.amount"
            type="number"
            required
            min="0"
            step="0.01"
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="0.00"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">Podział kosztów</label>
          <div class="space-y-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div 
              v-for="participant in participants" 
              :key="participant.id"
              class="flex items-center gap-3"
            >
              <input 
                type="checkbox"
                :id="`participant-${participant.id}`"
                v-model="form.selectedParticipants"
                :value="participant.id"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label :for="`participant-${participant.id}`" class="flex-1 text-sm text-gray-900 dark:text-white">
                {{ participant.firstName }} {{ participant.lastName }}
              </label>
              <input 
                v-if="form.selectedParticipants.includes(participant.id)"
                v-model.number="form.participantAmounts[participant.id]"
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                class="w-32 px-3 py-1 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div v-if="splitTotal > 0" class="pt-2 border-t border-gray-300 dark:border-gray-600">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Suma podziału:</span>
                <span :class="splitTotal === form.amount ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'" class="font-semibold">
                  {{ formatCurrency(splitTotal) }}
                </span>
              </div>
              <div v-if="splitTotal !== form.amount" class="text-xs text-red-600 dark:text-red-400 mt-1">
                Suma podziału musi być równa kwocie całkowitej
              </div>
            </div>
          </div>
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
            type="submit"
            :disabled="splitTotal !== form.amount || form.selectedParticipants.length === 0"
            class="flex-1 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isEditing ? 'Zapisz zmiany' : 'Dodaj wydatek' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Participant } from '../types/trip';
import type { Expense, SplitParticipant } from '../types/expense';

interface ExpenseForm {
  date: string;
  category: string;
  description: string;
  amount: number;
  selectedParticipants: string[];
  participantAmounts: Record<string, number>;
}

interface Props {
  show: boolean;
  isEditing: boolean;
  participants: Participant[];
  initialData?: Expense;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  submit: [data: {
    date: string;
    category: string;
    description: string;
    amount: number;
    splitWith: SplitParticipant[];
  }];
}>();

const form = ref<ExpenseForm>({
  date: '',
  category: '',
  description: '',
  amount: 0,
  selectedParticipants: [],
  participantAmounts: {}
});

const splitTotal = computed(() => {
  return Object.values(form.value.participantAmounts).reduce((sum, amount) => sum + (amount || 0), 0);
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN'
  }).format(amount);
};

const handleSubmit = () => {
  const splitWith: SplitParticipant[] = form.value.selectedParticipants.map(participantId => ({
    participantId,
    amount: form.value.participantAmounts[participantId] || 0
  }));

  emit('submit', {
    date: form.value.date,
    category: form.value.category,
    description: form.value.description,
    amount: form.value.amount,
    splitWith
  });
};

// Reset modulu formularza kiedy modal jest otwarty/zamknięty lub dane początkowe się zmienia
watch([() => props.show, () => props.initialData], () => {
  if (props.show) {
    if (props.initialData) {
      const participantAmounts: Record<string, number> = {};
      const selectedParticipants: string[] = [];
      
      props.initialData.splitWith.forEach(split => {
        participantAmounts[split.participantId] = split.amount;
        selectedParticipants.push(split.participantId);
      });
      
      form.value = {
        date: props.initialData.date,
        category: props.initialData.category,
        description: props.initialData.description,
        amount: props.initialData.amount,
        selectedParticipants,
        participantAmounts
      };
    } else {
      const today = new Date().toISOString().split('T')[0] || '';
      form.value = {
        date: today,
        category: '',
        description: '',
        amount: 0,
        selectedParticipants: [],
        participantAmounts: {}
      };
    }
  }
}, { immediate: true });

// Monitoruje zmiany wybranych uczestników
watch(() => form.value.selectedParticipants, (newSelected, oldSelected) => {
  // Usuwa kwoty dla odznaczonych uczestników
  if (oldSelected) {
    oldSelected.forEach(id => {
      if (!newSelected.includes(id)) {
        delete form.value.participantAmounts[id];
      }
    });
  }
  
  // Automatycznie dzieli kwotę równo między wybranych uczestników (coś chujowo dziala)
  if (newSelected.length > 0 && form.value.amount > 0) {
    const amountPerPerson = form.value.amount / newSelected.length;
    newSelected.forEach(id => {
      if (!form.value.participantAmounts[id]) {
        form.value.participantAmounts[id] = Math.round(amountPerPerson * 100) / 100;
      }
    });
  }
});
</script>

<script lang="ts">
export default {
  name: 'ExpenseModal'
};
</script>
