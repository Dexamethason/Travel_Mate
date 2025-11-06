<template>
  <div
    class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
  >
    <div
      class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300"
    >
      {{ flight.airline.charAt(0) }}
    </div>

    <div class="flex flex-1 flex-col">
      <p class="text-base font-bold text-gray-900 dark:text-white">
        {{ flight.airline }}
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ flight.stops }}</p>
    </div>

    <div class="flex flex-col items-center">
      <p class="text-base font-bold text-gray-900 dark:text-white">
        {{ flight.departureTime }}
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ flight.departureAirport }}
      </p>
    </div>

    <svg class="mx-4 text-gray-400" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
      <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4z" />
    </svg>

    <div class="flex flex-col items-center">
      <p class="text-base font-bold text-gray-900 dark:text-white">
        {{ flight.arrivalTime }}
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ flight.arrivalAirport }}</p>
    </div>

    <div class="flex flex-col items-center">
      <p class="text-base font-bold text-gray-900 dark:text-white">
        {{ flight.duration }}
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ flight.type }}</p>
    </div>

    <p class="text-lg font-bold text-gray-900 dark:text-white">{{ flight.price }} zł</p>

    <button
      class="rounded-lg bg-gray-100 px-4 py-2 text-gray-900 transition-colors hover:bg-blue-100 dark:bg-gray-700 dark:text-white dark:hover:bg-blue-900"
      @click="$emit('view-offer')"
    >
      Zobacz ofertę
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Flight } from '@/types/flight';

interface Props {
  flight: Flight;
}

defineProps<Props>();

defineEmits<{
  (e: 'view-offer'): void;
}>();
</script>
