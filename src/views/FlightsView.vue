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

      <!-- Loader -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div
          class="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
        ></div>
      </div>

      <!-- Błąd -->
      <div
        v-else-if="error"
        class="my-8 rounded-lg bg-red-50 p-4 text-center text-red-600 dark:bg-red-900/20 dark:text-red-400"
      >
        {{ error }}
      </div>

      <!-- Wyniki wyszukiwania -->
      <div v-else class="mt-8 flex gap-6">
        <!-- Filtry - pokaż tylko gdy są loty -->
        <FlightFilters
          v-if="flights.length > 0"
          v-model="filters"
          :available-airlines="availableAirlines"
          :available-stops="availableStopsStats"
          @reset="resetFilters"
        />

        <!-- Lista lotów -->
        <div :class="flights.length > 0 ? 'flex-1' : 'w-full'">
          <!-- Nagłówek z liczbą wyników i sortowaniem - pokaż tylko gdy są loty -->
          <div v-if="filteredFlights.length > 0" class="mb-4 flex items-center justify-between">
            <p class="text-gray-600 dark:text-gray-400">
              Znaleziono {{ filteredFlights.length }} lotów
            </p>
            <div class="relative">
              <select
                v-model="sortBy"
                class="cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-sm text-gray-900 transition-colors hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-blue-400"
              >
                <option value="price-asc">Cena: od najniższej</option>
                <option value="price-desc">Cena: od najwyższej</option>
                <option value="duration-asc">Czas lotu: najkrótszy</option>
                <option value="duration-desc">Czas lotu: najdłuższy</option>
                <option value="departure-asc">Wylot: najwcześniej</option>
                <option value="departure-desc">Wylot: najpóźniej</option>
              </select>
              <ChevronDownIcon
                class="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              />
            </div>
          </div>

          <!-- Lista lotów -->
          <div v-if="sortedFlights.length > 0" class="space-y-4">
            <FlightCard v-for="flight in sortedFlights" :key="flight.id" :flight="flight" />
          </div>

          <!-- Brak wyników -->
          <div
            v-else
            class="flex flex-col items-center justify-center rounded-lg bg-white p-12 dark:bg-gray-800"
          >
            <FaceFrownIcon class="mb-4 h-16 w-16 text-gray-400" />
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
import { useFlights } from '@/composables/useFlights';
import type { Flight, SearchForm } from '@/types/flight';
import { FaceFrownIcon, ChevronDownIcon } from '@heroicons/vue/24/outline';

// Funkcja do wygenerowania domyślnych dat
const getDefaultDates = () => {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

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

const flights = ref<Flight[]>([]);
const { searchFlights, isLoading, error } = useFlights();
const { filters, availableAirlines, resetFilters } = useFlightFilters(flights);

const handleSearch = async () => {
  console.log('Wyszukiwanie lotów:', searchForm.value);

  flights.value = [];
  searchPerformed.value = true;

  const searchParams = {
    ...searchForm.value,
    date: searchForm.value.departure,
    returnDate: searchForm.value.tripType === 'roundTrip' ? searchForm.value.return : undefined,
  };
  const results = await searchFlights(searchParams);
  flights.value = results;

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const parseDurationForSort = (durationString: string): number => {
  const hoursMatch = durationString.match(/(\d+)h/);
  const minutesMatch = durationString.match(/(\d+)(?:min|m)/);
  const hours = hoursMatch?.[1] ? parseInt(hoursMatch[1], 10) : 0;
  const minutes = minutesMatch?.[1] ? parseInt(minutesMatch[1], 10) : 0;
  return hours * 60 + minutes;
};

const parseTimeForSort = (timeString: string): number => {
  const parts = timeString.split(':');
  const hours = parseInt(parts[0] || '0', 10);
  const minutes = parseInt(parts[1] || '0', 10);
  return hours * 60 + minutes;
};

const getStopsCount = (stopsText: string): number => {
  if (stopsText.toLowerCase().includes('bezpośredni')) return 0;
  const match = stopsText.match(/(\d+)/);
  if (match?.[1]) {
    const count = parseInt(match[1], 10);
    return count >= 2 ? 2 : count;
  }
  return 0;
};

// Oblicz statystyki przesiadek
const availableStopsStats = computed(() => {
  const stats = new Map<number, { minPrice: number; count: number }>();

  flights.value.forEach(flight => {
    const stops = getStopsCount(flight.stops);

    if (!stats.has(stops)) {
      stats.set(stops, { minPrice: flight.price, count: 1 });
    } else {
      const current = stats.get(stops)!;
      current.minPrice = Math.min(current.minPrice, flight.price);
      current.count += 1;
    }
  });

  return Array.from(stats.entries())
    .map(([stops, data]) => ({
      stops,
      minPrice: Math.round(data.minPrice),
      count: data.count,
    }))
    .sort((a, b) => a.stops - b.stops);
});

const sortedFlights = computed(() => {
  const flightsList = [...filteredFlights.value];

  switch (sortBy.value) {
    case 'price-asc':
      return flightsList.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return flightsList.sort((a, b) => b.price - a.price);
    case 'duration-asc':
      return flightsList.sort(
        (a, b) => parseDurationForSort(a.duration) - parseDurationForSort(b.duration)
      );
    case 'duration-desc':
      return flightsList.sort(
        (a, b) => parseDurationForSort(b.duration) - parseDurationForSort(a.duration)
      );
    case 'departure-asc':
      return flightsList.sort(
        (a, b) => parseTimeForSort(a.departureTime) - parseTimeForSort(b.departureTime)
      );
    case 'departure-desc':
      return flightsList.sort(
        (a, b) => parseTimeForSort(b.departureTime) - parseTimeForSort(a.departureTime)
      );
    default:
      return flightsList;
  }
});

const filteredFlights = computed(() => {
  let result = flights.value;

  // Filtr linii lotniczych
  if (filters.value.excludedAirlines && filters.value.excludedAirlines.length > 0) {
    result = result.filter(flight => !filters.value.excludedAirlines?.includes(flight.airline));
  }

  // Filtr przesiadek
  if (filters.value.excludedStops && filters.value.excludedStops.length > 0) {
    result = result.filter(flight => {
      const stopsCount = getStopsCount(flight.stops);
      return !filters.value.excludedStops?.includes(stopsCount);
    });
  }

  // Filtr ceny - minimum
  if (filters.value.priceMin !== null && filters.value.priceMin !== undefined) {
    result = result.filter(flight => flight.price >= filters.value.priceMin!);
  }

  // Filtr ceny - maksimum
  if (filters.value.priceMax !== null && filters.value.priceMax !== undefined) {
    result = result.filter(flight => flight.price <= filters.value.priceMax!);
  }

  // Filtr maksymalnego czasu lotu
  if (filters.value.maxDuration) {
    result = result.filter(flight => {
      const durationInMinutes = parseDurationForSort(flight.duration);
      return durationInMinutes <= filters.value.maxDuration! * 60;
    });
  }

  // Filtr godziny wylotu - zakres
  if (filters.value.departureTimeRange) {
    const [minHour, maxHour] = filters.value.departureTimeRange;
    if (minHour > 0 || maxHour < 24) {
      result = result.filter(flight => {
        const departureMinutes = parseTimeForSort(flight.departureTime);
        const departureHours = departureMinutes / 60;
        return departureHours >= minHour && departureHours <= maxHour;
      });
    }
  }

  // Filtr godziny przylotu - zakres
  if (filters.value.arrivalTimeRange) {
    const [minHour, maxHour] = filters.value.arrivalTimeRange;
    if (minHour > 0 || maxHour < 24) {
      result = result.filter(flight => {
        const arrivalMinutes = parseTimeForSort(flight.arrivalTime);
        const arrivalHours = arrivalMinutes / 60;
        return arrivalHours >= minHour && arrivalHours <= maxHour;
      });
    }
  }

  return result;
});
</script>
