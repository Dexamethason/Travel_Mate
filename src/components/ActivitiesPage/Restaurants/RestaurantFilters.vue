<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
    <div class="flex flex-col md:flex-row gap-3">
      <!-- Search Field -->
      <div class="flex-1">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Szukaj restauracji..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <!-- Filters Button -->
      <button
        class="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 font-medium"
        @click="showFilters = !showFilters"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        Filtry
        <span
          v-if="activeFiltersCount > 0"
          class="ml-1 px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full"
        >
          {{ activeFiltersCount }}
        </span>
      </button>

      <!-- Sort Dropdown -->
      <div class="relative">
        <button
          class="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 font-medium min-w-[180px] justify-between"
          @click="showSort = !showSort"
        >
          <span>{{ selectedSort }}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

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

    <!-- Filters Panel -->
    <div v-if="showFilters" class="mt-4 pt-4 border-t border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Typ kuchni</label>
          <select
            v-model="filters.cuisine"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Wszystkie</option>
            <option value="french">Kuchnia francuska</option>
            <option value="italian">Kuchnia włoska</option>
            <option value="asian">Kuchnia azjatycka</option>
            <option value="cafe">Kawiarnie</option>
            <option value="fine-dining">Fine dining</option>
            <option value="fast-food">Fast food</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Przedział cenowy</label>
          <select
            v-model="filters.priceRange"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Wszystkie</option>
            <option value="1">€ - Tanie</option>
            <option value="2">€€ - Średnie</option>
            <option value="3">€€€ - Drogie</option>
            <option value="4">€€€€ - Bardzo drogie</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ocena min.</label>
          <select
            v-model="filters.minRating"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Wszystkie</option>
            <option value="4.5">4.5+</option>
            <option value="4.0">4.0+</option>
            <option value="3.5">3.5+</option>
            <option value="3.0">3.0+</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Czynne teraz</label>
          <div class="flex items-center h-10">
            <input
              v-model="filters.openNow"
              type="checkbox"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label class="ml-2 text-sm text-gray-700">Pokaż tylko otwarte</label>
          </div>
        </div>
      </div>

      <div class="mt-4 flex justify-end gap-2">
        <button
          class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          @click="clearFilters"
        >
          Wyczyść filtry
        </button>
        <button
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          @click="applyFilters"
        >
          Zastosuj
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const searchQuery = ref('');
const showFilters = ref(false);
const showSort = ref(false);
const selectedSort = ref('Rekomendowane');

const filters = ref({
  cuisine: '',
  priceRange: '',
  minRating: '',
  openNow: false,
});

const sortOptions = [
  'Rekomendowane',
  'Najwyżej oceniane',
  'Najbliżej',
  'Najniższa cena',
  'Najwyższa cena',
];

const activeFiltersCount = computed(() => {
  let count = 0;
  if (filters.value.cuisine) count++;
  if (filters.value.priceRange) count++;
  if (filters.value.minRating) count++;
  if (filters.value.openNow) count++;
  return count;
});

const selectSort = (option: string) => {
  selectedSort.value = option;
  showSort.value = false;
};

const clearFilters = () => {
  filters.value = {
    cuisine: '',
    priceRange: '',
    minRating: '',
    openNow: false,
  };
};

const applyFilters = () => {
  // Apply filters logic here
  showFilters.value = false;
};
</script>
