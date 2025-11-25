<template>
  <div class="flex min-h-screen flex-1 justify-center bg-gray-50 px-10 py-5 dark:bg-gray-900">
    <div class="flex max-w-6xl flex-1 flex-col">
      <!-- Kontener na nagłówek i formularz - wyśrodkowany gdy brak wyników -->
      <div
        :class="[
          'flex flex-col',
          !hasSearched ? 'flex-1 items-center justify-center -mt-[100px]' : 'pt-4',
        ]"
      >
        <!-- Header -->
        <div :class="['mb-8 text-center', !hasSearched ? '' : 'text-left']">
          <h1 class="text-4xl font-bold leading-tight text-gray-900 dark:text-white">
            Znajdź idealny lot
          </h1>
          <p v-if="!hasSearched" class="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Wyszukaj najlepsze oferty lotów do wymarzonego miejsca
          </p>
        </div>

        <!-- formularz wyszukiwania lotów -->
        <div :class="['w-full', !hasSearched ? 'max-w-5xl' : '']">
          <FlightSearchForm v-model="searchForm" @search="searchFlights" />
        </div>
      </div>

      <!-- Wyniki i filtry - pokazują się tylko po wyszukaniu -->
      <div v-if="hasSearched" class="mt-8 flex gap-8">
        <!-- sidebar z filtrami -->
        <FlightFilters v-model="filtersData" />

        <!-- wyniki wyszukiwania -->
        <FlightResults :flights="filteredFlights" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import FlightSearchForm from '@/components/FlightsPage/FlightSearchForm.vue';
import FlightFilters from '@/components/FlightsPage/FlightFilters.vue';
import FlightResults from '@/components/FlightsPage/FlightResults.vue';
import type { SearchForm, Flight, FlightFiltersType } from '../types/flight';

// Funkcja pomocnicza do konwersji daty na string
const dateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Ustaw domyślne daty
const today = new Date();
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);

const searchForm = ref<SearchForm>({
  from: '',
  to: '',
  departure: dateToString(today),
  return: dateToString(nextWeek),
  adults: 1,
  children: 0,
});

const filtersData = ref<FlightFiltersType>({
  priceMin: 0,
  priceMax: 5000,
  maxStops: '3',
  durationMax: 24,
});

const hasSearched = ref(false);

const flights = ref<Flight[]>([
  {
    id: 1,
    airline: 'LOT Polish Airlines',
    stops: 'Bezpośredni',
    departureTime: '10:00',
    departureAirport: 'WAW',
    arrivalTime: '12:30',
    arrivalAirport: 'CDG',
    duration: '2h 30m',
    type: 'Bezpośredni',
    price: 650,
  },
  {
    id: 2,
    airline: 'Ryanair',
    stops: '1 przesiadka',
    departureTime: '08:00',
    departureAirport: 'WAW',
    arrivalTime: '14:00',
    arrivalAirport: 'CDG',
    duration: '6h 0m',
    type: '1 przesiadka',
    price: 450,
  },
  {
    id: 3,
    airline: 'Air France',
    stops: 'Bezpośredni',
    departureTime: '14:00',
    departureAirport: 'WAW',
    arrivalTime: '16:30',
    arrivalAirport: 'CDG',
    duration: '2h 30m',
    type: 'Bezpośredni',
    price: 720,
  },
]);

const filteredFlights = computed(() => {
  return flights.value.filter(flight => {
    const priceInRange =
      flight.price >= filtersData.value.priceMin && flight.price <= filtersData.value.priceMax;

    const stopsCount = flight.stops === 'Bezpośredni' ? 0 : parseInt(flight.stops.charAt(0));
    const stopsMatch = stopsCount <= parseInt(filtersData.value.maxStops);

    return priceInRange && stopsMatch;
  });
});

const searchFlights = () => {
  console.log('Wyszukiwanie lotów...', searchForm.value);
  hasSearched.value = true;
  // TODO: podpiąć prawdziwe API jak będzie gotowe
};
</script>
