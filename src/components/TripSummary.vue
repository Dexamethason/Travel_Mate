<template>
  <div class="mb-6">
    <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Podsumowanie</h2>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div
        class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
      >
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Całkowity budżet</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(budget) }}</p>
      </div>
      <div
        class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
      >
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Wydane</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ formatCurrency(totalSpent) }}
        </p>
      </div>
      <div
        class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
      >
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pozostało</p>
        <p
          class="text-2xl font-bold"
          :class="
            remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          "
        >
          {{ formatCurrency(remaining) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  budget: number;
  totalSpent: number;
}

const props = defineProps<Props>();

const remaining = computed(() => {
  return props.budget - props.totalSpent;
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(amount);
};
</script>

<script lang="ts">
export default {
  name: 'TripSummary',
};
</script>
