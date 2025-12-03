<template>
  <div class="flex min-h-screen flex-1 justify-center bg-gray-50 px-10 py-5 dark:bg-gray-900">
    <div class="flex max-w-6xl flex-1 flex-col">
      <!-- Header -->
      <div class="flex flex-wrap justify-between gap-3 p-4">
        <h1 class="text-3xl font-bold leading-tight text-gray-900 dark:text-white">
          Znajdź idealne noclegi
        </h1>
      </div>

      <!-- formularz wyszukiwania -->
      <div
        class="mb-8 flex flex-wrap items-end gap-4 rounded-lg bg-white px-4 py-3 shadow-sm dark:bg-gray-800"
      >
        <label class="flex min-w-40 flex-1 flex-col">
          <p class="pb-2 text-base font-medium leading-normal text-gray-900 dark:text-white">
            Miejsce docelowe
          </p>
          <input
            v-model="searchForm.destination"
            class="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Miasto lub region"
            @keyup.enter="handleSearch"
          />
        </label>

        <div class="flex min-w-40 flex-1 flex-col">
          <DateRangePicker
            :departure="searchForm.checkIn"
            :return-date="searchForm.checkOut"
            trip-type="roundTrip"
            @update:departure="searchForm.checkIn = $event"
            @update:return-date="searchForm.checkOut = $event"
          />
        </div>

        <div class="relative flex min-w-40 flex-1 flex-col">
          <p class="pb-2 text-base font-medium leading-normal text-gray-900 dark:text-white">
            Goście
          </p>
          <button
            ref="travelersButtonRef"
            type="button"
            class="flex h-12 w-full items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 text-left text-gray-900 transition-colors focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
            @click="toggleTravelers"
          >
            <UserGroupIcon class="h-5 w-5 flex-shrink-0 text-gray-400" />
            <span class="flex-1 text-sm">
              {{ searchForm.adults + searchForm.children }} goś{{ searchForm.adults + searchForm.children !== 1 ? 'ci' : 'ć' }}
            </span>
          </button>

          <!-- Panel gości jako popup -->
          <Teleport to="body">
            <div
              v-if="showTravelers"
              ref="travelersRef"
              :style="travelersPosition"
              class="fixed z-50 w-80 rounded-lg border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800"
              @click.stop
            >
              <TravelersSelector
                :adults="searchForm.adults"
                :children="searchForm.children"
                @update="updateTravelers"
              />
            </div>
          </Teleport>
        </div>

        <button
          :disabled="loading || !isSearchFormValid"
          class="h-12 rounded-lg bg-blue-500 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleSearch"
        >
          <span v-if="loading" class="inline-flex items-center gap-2">
            <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            Szukanie...
          </span>
          <span v-else>Szukaj</span>
        </button>
      </div>

      <!-- Komunikat błędu -->
      <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
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

      <div class="flex gap-8">
        <!-- sidebar z filtrami -->
        <div class="w-1/4">
          <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div class="mb-6 flex items-center justify-between">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">Filtry</h2>
              <button
                class="cursor-pointer text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                @click="resetFilters"
              >
                Resetuj
              </button>
            </div>

            <!-- price range -->
            <div class="mb-6">
              <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">
                Cena za noc (zł)
              </p>
              <div class="mb-2 flex items-center gap-4">
                <input
                  v-model.number="filters.priceMin"
                  type="number"
                  min="0"
                  class="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Min"
                />
                <span class="text-gray-500">-</span>
                <input
                  v-model.number="filters.priceMax"
                  type="number"
                  min="0"
                  class="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Max"
                />
              </div>
            </div>

            <!-- filtr typów noclegu -->
            <div class="mb-6">
              <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">Typ noclegu</p>
              <select
                v-model="filters.type"
                class="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Wszystkie</option>
                <option value="hotel">Hotel</option>
                <option value="apartment">Apartament</option>
                <option value="hostel">Hostel</option>
                <option value="villa">Willa</option>
                <option value="bnb">Bed & Breakfast</option>
              </select>
            </div>

            <!-- filtr ocen -->
            <div class="mb-6">
              <p class="mb-2 text-base font-medium text-gray-900 dark:text-white">
                Minimalna ocena gości
              </p>
              <p class="mb-3 text-xs text-gray-500 dark:text-gray-400">
                Ocena użytkowników (opinie gości)
              </p>
              <select
                v-model.number="filters.minRating"
                class="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option :value="0">Wszystkie</option>
                <option :value="6">6.0+</option>
                <option :value="7">7.0+</option>
                <option :value="8">8.0+</option>
                <option :value="9">9.0+</option>
              </select>
            </div>

            <!-- filtr gwiazdek -->
            <div class="mb-6">
              <p class="mb-2 text-base font-medium text-gray-900 dark:text-white">
                Kategoria (gwiazdki)
              </p>
              <p class="mb-3 text-xs text-gray-500 dark:text-gray-400">
                Oficjalna klasyfikacja hoteli (1-5 gwiazdek)
              </p>
              <select
                v-model.number="filters.stars"
                class="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option :value="0">Wszystkie</option>
                <option :value="1">1 gwiazdka</option>
                <option :value="2">2 gwiazdki</option>
                <option :value="3">3 gwiazdki</option>
                <option :value="4">4 gwiazdki</option>
                <option :value="5">5 gwiazdek</option>
              </select>
            </div>

            <!-- filtr odległości -->
            <div class="mb-6">
              <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">
                Maksymalna odległość od centrum (km)
              </p>
              <input
                v-model.number="filters.maxDistance"
                type="number"
                min="0"
                step="0.5"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="np. 5"
              />
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Zostaw puste, aby pokazać wszystkie
              </p>
            </div>

            <!-- filtr udogodnień podstawowych -->
            <div class="mb-6">
              <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">Udogodnienia</p>
              <div class="space-y-2">
                <label class="flex cursor-pointer items-center">
                  <input
                    v-model="filters.amenities"
                    type="checkbox"
                    value="wifi"
                    class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Wi-Fi</span>
                </label>
                <label class="flex cursor-pointer items-center">
                  <input
                    v-model="filters.amenities"
                    type="checkbox"
                    value="parking"
                    class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Parking</span>
                </label>
                <label class="flex cursor-pointer items-center">
                  <input
                    v-model="filters.amenities"
                    type="checkbox"
                    value="pool"
                    class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Basen</span>
                </label>
                <label class="flex cursor-pointer items-center">
                  <input
                    v-model="filters.breakfastIncluded"
                    type="checkbox"
                    class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Śniadanie wliczone</span>
                </label>
                <label class="flex cursor-pointer items-center">
                  <input
                    v-model="filters.airConditioning"
                    type="checkbox"
                    class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Klimatyzacja</span>
                </label>
                <label class="flex cursor-pointer items-center">
                  <input
                    v-model="filters.balcony"
                    type="checkbox"
                    class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Balkon/Taras</span>
                </label>
              </div>
            </div>

            <!-- filtr dodatkowych udogodnień -->
            <div class="mb-6">
              <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">
                Dodatkowe udogodnienia
              </p>
              <div class="space-y-2">
                <label class="flex cursor-pointer items-center">
                  <input
                    v-model="filters.fitnessCenter"
                    type="checkbox"
                    class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Siłownia</span>
                </label>
                <label class="flex cursor-pointer items-center">
                  <input
                    v-model="filters.spa"
                    type="checkbox"
                    class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">SPA</span>
                </label>
                <label class="flex cursor-pointer items-center">
                  <input
                    v-model="filters.restaurant"
                    type="checkbox"
                    class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Restauracja</span>
                </label>
                <label class="flex cursor-pointer items-center">
                  <input
                    v-model="filters.reception24h"
                    type="checkbox"
                    class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Recepcja 24h</span>
                </label>
                <label class="flex cursor-pointer items-center">
                  <input
                    v-model="filters.airportTransfer"
                    type="checkbox"
                    class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Transfer z lotniska</span>
                </label>
              </div>
            </div>

            <!-- filtr opcji specjalnych -->
            <div class="mb-6">
              <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">Opcje specjalne</p>
              <div class="space-y-2">
                <label class="flex cursor-pointer items-center">
                  <input
                    v-model="filters.freeCancellation"
                    type="checkbox"
                    class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Anulowanie bezpłatne</span>
                </label>
                <label class="flex cursor-pointer items-center">
                  <input
                    v-model="filters.petFriendly"
                    type="checkbox"
                    class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Przyjazne zwierzętom</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- wyniki wyszukiwania -->
        <div class="flex-1">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              Wyniki ({{ filteredAccommodations.length }})
            </h2>
            <select
              v-model="sortBy"
              class="cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="price">Cena: od najniższej</option>
              <option value="rating">Ocena: od najwyższej</option>
              <option value="popularity">Popularność</option>
              <option value="distance">Odległość</option>
            </select>
          </div>

          <!-- Loading state -->
          <div v-if="loading" class="py-16 text-center">
            <div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p class="text-gray-600 dark:text-gray-400">Wyszukiwanie noclegów...</p>
          </div>

          <!-- Empty state -->
          <div
            v-else-if="accommodations.length === 0 && !loading"
            class="py-16 text-center text-gray-500 dark:text-gray-400"
          >
            <p class="mb-2 text-lg font-medium">Użyj formularza powyżej, aby wyszukać noclegi</p>
            <p class="text-sm">Wprowadź miejsce docelowe, daty i liczbę gości, a następnie kliknij "Szukaj"</p>
          </div>

          <!-- Results -->
          <div v-else class="grid gap-6">
            <div
              v-for="accommodation in sortedAccommodations"
              :key="accommodation.id"
              class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="flex">
                <!-- zdjęcie -->
                <div class="h-48 w-64 flex-shrink-0">
                  <img
                    :src="accommodation.image"
                    :alt="accommodation.name"
                    class="h-full w-full object-cover"
                    @error="handleImageError"
                  />
                </div>

                <!-- treść -->
                <div class="flex-1 p-6">
                  <div class="mb-2 flex items-start justify-between">
                    <div>
                      <h3 class="mb-1 text-lg font-bold text-gray-900 dark:text-white">
                        {{ accommodation.name }}
                      </h3>
                      <p class="mb-2 text-sm text-gray-600 dark:text-gray-400">
                        {{ accommodation.address || accommodation.location }}
                      </p>
                      <div class="mb-2 flex items-center gap-2">
                        <span
                          class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                          :class="getTypeClass(accommodation.type)"
                        >
                          {{ getTypeLabel(accommodation.type) }}
                        </span>
                        <div class="flex items-center">
                          <svg class="h-4 w-4 fill-current text-yellow-400" viewBox="0 0 20 20">
                            <path
                              d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                            />
                          </svg>
                          <span class="ml-1 text-sm font-medium text-gray-900 dark:text-white">
                            {{ accommodation.rating }}
                          </span>
                          <span class="ml-1 text-sm text-gray-500 dark:text-gray-400">
                            ({{ accommodation.reviews }} opinii)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div class="text-right">
                      <p class="text-2xl font-bold text-gray-900 dark:text-white">
                        {{ accommodation.price }} zł
                      </p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">za noc</p>
                    </div>
                  </div>

                  <p class="mb-4 text-sm text-gray-700 dark:text-gray-300">
                    {{ accommodation.description }}
                  </p>

                  <!-- udogodnienia -->
                  <div class="mb-4 flex flex-wrap gap-2">
                    <span
                      v-for="amenity in accommodation.amenities.slice(0, 4)"
                      :key="amenity"
                      class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {{ getAmenityLabel(amenity) }}
                    </span>
                    <span
                      v-if="accommodation.amenities.length > 4"
                      class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    >
                      +{{ accommodation.amenities.length - 4 }} więcej
                    </span>
                  </div>

                  <div class="flex items-center justify-end">
                    <button
                      class="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      @click="handleViewDetails(accommodation)"
                    >
                      Zobacz szczegóły
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { XMarkIcon, UserGroupIcon } from '@heroicons/vue/24/outline';
import DateRangePicker from '../components/FlightsPage/FlightSearchFormComponents/DateRangePicker.vue';
import TravelersSelector from '../components/FlightsPage/FlightSearchFormComponents/TravelersSelector.vue';
import { useAccommodations, type Accommodation } from '../composables/useAccommodations';
import { useActivePanel } from '../composables/useActivePanel';
import { usePopupPosition } from '../composables/usePopupPosition';

const {
  accommodations,
  loading,
  error,
  searchAccommodations: searchAccommodationsAPI,
  clearError,
} = useAccommodations();

const { setActivePanel, isActive, closePanel } = useActivePanel();
const { updatePosition } = usePopupPosition();

const searchForm = ref({
  destination: '',
  checkIn: '',
  checkOut: '',
  adults: 2,
  children: 0,
});

const defaultFilters = {
  priceMin: 0,
  priceMax: 2000,
  type: '',
  minRating: 0,
  amenities: [] as string[],
  stars: 0,
  maxDistance: 0,
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

const filters = ref({ ...defaultFilters });

const resetFilters = () => {
  filters.value = { ...defaultFilters };
};

const sortBy = ref('price');
const showTravelers = ref(false);
const travelersButtonRef = ref<HTMLElement | null>(null);
const travelersRef = ref<HTMLElement | null>(null);
const travelersPosition = ref({ top: '0px', left: '0px' });

const isSearchFormValid = computed(() => {
  return (
    searchForm.value.destination.trim() !== '' &&
    searchForm.value.checkIn !== '' &&
    searchForm.value.checkOut !== '' &&
    searchForm.value.adults > 0 &&
    searchForm.value.children >= 0
  );
});

const filteredAccommodations = computed(() => {
  return accommodations.value.filter(accommodation => {
    const priceInRange =
      (!filters.value.priceMin || accommodation.price >= filters.value.priceMin) &&
      (!filters.value.priceMax || accommodation.price <= filters.value.priceMax);

    const typeMatch = !filters.value.type || accommodation.type === filters.value.type;

    const ratingMatch = accommodation.rating >= filters.value.minRating;

    const amenitiesMatch =
      filters.value.amenities.length === 0 ||
      filters.value.amenities.every(amenity => accommodation.amenities.includes(amenity));

    const starsMatch =
      !filters.value.stars ||
      (accommodation.stars !== undefined && accommodation.stars >= filters.value.stars);

    const distanceMatch =
      !filters.value.maxDistance ||
      (accommodation.distanceValue !== undefined &&
        accommodation.distanceValue <= filters.value.maxDistance);

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
      distanceMatch &&
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

const sortedAccommodations = computed(() => {
  const sorted = [...filteredAccommodations.value];

  switch (sortBy.value) {
    case 'price':
      return sorted.sort((a, b) => a.price - b.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'popularity':
      return sorted.sort((a, b) => b.reviews - a.reviews);
    case 'distance':
      const getDistanceValue = (acc: Accommodation) => {
        if (acc.distanceValue !== undefined) return acc.distanceValue;
        if (!acc.distance) return Infinity;
        const match = acc.distance.match(/([\d.]+)/);
        return match && match[1] ? parseFloat(match[1]) : Infinity;
      };
      return sorted.sort((a, b) => getDistanceValue(a) - getDistanceValue(b));
    default:
      return sorted;
  }
});

const getTypeClass = (type: string) => {
  const classes: Record<string, string> = {
    hotel: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    apartment: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    hostel: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    bnb: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    villa: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };
  return classes[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
};

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    hotel: 'Hotel',
    apartment: 'Apartament',
    hostel: 'Hostel',
    bnb: 'B&B',
    villa: 'Willa',
  };
  return labels[type] || type;
};

const getAmenityLabel = (amenity: string) => {
  const labels: Record<string, string> = {
    wifi: 'Wi-Fi',
    parking: 'Parking',
    pool: 'Basen',
    breakfast: 'Śniadanie',
    spa: 'SPA',
    gym: 'Siłownia',
    kitchen: 'Kuchnia',
    balcony: 'Balkon',
    lounge: 'Salon',
    garden: 'Ogród',
    pets: 'Zwierzęta',
  };
  return labels[amenity] || amenity;
};

// Mockowe dane do testowania widoku
const getMockAccommodations = (): Accommodation[] => {
  return [
    {
      id: '1',
      name: 'Hotel Luxe Paris',
      type: 'hotel',
      location: 'Centrum Paryża, 1. dzielnica',
      address: '15 Rue de Rivoli, 75001 Paris, Francja',
      price: 450,
      rating: 9.2,
      reviews: 1247,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      description:
        'Elegancki hotel butikowy w sercu Paryża, w pobliżu Luwru i Ogrodu Tuileries. Oferuje luksusowe pokoje z widokiem na miasto.',
      amenities: ['wifi', 'parking', 'breakfast', 'spa', 'gym', 'restaurant', 'airConditioning'],
      distance: '0.2 km',
      distanceValue: 0.2,
      externalUrl: 'https://www.booking.com',
      stars: 5,
      freeCancellation: true,
      breakfastIncluded: true,
      airConditioning: true,
      fitnessCenter: true,
      spa: true,
      restaurant: true,
      reception24h: true,
    },
    {
      id: '2',
      name: 'Cozy Montmartre Apartment',
      type: 'apartment',
      location: 'Montmartre, 18. dzielnica',
      address: '42 Rue Lepic, 75018 Paris, Francja',
      price: 180,
      rating: 8.7,
      reviews: 432,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      description:
        'Przytulny apartament w artystycznej dzielnicy Montmartre. Idealny dla par szukających autentycznego paryskiego doświadczenia.',
      amenities: ['wifi', 'kitchen', 'balcony', 'airConditioning'],
      distance: '2.1 km',
      distanceValue: 2.1,
      externalUrl: 'https://www.booking.com',
      stars: 0,
      freeCancellation: true,
      breakfastIncluded: false,
      airConditioning: true,
      balcony: true,
    },
    {
      id: '3',
      name: 'Budget Hostel Central',
      type: 'hostel',
      location: 'Łacińska Dzielnica, 5. dzielnica',
      address: '8 Rue Mouffetard, 75005 Paris, Francja',
      price: 45,
      rating: 7.8,
      reviews: 892,
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
      description:
        'Nowoczesny hostel w centrum Paryża. Doskonały wybór dla podróżników z ograniczonym budżetem.',
      amenities: ['wifi', 'breakfast', 'lounge', 'kitchen'],
      distance: '1.5 km',
      distanceValue: 1.5,
      externalUrl: 'https://www.booking.com',
      stars: 2,
      freeCancellation: false,
      breakfastIncluded: true,
    },
    {
      id: '4',
      name: 'Charming B&B Seine View',
      type: 'bnb',
      location: 'Île Saint-Louis, 4. dzielnica',
      address: '12 Quai d\'Orléans, 75004 Paris, Francja',
      price: 280,
      rating: 9.5,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      description: 'Urokliwy pensjonat z widokiem na Sekwanę. Rodzinna atmosfera i domowe śniadania.',
      amenities: ['wifi', 'breakfast', 'garden', 'pets'],
      distance: '0.8 km',
      distanceValue: 0.8,
      externalUrl: 'https://www.booking.com',
      stars: 4,
      freeCancellation: true,
      breakfastIncluded: true,
      petFriendly: true,
    },
    {
      id: '5',
      name: 'Modern Villa Suburbs',
      type: 'villa',
      location: 'Neuilly-sur-Seine',
      address: '45 Avenue de Madrid, 92200 Neuilly-sur-Seine, Francja',
      price: 650,
      rating: 8.9,
      reviews: 78,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      description: 'Luksusowa willa na przedmieściach Paryża. Idealna dla większych grup i rodzin.',
      amenities: ['wifi', 'parking', 'pool', 'garden', 'kitchen', 'airConditioning', 'fitnessCenter'],
      distance: '8.5 km',
      distanceValue: 8.5,
      externalUrl: 'https://www.booking.com',
      stars: 5,
      freeCancellation: true,
      breakfastIncluded: false,
      airConditioning: true,
      fitnessCenter: true,
    },
    {
      id: '6',
      name: 'Boutique Hotel Marais',
      type: 'hotel',
      location: 'Le Marais, 3. dzielnica',
      address: '28 Rue des Rosiers, 75003 Paris, Francja',
      price: 320,
      rating: 8.5,
      reviews: 567,
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      description:
        'Stylowy hotel butikowy w modnej dzielnicy Le Marais. Blisko najlepszych restauracji i sklepów.',
      amenities: ['wifi', 'breakfast', 'spa', 'restaurant', 'airConditioning', 'reception24h'],
      distance: '1.2 km',
      distanceValue: 1.2,
      externalUrl: 'https://www.booking.com',
      stars: 4,
      freeCancellation: true,
      breakfastIncluded: true,
      airConditioning: true,
      spa: true,
      restaurant: true,
      reception24h: true,
    },
    {
      id: '7',
      name: 'Eco-Friendly Hostel',
      type: 'hostel',
      location: 'Belleville, 20. dzielnica',
      address: '15 Rue de Belleville, 75020 Paris, Francja',
      price: 35,
      rating: 7.5,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
      description:
        'Ekologiczny hostel z przyjazną atmosferą. Idealny dla świadomych podróżników.',
      amenities: ['wifi', 'breakfast', 'kitchen', 'garden'],
      distance: '3.8 km',
      distanceValue: 3.8,
      externalUrl: 'https://www.booking.com',
      stars: 1,
      freeCancellation: false,
      breakfastIncluded: true,
    },
    {
      id: '8',
      name: 'Luxury Suite Eiffel Tower',
      type: 'apartment',
      location: '7. dzielnica, blisko Wieży Eiffla',
      address: '12 Avenue de la Bourdonnais, 75007 Paris, Francja',
      price: 520,
      rating: 9.8,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      description:
        'Luksusowy apartament z widokiem na Wieżę Eiffla. Nowoczesne wnętrza i pełne wyposażenie.',
      amenities: ['wifi', 'kitchen', 'balcony', 'airConditioning', 'parking'],
      distance: '0.5 km',
      distanceValue: 0.5,
      externalUrl: 'https://www.booking.com',
      stars: 0,
      freeCancellation: true,
      breakfastIncluded: false,
      airConditioning: true,
      balcony: true,
    },
  ];
};

const handleSearch = async () => {
  if (!isSearchFormValid.value) return;

  // TODO: Gdy API będzie gotowe, odkomentować poniższą linię i usunąć mockowe dane
  // await searchAccommodationsAPI({
  //   destination: searchForm.value.destination,
  //   checkIn: searchForm.value.checkIn,
  //   checkOut: searchForm.value.checkOut,
  //   adults: searchForm.value.adults,
  //   children: searchForm.value.children > 0 ? searchForm.value.children : undefined,
  //   priceMin: filters.value.priceMin || undefined,
  //   priceMax: filters.value.priceMax || undefined,
  //   type: filters.value.type || undefined,
  //   minRating: filters.value.minRating || undefined,
  //   amenities: filters.value.amenities.length > 0 ? filters.value.amenities : undefined,
  //   stars: filters.value.stars || undefined,
  //   maxDistance: filters.value.maxDistance || undefined,
  //   freeCancellation: filters.value.freeCancellation || undefined,
  //   breakfastIncluded: filters.value.breakfastIncluded || undefined,
  //   petFriendly: filters.value.petFriendly || undefined,
  //   airConditioning: filters.value.airConditioning || undefined,
  //   balcony: filters.value.balcony || undefined,
  //   fitnessCenter: filters.value.fitnessCenter || undefined,
  //   spa: filters.value.spa || undefined,
  //   restaurant: filters.value.restaurant || undefined,
  //   reception24h: filters.value.reception24h || undefined,
  //   airportTransfer: filters.value.airportTransfer || undefined,
  // });

  // Mockowe dane - do usunięcia po podłączeniu API
  loading.value = true;
  setTimeout(() => {
    accommodations.value = getMockAccommodations();
    loading.value = false;
  }, 500);
};

const handleViewDetails = (accommodation: Accommodation) => {
  if (accommodation.externalUrl) {
    window.open(accommodation.externalUrl, '_blank', 'noopener,noreferrer');
  } else {
    // Fallback - można użyć Booking.com lub innej strony z parametrami
    const searchQuery = encodeURIComponent(`${accommodation.name} ${accommodation.location}`);
    window.open(`https://www.booking.com/searchresults.html?ss=${searchQuery}`, '_blank', 'noopener,noreferrer');
  }
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = 'https://via.placeholder.com/800x600?text=Nocleg';
};

const toggleTravelers = (event: Event) => {
  event.stopPropagation();
  if (showTravelers.value) {
    showTravelers.value = false;
    closePanel();
  } else {
    showTravelers.value = true;
    setActivePanel('travelers');
    nextTick(() => {
      updatePosition(travelersButtonRef.value, travelersPosition, 320);
    });
  }
};

const updateTravelers = (value: { adults: number; children: number }) => {
  searchForm.value.adults = value.adults;
  searchForm.value.children = value.children;
  showTravelers.value = false;
  closePanel();
};

watch(
  () => isActive('travelers'),
  active => {
    if (!active && showTravelers.value) {
      showTravelers.value = false;
    }
  }
);

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;

  if (
    showTravelers.value &&
    travelersRef.value &&
    !travelersRef.value.contains(target) &&
    travelersButtonRef.value &&
    !travelersButtonRef.value.contains(target)
  ) {
    showTravelers.value = false;
    closePanel();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', () => {
    if (showTravelers.value) {
      updatePosition(travelersButtonRef.value, travelersPosition, 320);
    }
  });
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
