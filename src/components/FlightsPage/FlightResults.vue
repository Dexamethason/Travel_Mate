<template>
  <div class="flex-1">
    <h2 class="mb-6 text-xl font-bold text-gray-900 dark:text-white">Wyniki</h2>

    <div v-if="flights.length === 0" class="py-16 text-center text-gray-500 dark:text-gray-400">
      Użyj formularza powyżej, aby wyszukać loty
    </div>

    <div v-for="flight in flights" :key="flight.id" class="mb-4">
      <FlightCard :flight="flight" @view-offer="handleViewOffer(flight)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import FlightCard from './FlightCard.vue';
import type { Flight } from '../../types/flight';

interface Props {
  flights: Flight[];
}

defineProps<Props>();

const handleViewOffer = (flight: Flight) => {
  console.log('Zobacz ofertę:', flight);
  // TODO: implementacja przekierowania do szczegółów lotu
};
</script>
