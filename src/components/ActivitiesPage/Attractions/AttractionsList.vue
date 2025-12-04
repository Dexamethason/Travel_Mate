<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200">
    <!-- Nagłówek z filtrami i sortowaniem -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">
          Atrakcje
          <span class="text-gray-500 font-normal">({{ attractions.length }})</span>
        </h2>

        <div class="flex items-center gap-2">
          <!-- Przycisk pokazywania filtrów -->
          <button
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 text-sm font-medium"
            @click="showFilters = !showFilters"
          >
            <!-- Ikona lejka (Funnel) -->
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filtry
            <!-- Licznik aktywnych filtrów -->
            <span
              v-if="activeFiltersCount > 0"
              class="px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full"
            >
              {{ activeFiltersCount }}
            </span>
          </button>

          <!-- Menu rozwijane sortowania -->
          <div class="relative">
            <button
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 text-sm font-medium min-w-[180px] justify-between"
              @click="showSort = !showSort"
            >
              <span>{{ selectedSort }}</span>
              <!-- Ikona strzałki w dół (ChevronDown) -->
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <!-- Lista opcji sortowania -->
            <div
              v-if="showSort"
              class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
            >
              <button
                v-for="option in sortOptions"
                :key="option"
                class="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm text-gray-700"
                @click="selectSort(option)"
              >
                {{ option }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel z filtrami (rozwijany) -->
      <div v-if="showFilters" class="pt-4 border-t border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <!-- Filtr typu atrakcji -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Typ atrakcji</label>
            <select
              v-model="filters.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Wszystkie</option>
              <option value="museum">Muzea</option>
              <option value="monument">Zabytki</option>
              <option value="park">Parki</option>
              <option value="entertainment">Rozrywka</option>
            </select>
          </div>

          <!-- Filtr przedziału cenowego -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Przedział cenowy</label>
            <select
              v-model="filters.priceRange"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Wszystkie</option>
              <option value="free">Darmowe</option>
              <option value="1">€ - Tanie</option>
              <option value="2">€€ - Średnie</option>
              <option value="3">€€€ - Drogie</option>
            </select>
          </div>

          <!-- Filtr minimalnej oceny -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Ocena min.</label>
            <select
              v-model="filters.minRating"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Wszystkie</option>
              <option value="4.5">4.5+</option>
              <option value="4.0">4.0+</option>
              <option value="3.5">3.5+</option>
            </select>
          </div>
        </div>

        <!-- Dodatkowe opcje filtrowania -->
        <div class="mt-3 flex items-center gap-4">
          <label class="flex items-center text-sm text-gray-700">
            <input
              v-model="filters.wheelchairAccessible"
              type="checkbox"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mr-2"
            />
            Dostępne dla wózków inwalidzkich
          </label>

          <button class="ml-auto text-sm text-gray-600 hover:text-gray-900" @click="clearFilters">
            Wyczyść filtry
          </button>
        </div>
      </div>
    </div>

    <!-- Lista kart atrakcji -->
    <div class="overflow-y-auto max-h-[calc(100vh-300px)] divide-y divide-gray-200">
      <AttractionCard
        v-for="attraction in attractions"
        :key="attraction.id"
        :attraction="attraction"
      />

      <!-- Przycisk ładowania więcej wyników -->
      <div class="p-6 text-center">
        <button
          class="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-2 mx-auto"
        >
          Załaduj więcej wyników
          <!-- Ikona strzałki w dół (ChevronDown) -->
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import AttractionCard from './AttractionsCard.vue';

// Interfejs atrakcji
interface Attraction {
  id: number;
  photo: string;
  name: string;
  rating: number;
  reviews: number;
  type: string;
  priceRange: string;
  distance: string;
  duration?: string;
  wheelchairAccessible: boolean;
}

// Przykładowe dane atrakcji
const attractions = ref<Attraction[]>([
  {
    id: 1,
    photo: '',
    name: 'Wieża Eiffla',
    rating: 4.6,
    reviews: 125000,
    type: 'Zabytek',
    priceRange: '€€',
    distance: '5 min spacerem',
    duration: '2-3 godziny',
    wheelchairAccessible: true,
  },
  {
    id: 2,
    photo: '',
    name: 'Luwr',
    rating: 4.8,
    reviews: 98000,
    type: 'Muzeum',
    priceRange: '€€',
    distance: '15 min spacerem',
    duration: '3-4 godziny',
    wheelchairAccessible: true,
  },
  {
    id: 3,
    photo: '',
    name: 'Katedra Notre-Dame',
    rating: 4.7,
    reviews: 87000,
    type: 'Zabytek',
    priceRange: 'Darmowe',
    distance: '10 min spacerem',
    duration: '1-2 godziny',
    wheelchairAccessible: false,
  },
]);

// Stany UI
const showFilters = ref(false);
const showSort = ref(false);
const selectedSort = ref('Rekomendowane');

// Filtry
const filters = ref({
  type: '',
  priceRange: '',
  minRating: '',
  wheelchairAccessible: false,
});

// Opcje sortowania
const sortOptions = ['Rekomendowane', 'Najwyżej oceniane', 'Najbliżej', 'Najpopularniejsze'];

// Obliczanie liczby aktywnych filtrów
const activeFiltersCount = computed(() => {
  let count = 0;
  if (filters.value.type) count++;
  if (filters.value.priceRange) count++;
  if (filters.value.minRating) count++;
  if (filters.value.wheelchairAccessible) count++;
  return count;
});

// Wybór opcji sortowania
const selectSort = (option: string) => {
  selectedSort.value = option;
  showSort.value = false;
};

// Czyszczenie filtrów
const clearFilters = () => {
  filters.value = {
    type: '',
    priceRange: '',
    minRating: '',
    wheelchairAccessible: false,
  };
};
</script>
