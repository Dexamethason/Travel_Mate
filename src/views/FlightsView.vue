<template>
  <div class="flex min-h-screen flex-1 justify-center bg-gray-50 px-10 py-5 dark:bg-gray-900">
    <div class="flex max-w-6xl flex-1 flex-col">
      <!-- Header -->
      <div class="flex flex-wrap justify-between gap-3 p-4">
        <h1 class="text-3xl font-bold leading-tight text-gray-900 dark:text-white">
          Znajdź idealny lot
        </h1>
      </div>

      <!-- formularz wyszukiwania lotów -->
      <div
        class="mb-8 flex flex-wrap items-end gap-4 rounded-lg bg-white px-4 py-3 shadow-sm dark:bg-gray-800"
      >
        <label class="flex min-w-40 flex-1 flex-col">
          <p class="pb-2 text-base font-medium leading-normal text-gray-900 dark:text-white">
            Skąd
          </p>
          <input
            v-model="searchForm.from"
            class="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Miasto lub lotnisko"
          />
        </label>

        <label class="flex min-w-40 flex-1 flex-col">
          <p class="pb-2 text-base font-medium leading-normal text-gray-900 dark:text-white">
            Dokąd
          </p>
          <input
            v-model="searchForm.to"
            class="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Miasto lub lotnisko"
          />
        </label>

        <label class="flex min-w-40 flex-1 flex-col">
          <p class="pb-2 text-base font-medium leading-normal text-gray-900 dark:text-white">
            Wylot
          </p>
          <input
            v-model="searchForm.departure"
            type="date"
            class="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </label>

        <label class="flex min-w-40 flex-1 flex-col">
          <p class="pb-2 text-base font-medium leading-normal text-gray-900 dark:text-white">
            Powrót
          </p>
          <input
            v-model="searchForm.return"
            type="date"
            class="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </label>

        <label class="flex min-w-40 flex-1 flex-col">
          <p class="pb-2 text-base font-medium leading-normal text-gray-900 dark:text-white">
            Pasażerowie
          </p>
          <input
            v-model="searchForm.travelers"
            type="number"
            min="1"
            class="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="1 dorosły"
          />
        </label>

        <button
          class="h-12 rounded-lg bg-blue-500 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-600"
          @click="searchFlights"
        >
          Szukaj
        </button>
      </div>

      <div class="flex gap-8">
        <!-- sidebar z filtrami -->
        <div class="w-1/4">
          <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <h2 class="mb-6 text-xl font-bold text-gray-900 dark:text-white">Filtry</h2>

            <!-- filtr ceny -->
            <div class="mb-6">
              <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">
                Przedział cenowy
              </p>
              <div class="mb-2 flex items-center gap-4">
                <input
                  v-model="filters.priceMin"
                  type="number"
                  class="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Min"
                />
                <span class="text-gray-500">-</span>
                <input
                  v-model="filters.priceMax"
                  type="number"
                  class="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Max"
                />
              </div>
            </div>

            <!-- filtr przesiadek -->
            <div class="mb-6">
              <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">
                Maksymalna liczba przesiadek
              </p>
              <select
                v-model="filters.maxStops"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="0">Bez przesiadek</option>
                <option value="1">1 przesiadka</option>
                <option value="2">2 przesiadki</option>
                <option value="3">3+ przesiadki</option>
              </select>
            </div>
          </div>
        </div>

        <!-- wyniki wyszukiwania -->
        <div class="flex-1">
          <h2 class="mb-6 text-xl font-bold text-gray-900 dark:text-white">Wyniki</h2>

          <div
            v-if="flights.length === 0"
            class="py-16 text-center text-gray-500 dark:text-gray-400"
          >
            Użyj formularza powyżej, aby wyszukać loty
          </div>

          <div v-for="flight in filteredFlights" :key="flight.id" class="mb-4">
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

              <svg
                class="mx-4 text-gray-400"
                fill="currentColor"
                height="24"
                viewBox="0 0 24 24"
                width="24"
              >
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
              >
                Zobacz ofertę
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Flight {
  id: number;
  airline: string;
  stops: string;
  departureTime: string;
  departureAirport: string;
  arrivalTime: string;
  arrivalAirport: string;
  duration: string;
  type: string;
  price: number;
}

const searchForm = ref({
  from: '',
  to: '',
  departure: '',
  return: '',
  travelers: 1,
});

const filters = ref({
  priceMin: 0,
  priceMax: 5000,
  maxStops: '3',
  durationMax: 24,
});

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
      flight.price >= filters.value.priceMin && flight.price <= filters.value.priceMax;

    const stopsCount = flight.stops === 'Bezpośredni' ? 0 : parseInt(flight.stops.charAt(0));
    const stopsMatch = stopsCount <= parseInt(filters.value.maxStops);

    return priceInRange && stopsMatch;
  });
});

const searchFlights = () => {
  console.log('Wyszukiwanie lotów...', searchForm.value);
  // TODO: podpiąć prawdziwe API jak będzie gotowe
};
</script>
