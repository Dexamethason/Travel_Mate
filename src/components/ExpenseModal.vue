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
        {{ isEditing ? 'Edytuj wydatek' : 'Dodaj wydatek' }}
      </h3>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-900 dark:text-white">Data</label>
          <input
            v-model="form.date"
            type="date"
            required
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
            >Kategoria</label
          >
          <select
            v-model="form.category"
            required
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
          <label class="mb-1 block text-sm font-medium text-gray-900 dark:text-white">Opis</label>
          <input
            v-model="form.description"
            type="text"
            required
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Np. Bilet lotniczy do Paryża"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
            >Kwota całkowita (zł)</label
          >
          <input
            v-model.number="form.amount"
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
            >Podział kosztów</label
          >
          <div class="space-y-2 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div
              v-for="participant in participants"
              :key="participant.id"
              class="flex items-center gap-3"
            >
              <input
                :id="`participant-${participant.id}`"
                v-model="form.selectedParticipants"
                type="checkbox"
                :value="participant.id"
                class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
              />
              <label
                :for="`participant-${participant.id}`"
                class="flex-1 text-sm text-gray-900 dark:text-white"
              >
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
                class="w-32 rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div v-if="splitTotal > 0" class="border-t border-gray-300 pt-2 dark:border-gray-600">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Suma podziału:</span>
                <span
                  :class="
                    splitTotal === form.amount
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  "
                  class="font-semibold"
                >
                  {{ formatCurrency(splitTotal) }}
                </span>
              </div>
              <div
                v-if="splitTotal !== form.amount"
                class="mt-1 text-xs text-red-600 dark:text-red-400"
              >
                Suma podziału musi być równa kwocie całkowitej
              </div>
            </div>
          </div>
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
            type="submit"
            :disabled="splitTotal !== form.amount || form.selectedParticipants.length === 0"
            class="flex-1 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
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
  submit: [
    data: {
      date: string;
      category: string;
      description: string;
      amount: number;
      splitWith: SplitParticipant[];
    },
  ];
}>();

const form = ref<ExpenseForm>({
  date: '',
  category: '',
  description: '',
  amount: 0,
  selectedParticipants: [],
  participantAmounts: {},
});

const splitTotal = computed(() => {
  return Object.values(form.value.participantAmounts).reduce(
    (sum, amount) => sum + (amount || 0),
    0
  );
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(amount);
};

const handleSubmit = () => {
  const splitWith: SplitParticipant[] = form.value.selectedParticipants.map(participantId => ({
    participantId,
    amount: form.value.participantAmounts[participantId] || 0,
  }));

  emit('submit', {
    date: form.value.date,
    category: form.value.category,
    description: form.value.description,
    amount: form.value.amount,
    splitWith,
  });
};

// Reset modulu formularza kiedy modal jest otwarty/zamknięty lub dane początkowe się zmienia
watch(
  [() => props.show, () => props.initialData],
  () => {
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
          participantAmounts,
        };
      } else {
        const today = new Date().toISOString().split('T')[0] || '';
        form.value = {
          date: today,
          category: '',
          description: '',
          amount: 0,
          selectedParticipants: [],
          participantAmounts: {},
        };
      }
    }
  },
  { immediate: true }
);

// Monitoruje zmiany wybranych uczestników
watch(
  () => form.value.selectedParticipants,
  (newSelected, oldSelected) => {
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
  }
);
</script>

<script lang="ts">
export default {
  name: 'ExpenseModal',
};
</script>
