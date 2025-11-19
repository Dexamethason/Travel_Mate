<template>
  <div
    class="mb-8 flex flex-wrap items-end gap-4 rounded-lg bg-white px-4 py-3 shadow-sm dark:bg-gray-800"
  >
    <!-- Wylot z -->
    <LocationInput
      :model-value="modelValue.from"
      label="Wylot z"
      placeholder="Warszawa"
      @update:model-value="updateField('from', $event)"
    />

    <!-- Przycisk zamiany -->
    <button
      type="button"
      class="mb-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-blue-900 dark:hover:text-blue-400"
      title="Zamień miejsca"
      @click="swapLocations"
    >
      <ArrowsRightLeftIcon class="h-5 w-5" />
    </button>

    <!-- Lot do -->
    <LocationInput
      :model-value="modelValue.to"
      label="Lot do"
      placeholder="Paryż"
      @update:model-value="updateField('to', $event)"
    />

    <!-- Daty -->
    <DateRangePicker
      :departure="modelValue.departure"
      :return-date="modelValue.return"
      @update:departure="updateField('departure', $event)"
      @update:return-date="updateField('return', $event)"
    />

    <!-- Pasażerowie -->
    <TravelersSelector
      :adults="modelValue.adults"
      :children="modelValue.children"
      @update="updateTravelers"
    />

    <!-- Przycisk Szukaj -->
    <button
      class="flex h-12 flex-shrink-0 items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-600"
      @click="$emit('search')"
    >
      <MagnifyingGlassIcon class="h-5 w-5" />
      Szukaj
    </button>
  </div>
</template>

<script setup lang="ts">
import { ArrowsRightLeftIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import LocationInput from './FlightSearchFormComponents/LocationInput.vue';
import DateRangePicker from './FlightSearchFormComponents/DateRangePicker.vue';
import TravelersSelector from './FlightSearchFormComponents/TravelersSelector.vue';

import type { SearchForm } from '../../types/flight';

interface Props {
  modelValue: SearchForm;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: SearchForm): void;
  (e: 'search'): void;
}>();

const updateField = (field: keyof SearchForm, value: string | number) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value });
};

const updateTravelers = (value: { adults: number; children: number }) => {
  emit('update:modelValue', {
    ...props.modelValue,
    adults: value.adults,
    children: value.children,
  });
};

const swapLocations = () => {
  emit('update:modelValue', {
    ...props.modelValue,
    from: props.modelValue.to,
    to: props.modelValue.from,
  });
};
</script>
