<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="flex-1 overflow-y-auto bg-gray-50 px-6">
      <div class="sticky top-0 z-10 bg-gray-50 pt-4">
        <div class="bg-white rounded-t-xl shadow-md border-x border-t border-gray-200 p-5">
          <div class="flex items-center justify-between">
            <div class="flex items-baseline gap-2">
              <h2 class="text-3xl font-extrabold text-gray-900">Restauracje</h2>
              <span class="text-base font-medium text-gray-400">({{ restaurants.length }})</span>
            </div>

            <div class="flex items-center gap-3">
              <!-- Przycisk filtrów -->
              <button
                class="px-4 py-2 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-primary-500 transition-all flex items-center gap-2 text-gray-700 text-sm font-semibold shadow-sm"
                @click="showFilters = !showFilters"
              >
                <FunnelIcon class="w-4 h-4" />
                Filtry
                <span
                  v-if="activeFiltersCount > 0"
                  class="ml-1 px-2 py-0.5 bg-primary-600 text-white text-xs font-bold rounded-full"
                >
                  {{ activeFiltersCount }}
                </span>
              </button>

              <!-- Menu sortowania -->
              <div class="relative">
                <button
                  class="px-4 py-2 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-primary-500 transition-all flex items-center gap-2 text-gray-700 text-sm font-semibold min-w-[180px] justify-between shadow-sm"
                  @click="showSort = !showSort"
                >
                  <span>{{ selectedSort }}</span>
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
                    :key="option"
                    class="w-full px-4 py-2.5 text-left hover:bg-primary-50 transition-colors text-sm font-semibold"
                    :class="{
                      'bg-primary-100 text-primary-700': selectedSort === option,
                      'text-gray-700': selectedSort !== option,
                    }"
                    @click="selectSort(option)"
                  >
                    {{ option }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Panel filtrów -->
          <div v-if="showFilters" class="mt-5 pt-5 border-t-2 border-gray-200">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Typ kuchni</label>
                <select
                  v-model="filters.cuisine"
                  class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                >
                  <option value="">Wszystkie</option>
                  <option value="french">Kuchnia francuska</option>
                  <option value="italian">Kuchnia włoska</option>
                  <option value="asian">Kuchnia azjatycka</option>
                  <option value="cafe">Kawiarnie</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Przedział cenowy</label>
                <select
                  v-model="filters.priceRange"
                  class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                >
                  <option value="">Wszystkie</option>
                  <option value="1">€ - Tanie</option>
                  <option value="2">€€ - Średnie</option>
                  <option value="3">€€€ - Drogie</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Ocena min.</label>
                <select
                  v-model="filters.minRating"
                  class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                >
                  <option value="">Wszystkie</option>
                  <option value="4.5">4.5+</option>
                  <option value="4.0">4.0+</option>
                  <option value="3.5">3.5+</option>
                </select>
              </div>
            </div>

            <div class="mt-4 flex items-center justify-between">
              <label class="flex items-center text-sm font-bold text-gray-700 cursor-pointer">
                <input
                  v-model="filters.openNow"
                  type="checkbox"
                  class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mr-2"
                />
                Tylko otwarte teraz
              </label>

              <button
                class="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors"
                @click="clearFilters"
              >
                Wyczyść filtry
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista kart z paddingiem tylko od góry i dołu -->
      <div class="pt-4 pb-4 space-y-4">
        <RestaurantCard
          v-for="restaurant in restaurants"
          :key="restaurant.id"
          :restaurant="restaurant"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { FunnelIcon, ChevronDownIcon } from '@heroicons/vue/24/outline';
import RestaurantCard from './RestaurantCard.vue';
import type { Restaurant } from '@/types/activitie';

defineProps<{
  restaurants: Restaurant[];
}>();

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
</script>
