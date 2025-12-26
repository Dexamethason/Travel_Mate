<template>
  <div class="container mx-auto px-4">
    <!-- Wycentrowany formularz przed wyszukaniem -->
    <div
      v-if="!searchPerformed"
      class="flex min-h-[calc(100vh-200px)] items-center justify-center"
    >
      <div class="w-full max-w-6xl">
        <AccommodationsSearchForm
          v-model="searchForm"
          :loading="loading"
          :show-header="true"
          @search="handleSearch"
              />
            </div>
        </div>

    <!-- Widok po wyszukaniu -->
    <div v-else class="py-8">
      <AccommodationsSearchForm
        v-model="searchForm"
        :loading="loading"
        :show-header="false"
        @search="handleSearch"
      />

      <!-- Komunikat błędu -->
      <div v-if="error" class="my-4 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
        <div class="flex items-center justify-between">
          <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
          <button
            class="text-red-400 hover:text-red-600 dark:hover:text-red-300"
            @click="clearError"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Loader -->
      <div v-if="loading" class="py-16 text-center">
        <div
          class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
        ></div>
        <p class="text-gray-600 dark:text-gray-400">Wyszukiwanie noclegów...</p>
            </div>

      <!-- Wyniki -->
      <div v-else class="mt-8 flex gap-8">
        <!-- Filtry -->
        <AccommodationsFilters 
          v-model="filters" 
          :available-amenities="availableAmenities"
          @reset="resetFilters" 
        />

        <!-- Lista wyników -->
        <div class="flex-1">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              Wyniki ({{ filteredAccommodations.length }})
            </h2>
            <select
              v-model="sortBy"
              class="cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="price-asc">Cena: od najniższej</option>
              <option value="price-desc">Cena: od najwyższej</option>
              <option value="rating-desc">Ocena: od najwyższej</option>
              <option value="rating-asc">Ocena: od najniższej</option>
              <option value="popularity-desc">Popularność: najpopularniejsze</option>
              <option value="popularity-asc">Popularność: najmniej popularne</option>
            </select>
          </div>

          <div
            v-if="!accommodations.length"
            class="py-16 text-center text-gray-500 dark:text-gray-400"
          >
            <p class="mb-2 text-lg font-medium">Brak wyników dla wybranych kryteriów</p>
            <p class="text-sm">Spróbuj zmienić daty, miejsce lub filtry.</p>
          </div>

          <div v-else class="grid gap-6">
            <AccommodationCard
              v-for="accommodation in sortedAccommodations"
              :key="accommodation.id"
              :accommodation="accommodation"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import AccommodationsSearchForm from '@/components/AccommodationsPage/AccommodationsSearchForm.vue';
import AccommodationsFilters from '@/components/AccommodationsPage/AccommodationsFilters.vue';
import AccommodationCard from '@/components/AccommodationsPage/AccommodationCard.vue';
import {
  useAccommodations,
  type Accommodation,
  type AccommodationFilters,
} from '@/composables/useAccommodations';

const {
  accommodations,
  loading,
  error,
  clearError,
  searchAccommodations,
} = useAccommodations();

const searchPerformed = ref(false);

const searchForm = ref({
  destination: '',
  checkIn: '',
  checkOut: '',
  adults: 2,
  children: 0,
});

const defaultFilters: AccommodationFilters = {
  priceMin: 0,
  priceMax: 2000,
  type: '',
  minRating: 0,
  amenities: [] as string[],
  stars: 0,
  freeCancellation: false,
  breakfastIncluded: false,
  petFriendly: false,
  airConditioning: false,
  balcony: false,
  fitnessCenter: false,
  spa: false,
  restaurant: false,
  reception24h: false,
  airportTransfer: false,
};

const filters = ref<AccommodationFilters>({ ...defaultFilters });

const resetFilters = () => {
  filters.value = { ...defaultFilters };
};

// Zbierz wszystkie unikalne amenities z wyników wyszukiwania
const availableAmenities = computed(() => {
  const amenitiesSet = new Set<string>();
  accommodations.value.forEach(accommodation => {
    if (accommodation.amenities && Array.isArray(accommodation.amenities)) {
      accommodation.amenities.forEach(amenity => {
        if (amenity && typeof amenity === 'string' && amenity.trim() !== '') {
          amenitiesSet.add(amenity);
        }
      });
    }
  });
  return Array.from(amenitiesSet).sort();
});

const sortBy = ref('price-asc');

const filteredAccommodations = computed<Accommodation[]>(() => {
  return accommodations.value.filter((accommodation: Accommodation) => {
    const priceInRange =
      (!filters.value.priceMin || accommodation.price >= filters.value.priceMin) &&
      (!filters.value.priceMax || accommodation.price <= filters.value.priceMax);

    const typeMatch = !filters.value.type || accommodation.type.toLowerCase() === filters.value.type.toLowerCase();

    const ratingMatch = (accommodation.rating || 0) >= filters.value.minRating;

    const amenitiesMatch =
      filters.value.amenities.length === 0 ||
      filters.value.amenities.every((amenity: string) =>
        accommodation.amenities.includes(amenity)
      );

    const starsMatch =
      !filters.value.stars ||
      (accommodation.stars !== undefined && accommodation.stars >= filters.value.stars);

    const freeCancellationMatch =
      !filters.value.freeCancellation || accommodation.freeCancellation === true;

    const breakfastMatch =
      !filters.value.breakfastIncluded || accommodation.breakfastIncluded === true;

    const petFriendlyMatch = !filters.value.petFriendly || accommodation.petFriendly === true;

    const airConditioningMatch =
      !filters.value.airConditioning || accommodation.airConditioning === true;

    const balconyMatch = !filters.value.balcony || accommodation.balcony === true;

    const fitnessMatch = !filters.value.fitnessCenter || accommodation.fitnessCenter === true;

    const spaMatch = !filters.value.spa || accommodation.spa === true;

    const restaurantMatch = !filters.value.restaurant || accommodation.restaurant === true;

    const reception24hMatch = !filters.value.reception24h || accommodation.reception24h === true;

    const airportTransferMatch =
      !filters.value.airportTransfer || accommodation.airportTransfer === true;

    return (
      priceInRange &&
      typeMatch &&
      ratingMatch &&
      amenitiesMatch &&
      starsMatch &&
      freeCancellationMatch &&
      breakfastMatch &&
      petFriendlyMatch &&
      airConditioningMatch &&
      balconyMatch &&
      fitnessMatch &&
      spaMatch &&
      restaurantMatch &&
      reception24hMatch &&
      airportTransferMatch
    );
  });
});

const sortedAccommodations = computed<Accommodation[]>(() => {
  const sorted = [...filteredAccommodations.value];

      const getDistanceValue = (acc: Accommodation) => {
        if (acc.distanceValue !== undefined) return acc.distanceValue;
        if (!acc.distance) return Infinity;
        const match = acc.distance.match(/([\d.]+)/);
        return match && match[1] ? parseFloat(match[1]) : Infinity;
      };

  switch (sortBy.value) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating-desc':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'rating-asc':
      return sorted.sort((a, b) => a.rating - b.rating);
    case 'popularity-desc':
      return sorted.sort((a, b) => b.reviews - a.reviews);
    case 'popularity-asc':
      return sorted.sort((a, b) => a.reviews - b.reviews);
    case 'distance-asc':
      return sorted.sort((a, b) => getDistanceValue(a) - getDistanceValue(b));
    case 'distance-desc':
      return sorted.sort((a, b) => getDistanceValue(b) - getDistanceValue(a));
    default:
      return sorted;
  }
});

const handleSearch = async () => {
  searchPerformed.value = true;

  // Wywołanie API zamiast mocków
  await searchAccommodations({
    destination: searchForm.value.destination,
    checkIn: searchForm.value.checkIn,
    checkOut: searchForm.value.checkOut,
    adults: searchForm.value.adults,
    children: searchForm.value.children > 0 ? searchForm.value.children : undefined,


  });
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

</script>