<template>
  <div class="w-1/4">
    <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
      <h2 class="mb-6 text-xl font-bold text-gray-900 dark:text-white">Filtry</h2>

      <!-- filtr ceny -->
      <div class="mb-6">
        <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">Przedział cenowy</p>
        <div class="mb-2 flex items-center gap-4">
          <input
            :value="modelValue.priceMin"
            type="number"
            class="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Min"
            @input="updateField('priceMin', Number(($event.target as HTMLInputElement).value))"
          />
          <span class="text-gray-500">-</span>
          <input
            :value="modelValue.priceMax"
            type="number"
            class="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Max"
            @input="updateField('priceMax', Number(($event.target as HTMLInputElement).value))"
          />
        </div>
      </div>

      <!-- filtr przesiadek -->
      <div class="mb-6">
        <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">
          Maksymalna liczba przesiadek
        </p>
        <select
          :value="modelValue.maxStops"
          class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          @change="updateField('maxStops', ($event.target as HTMLSelectElement).value)"
        >
          <option value="0">Bez przesiadek</option>
          <option value="1">1 przesiadka</option>
          <option value="2">2 przesiadki</option>
          <option value="3">3+ przesiadki</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FlightFiltersType } from '@/types/flight';

interface Props {
  modelValue: FlightFiltersType;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: FlightFiltersType): void;
}>();

const updateField = (field: keyof FlightFiltersType, value: number | string) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value });
};
</script>
