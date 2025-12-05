<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
    <div class="flex flex-col md:flex-row gap-3">
      <!-- Pole wyszukiwania -->
      <div class="flex-1">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Szukaj atrakcji..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
          <MagnifyingGlassIcon
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          />
        </div>
      </div>

      <!-- Przycisk filtrów -->
      <button
        class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        @click="$emit('open-filters')"
      >
        <FunnelIcon class="w-5 h-5 text-gray-600" />
        <span class="text-sm font-medium text-gray-700">Filtry</span>
      </button>

      <!-- Sortowanie -->
      <div class="relative">
        <select
          :value="sortBy"
          class="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          @change="$emit('update:sort-by', ($event.target as HTMLSelectElement).value)"
        >
          <option value="recommended">Rekomendowane</option>
          <option value="rating">Najwyżej oceniane</option>
          <option value="distance">Najbliższe</option>
          <option value="popular">Najpopularniejsze</option>
        </select>
      </div>
    </div>

    <!-- Panel filtrów -->
    <div v-if="showFilters" class="mt-4 pt-4 border-t border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Typ atrakcji</label>
          <select
            v-model="filters.type"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Wszystkie</option>
            <option value="museum">Muzea</option>
            <option value="monument">Zabytki</option>
            <option value="park">Parki</option>
            <option value="entertainment">Rozrywka</option>
            <option value="shopping">Zakupy</option>
            <option value="viewpoint">Punkty widokowe</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Przedział cenowy</label>
          <select
            v-model="filters.priceRange"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Wszystkie</option>
            <option value="free">Darmowe</option>
            <option value="1">€ - Tanie</option>
            <option value="2">€€ - Średnie</option>
            <option value="3">€€€ - Drogie</option>
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
          <label class="block text-sm font-medium text-gray-700 mb-2">Dostępność</label>
          <div class="flex items-center h-10">
            <input
              v-model="filters.wheelchairAccessible"
              type="checkbox"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label class="ml-2 text-sm text-gray-700">Dostęp dla wózków</label>
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
import { ref } from 'vue';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/vue/24/outline';

// Props
defineProps<{
  sortBy?: string;
}>();

// Emits
defineEmits<{
  'open-filters': [];
  'update:sort-by': [value: string];
}>();

const searchQuery = ref('');
const showFilters = ref(false);

const filters = ref({
  type: '',
  priceRange: '',
  minRating: '',
  wheelchairAccessible: false,
});

const clearFilters = () => {
  filters.value = {
    type: '',
    priceRange: '',
    minRating: '',
    wheelchairAccessible: false,
  };
};

const applyFilters = () => {
  // TODO logika filtrów
  showFilters.value = false;
};
</script>
