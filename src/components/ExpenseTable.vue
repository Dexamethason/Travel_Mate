<template>
  <div class="mb-6">
    <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Wydatki</h2>
    <div
      v-if="expenses.length === 0"
      class="rounded-lg border border-gray-200 bg-white py-8 text-center dark:border-gray-700 dark:bg-gray-800"
    >
      <p class="text-gray-600 dark:text-gray-400">
        Brak wydatków. Dodaj pierwszy wydatek, aby rozpocząć śledzenie kosztów.
      </p>
    </div>
    <div
      v-else
      class="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="border-b border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
            <tr>
              <th class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">Data</th>
              <th class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">Kategoria</th>
              <th class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">Opis</th>
              <th class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">Kwota</th>
              <th class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                Podzielone z
              </th>
              <th class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">Akcje</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="expense in expenses"
              :key="expense.id"
              class="border-t border-gray-200 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                {{ formatDate(expense.date) }}
              </td>
              <td class="px-4 py-3 text-sm">
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  :class="getCategoryClass(expense.category)"
                >
                  {{ expense.category }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                {{ expense.description }}
              </td>
              <td class="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                {{ formatCurrency(expense.amount) }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                {{ formatSplitWith(expense.splitWith, participants) }}
              </td>
              <td class="px-4 py-3 text-sm">
                <div class="flex gap-2">
                  <button
                    class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    @click="$emit('edit-expense', expense)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                      />
                    </svg>
                  </button>
                  <button
                    v-if="expense.id"
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    @click="$emit('delete-expense', expense.id)"
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
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Expense, SplitParticipant } from '../types/expense';
import type { Participant } from '../types/trip';

interface Props {
  expenses: Expense[];
  participants: Participant[];
}

defineProps<Props>();

defineEmits<{
  'edit-expense': [expense: Expense];
  'delete-expense': [id: string];
}>();

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL');
};

const getCategoryClass = (category: string) => {
  const classes: Record<string, string> = {
    Loty: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    Noclegi: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    Jedzenie: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Atrakcje: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Transport: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    Inne: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  };
  return classes[category] || classes['Inne'];
};

const formatSplitWith = (splitWith: SplitParticipant[], participants: Participant[]) => {
  const names = splitWith
    .map(split => {
      const participant = participants.find(p => p.id === split.participantId);
      return participant ? `${participant.firstName}` : '';
    })
    .filter(Boolean);

  return names.join(', ');
};
</script>

<script lang="ts">
export default {
  name: 'ExpenseTable',
};
</script>
