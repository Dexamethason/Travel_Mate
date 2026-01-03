<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="flex-1 overflow-y-auto bg-gray-50 px-6">
      <!-- Nagłówek -->
      <div class="sticky top-0 z-10 bg-gray-50 pt-4">
        <div class="bg-white rounded-t-xl shadow-md border-x border-t border-gray-200 p-5">
          <div class="flex items-center justify-between" :class="{ 'mb-4': showFilters }">
            <div class="flex items-baseline gap-1">
              <h2 class="text-3xl font-extrabold text-gray-900">Atrakcje</h2>
              <span class="text-base font-medium text-gray-500">({{ attractions.length }})</span>
            </div>

            <div class="flex items-center gap-3">
              <!-- Przycisk filtrów -->
              <button
                :class=" [
                  'px-4 py-2 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 text-sm font-semibold shadow-sm',
                  activeFiltersCount > 0
                    ? 'border-primary-500 text-primary-700 hover:border-primary-600'
                    : 'hover:border-primary-500 text-gray-700'
                ]"
                @click="showFilters = !showFilters"
              >
                <FunnelIcon class="w-4 h-4 flex-shrink-0" />
                <span>Filtry</span>
              </button>

              <!-- Menu sortowania -->
              <div class="relative" ref="sortMenuRef">
                <button
                  class="px-4 py-2 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-primary-500 transition-all flex items-center gap-2 text-gray-700 text-sm font-semibold min-w-[200px] justify-between shadow-sm"
                  @click="toggleSort"
                >
                  <span>{{ getSortLabel(sortBy) }}</span>
                  <ChevronDownIcon
                    class="w-4 h-4 transition-transform"
                    :class="{ 'rotate-180': showSort }"
                  />
                </button>

                <div
                  v-if="showSort"
                  class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border-2 border-gray-200 py-2 z-20"
                >
                  <button
                    v-for="option in sortOptions"
                    :key="option.value"
                    class="w-full px-4 py-2.5 text-left hover:bg-primary-50 transition-colors text-sm font-semibold"
                    :class="{
                      'bg-primary-100 text-primary-700': sortBy === option.value,
                      'text-gray-700': sortBy !== option.value,
                    }"
                    @click="selectSort(option.value)"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Panel filtrów -->
          <div v-if="showFilters" class="pt-5 border-t-2 border-gray-200">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Typ atrakcji</label>
                <select
                  :value="filters.type"
                  class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all cursor-pointer"
                  @change="updateFilter('type', ($event.target as HTMLSelectElement).value)"
                >
                  <option value="" class="cursor-pointer">Wszystkie</option>
                  <option value="muzeum" class="cursor-pointer">Muzea</option>
                  <option value="zabytek" class="cursor-pointer">Zabytki</option>
                  <option value="park" class="cursor-pointer">Parki</option>
                  <option value="rozrywka" class="cursor-pointer">Rozrywka</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Przedział cenowy</label>
                <select
                  :value="filters.priceRange"
                  class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all cursor-pointer"
                  @change="updateFilter('priceRange', ($event.target as HTMLSelectElement).value)"
                >
                  <option value="" class="cursor-pointer">Wszystkie</option>
                  <option value="free" class="cursor-pointer">Darmowe</option>
                  <option value="€" class="cursor-pointer">€ - Tanie</option>
                  <option value="€€" class="cursor-pointer">€€ - Średnie</option>
                  <option value="€€€" class="cursor-pointer">€€€ - Drogie</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Ocena min.</label>
                <select
                  :value="filters.minRating"
                  class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all cursor-pointer"
                  @change="updateFilter('minRating', ($event.target as HTMLSelectElement).value)"
                >
                  <option value="" class="cursor-pointer">Wszystkie</option>
                  <option value="4.5" class="cursor-pointer">4.5+</option>
                  <option value="4.0" class="cursor-pointer">4.0+</option>
                  <option value="3.5" class="cursor-pointer">3.5+</option>
                </select>
              </div>
            </div>

            <div class="mt-4 flex items-center justify-between">
              <label class="flex items-center text-sm font-bold text-gray-700 cursor-pointer">
                <input
                  :checked="filters.wheelchairAccessible"
                  type="checkbox"
                  class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mr-2"
                  @change="updateFilter('wheelchairAccessible', ($event.target as HTMLInputElement).checked)"
                />
                Dostępne dla niepełnosprawnych
              </label>

              <button
                v-if="activeFiltersCount > 0"
                class="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors"
                @click="$emit('reset-filters')"
              >
                Wyczyść filtry ({{ activeFiltersCount }})
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista kart -->
      <div class="pt-4 pb-4 space-y-4">
        <div v-if="attractions.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">Brak atrakcji spełniających wybrane kryteria</p>
          <button
            class="mt-4 text-primary-600 hover:text-primary-700 font-semibold"
            @click="$emit('reset-filters')"
          >
            Wyczyść filtry
          </button>
        </div>

        <AttractionCard
          v-for="attraction in attractions"
          :key="attraction.id"
          :attraction="attraction"
          @click="openAttractionDetails(attraction)"
        />
      </div>
    </div>

    <!-- Modal szczegółów atrakcji -->
    <AttractionDetailsModal
      v-if="selectedAttraction"
      :show="showDetailsModal"
      :attraction="selectedAttraction"
      @close="closeAttractionDetails"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { FunnelIcon, ChevronDownIcon } from '@heroicons/vue/24/outline';
import AttractionCard from './AttractionCard.vue';
import AttractionDetailsModal from './AttractionDetailsModal.vue';
import type { Attraction, AttractionFilters } from '@/types/activitie';

interface Props {
  attractions: Attraction[];
  filters: AttractionFilters;
  sortBy: string;
  activeFiltersCount: number;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:filters': [filters: Partial<AttractionFilters>];
  'update:sort-by': [sortBy: string];
  'reset-filters': [];
}>();

const showFilters = ref(false);
const showSort = ref(false);
const showDetailsModal = ref(false);
const selectedAttraction = ref<Attraction | null>(null);
const sortMenuRef = ref<HTMLElement | null>(null);

const sortOptions = [
  { value: 'recommended', label: 'Rekomendowane' },
  { value: 'rating', label: 'Najwyżej oceniane' },
  { value: 'distance', label: 'Najbliżej' },
  { value: 'popular', label: 'Najpopularniejsze' },
];

const getSortLabel = (value: string) => {
  return sortOptions.find(o => o.value === value)?.label || 'Rekomendowane';
};

const toggleSort = () => {
  showSort.value = !showSort.value;
};

const selectSort = (value: string) => {
  emit('update:sort-by', value);
  showSort.value = false;
};

const updateFilter = (key: keyof AttractionFilters, value: any) => {
  emit('update:filters', { [key]: value });
};

const openAttractionDetails = (attraction: Attraction) => {
  selectedAttraction.value = attraction;
  showDetailsModal.value = true;
};

const closeAttractionDetails = () => {
  showDetailsModal.value = false;
  setTimeout(() => {
    selectedAttraction.value = null;
  }, 300);
};

// Zamknij dropdown sortowania po kliknięciu poza nim
const handleClickOutside = (event: MouseEvent) => {
  if (sortMenuRef.value && !sortMenuRef.value.contains(event.target as Node)) {
    showSort.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
