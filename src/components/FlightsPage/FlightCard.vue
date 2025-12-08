<template>
  <div
    class="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
  >
    <div class="flex items-center gap-4">
      <!-- Lewa strona: Lot tam i lot powrotny -->
      <div class="flex flex-1 flex-col gap-4">
        <!-- Lot w jedną stronę / Wylot -->
        <div class="flex items-center gap-4">
          <!-- Logo linii lotniczej -->
          <div
            class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-white p-2 shadow-sm dark:bg-gray-700"
          >
            <img
              v-if="logoUrl"
              :src="logoUrl"
              :alt="getAirlineName(flight.airline)"
              class="h-full w-full object-contain"
              @error="handleError"
            />
            <div
              v-else
              class="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300"
            >
              {{ flight.airline.charAt(0) }}
            </div>
          </div>

          <!-- Informacje o locie -->
          <div class="flex flex-1 items-center gap-4">
            <!-- Wylot - stała szerokość -->
            <div class="flex w-24 flex-shrink-0 flex-col items-center">
              <p class="text-xl font-bold text-gray-900 dark:text-white">
                {{ flight.departureTime }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ flight.departureAirport }}
              </p>
            </div>

            <!-- Czas lotu i przesiadki -->
            <div class="flex min-w-[200px] flex-1 flex-col items-center justify-center">
              <p class="mb-1 text-xs text-gray-500 dark:text-gray-400">{{ flight.duration }}</p>
              <div class="flex w-full items-center">
                <div class="h-[1px] w-full bg-gray-300 dark:bg-gray-600"></div>
                <ArrowRightIcon class="ml-0.5 h-3 w-3 flex-shrink-0 text-gray-400" />
              </div>
              <p class="mt-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                {{ flight.stops }}
              </p>
            </div>

            <!-- Przylot - stała szerokość -->
            <div class="flex w-24 flex-shrink-0 flex-col items-center">
              <p class="text-xl font-bold text-gray-900 dark:text-white">
                {{ flight.arrivalTime }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ flight.arrivalAirport }}
              </p>
            </div>
          </div>

          <!-- Nazwa linii i klasa - stała szerokość -->
          <div class="flex w-44 flex-shrink-0 flex-col items-end gap-1">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ getAirlineName(flight.airline) }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ flight.type }}</p>
          </div>
        </div>

        <!-- Lot powrotny (jeśli istnieje) -->
        <div v-if="hasReturnFlight" class="flex items-center gap-4">
          <!-- Logo linii lotniczej powrotu -->
          <div
            class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-white p-2 shadow-sm dark:bg-gray-700"
          >
            <img
              v-if="returnLogoUrl"
              :src="returnLogoUrl"
              :alt="getAirlineName(flight.returnAirline!)"
              class="h-full w-full object-contain"
              @error="handleReturnError"
            />
            <div
              v-else
              class="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300"
            >
              {{ flight.returnAirline?.charAt(0) }}
            </div>
          </div>

          <!-- Informacje o locie powrotnym -->
          <div class="flex flex-1 items-center gap-4">
            <!-- Wylot - stała szerokość -->
            <div class="flex w-24 flex-shrink-0 flex-col items-center">
              <p class="text-xl font-bold text-gray-900 dark:text-white">
                {{ flight.returnDepartureTime }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ flight.returnDepartureAirport }}
              </p>
            </div>

            <!-- Czas lotu i przesiadki -->
            <div class="flex min-w-[200px] flex-1 flex-col items-center justify-center">
              <p class="mb-1 text-xs text-gray-500 dark:text-gray-400">
                {{ flight.returnDuration }}
              </p>
              <div class="flex w-full items-center">
                <div class="h-[1px] w-full bg-gray-300 dark:bg-gray-600"></div>
                <ArrowRightIcon class="ml-0.5 h-3 w-3 flex-shrink-0 text-gray-400" />
              </div>
              <p class="mt-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                {{ flight.returnStops }}
              </p>
            </div>

            <!-- Przylot - stała szerokość -->
            <div class="flex w-24 flex-shrink-0 flex-col items-center">
              <p class="text-xl font-bold text-gray-900 dark:text-white">
                {{ flight.returnArrivalTime }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ flight.returnArrivalAirport }}
              </p>
            </div>
          </div>

          <!-- Nazwa linii powrotnej - stała szerokość -->
          <div class="flex w-44 flex-shrink-0 flex-col items-end gap-1">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ getAirlineName(flight.returnAirline!) }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ flight.type }}</p>
          </div>
        </div>
      </div>

      <!-- Prawa strona: Cena i przycisk (wyrównane do środka wysokości) -->
      <div
        class="flex min-h-full flex-col items-end justify-center gap-3 border-l border-gray-200 pl-6 dark:border-gray-700"
      >
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ flight.price }} zł</p>
        <button
          class="whitespace-nowrap rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          @click="$emit('view-offer')"
        >
          Zobacz ofertę
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Flight } from '@/types/flight';
import { getAirlineName } from '@/data/airlines';
import { useAirlineLogo } from '@/composables/useAirlineLogo';
import { ArrowRightIcon } from '@heroicons/vue/24/solid';

interface Props {
  flight: Flight;
}

const props = defineProps<Props>();

defineEmits<{
  (e: 'view-offer'): void;
}>();

// Logo dla lotu w jedną stronę
const { logoUrl, handleError } = useAirlineLogo(props.flight.airline);

// Logo dla lotu powrotnego
const { logoUrl: returnLogoUrl, handleError: handleReturnError } = useAirlineLogo(
  props.flight.returnAirline || ''
);

// Sprawdź czy istnieje lot powrotny
const hasReturnFlight = computed(() => {
  return !!(
    props.flight.returnAirline &&
    props.flight.returnDepartureTime &&
    props.flight.returnArrivalTime
  );
});
</script>
