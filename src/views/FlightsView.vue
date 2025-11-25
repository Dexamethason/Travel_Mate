<template>
  <div class="container mx-auto px-4">
    <!-- Wycentrowany formularz przed wyszukaniem -->
    <div v-if="!searchPerformed" class="flex min-h-[calc(100vh-200px)] items-center justify-center">
      <div class="w-full max-w-6xl">
        <FlightSearchForm v-model="searchForm" :show-header="true" @search="handleSearch" />
      </div>
    </div>

    <!-- Kompaktowy formularz po wyszukaniu -->
    <div v-else class="py-8">
      <FlightSearchForm v-model="searchForm" :show-header="false" @search="handleSearch" />

      <!-- Wyniki wyszukiwania -->
      <div class="mt-8 flex gap-6">
        <!-- Filtry -->
        <FlightFilters
          v-model="filters"
          :available-airlines="availableAirlines"
          @reset="resetFilters"
        />

        <!-- Lista lotów -->
        <div class="flex-1">
          <div class="mb-4 flex items-center justify-between">
            <p class="text-gray-600 dark:text-gray-400">
              Znaleziono {{ filteredFlights.length }} lotów
            </p>
            <select
              v-model="sortBy"
              class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="price-asc">Cena: od najniższej</option>
              <option value="price-desc">Cena: od najwyższej</option>
              <option value="duration-asc">Czas lotu: najkrótszy</option>
              <option value="duration-desc">Czas lotu: najdłuższy</option>
              <option value="departure-asc">Wylot: najwcześniej</option>
              <option value="departure-desc">Wylot: najpóźniej</option>
            </select>
          </div>

          <div v-if="sortedFlights.length > 0" class="space-y-4">
            <FlightCard v-for="flight in sortedFlights" :key="flight.id" :flight="flight" />
          </div>

          <div
            v-else
            class="flex flex-col items-center justify-center rounded-lg bg-white p-12 dark:bg-gray-800"
          >
            <svg
              class="mb-4 h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Brak wyników</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Spróbuj zmienić kryteria wyszukiwania lub filtry
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import FlightSearchForm from '@/components/FlightsPage/FlightSearchForm.vue';
import FlightFilters from '@/components/FlightsPage/FlightFilters.vue';
import FlightCard from '@/components/FlightsPage/FlightCard.vue';
import { useFlightFilters } from '../composables/useFlightFilters';
import type { Flight, SearchForm } from '@/types/flight';

// Funkcja do wygenerowania domyślnych dat
const getDefaultDates = () => {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  // Bezpieczne formatowanie dat
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return {
    departure: formatDate(today),
    return: formatDate(nextWeek),
  };
};

const defaultDates = getDefaultDates();

const searchPerformed = ref(false);
const sortBy = ref('price-asc');
const searchForm = ref<SearchForm>({
  from: '',
  to: '',
  departure: defaultDates.departure,
  return: defaultDates.return,
  adults: 1,
  children: 0,
  tripType: 'roundTrip',
});

// Zamockowane dane - później zastąpisz to API
const mockFlights = ref<Flight[]>([]);

const { filters, filteredFlights, availableAirlines, resetFilters } = useFlightFilters(mockFlights);

const handleSearch = () => {
  console.log('Wyszukiwanie lotów:', searchForm.value);

  // Tymczasowo ustawiamy zamockowane dane
  mockFlights.value = [
    {
      id: 1,
      airline: 'LOT Polish Airlines',
      stops: 'Bezpośredni',
      departureTime: '08:30',
      departureAirport: searchForm.value.from || 'WAW',
      arrivalTime: '10:45',
      arrivalAirport: searchForm.value.to || 'CDG',
      duration: '2h 15min',
      type: 'economy',
      price: 450,
    },
    {
      id: 2,
      airline: 'Lufthansa',
      stops: '1 przesiadka',
      departureTime: '14:20',
      departureAirport: searchForm.value.from || 'WAW',
      arrivalTime: '19:30',
      arrivalAirport: searchForm.value.to || 'CDG',
      duration: '5h 10min',
      type: 'economy',
      price: 320,
    },
    {
      id: 3,
      airline: 'Ryanair',
      stops: 'Bezpośredni',
      departureTime: '06:00',
      departureAirport: searchForm.value.from || 'WAW',
      arrivalTime: '08:15',
      arrivalAirport: searchForm.value.to || 'CDG',
      duration: '2h 15min',
      type: 'economy',
      price: 180,
    },
    {
      id: 4,
      airline: 'Air France',
      stops: 'Bezpośredni',
      departureTime: '16:45',
      departureAirport: searchForm.value.from || 'WAW',
      arrivalTime: '19:00',
      arrivalAirport: searchForm.value.to || 'CDG',
      duration: '2h 15min',
      type: 'business',
      price: 890,
    },
    {
      id: 5,
      airline: 'Wizz Air',
      stops: 'Bezpośredni',
      departureTime: '22:30',
      departureAirport: searchForm.value.from || 'WAW',
      arrivalTime: '00:45',
      arrivalAirport: searchForm.value.to || 'CDG',
      duration: '2h 15min',
      type: 'economy',
      price: 150,
    },
  ];

  searchPerformed.value = true;

  // Scroll do góry strony po wyszukaniu
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const parseDurationForSort = (durationString: string): number => {
  const hoursMatch = durationString.match(/(\d+)h/);
  const minutesMatch = durationString.match(/(\d+)min/);
  const hours = hoursMatch && hoursMatch[1] ? parseInt(hoursMatch[1], 10) : 0;
  const minutes = minutesMatch && minutesMatch[1] ? parseInt(minutesMatch[1], 10) : 0;
  return hours * 60 + minutes;
};

const parseTimeForSort = (timeString: string): number => {
  const parts = timeString.split(':');
  const hours = parseInt(parts[0] || '0', 10);
  const minutes = parseInt(parts[1] || '0', 10);
  return hours * 60 + minutes;
};

const sortedFlights = computed(() => {
  const flights = [...filteredFlights.value];

  switch (sortBy.value) {
    case 'price-asc':
      return flights.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return flights.sort((a, b) => b.price - a.price);
    case 'duration-asc':
      return flights.sort(
        (a, b) => parseDurationForSort(a.duration) - parseDurationForSort(b.duration)
      );
    case 'duration-desc':
      return flights.sort(
        (a, b) => parseDurationForSort(b.duration) - parseDurationForSort(a.duration)
      );
    case 'departure-asc':
      return flights.sort(
        (a, b) => parseTimeForSort(a.departureTime) - parseTimeForSort(b.departureTime)
      );
    case 'departure-desc':
      return flights.sort(
        (a, b) => parseTimeForSort(b.departureTime) - parseTimeForSort(a.departureTime)
      );
    default:
      return flights;
  }
});
</script>
