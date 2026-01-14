<template>
  <div class="flex-1 overflow-hidden">
    <RestaurantsList
      :restaurants="sortedRestaurants"
      :filters="filters"
      :sort-by="sortBy"
      :active-filters-count="activeFiltersCount"
      :available-cuisines="availableCuisines"
      :available-price-ranges="availablePriceRanges"
      @update:filters="updateFilters"
      @update:sort-by="updateSortBy"
      @reset-filters="resetFilters"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue';
import RestaurantsList from './RestaurantsList.vue';
import { useRestaurantFilters } from '@/composables/useRestaurantFilters';
import type { Restaurant, RestaurantFilters } from '@/types/activitie';

const props = defineProps<{
  restaurants: Restaurant[];
}>();

const { filters, sortBy, sortedRestaurants, resetFilters, activeFiltersCount } =
  useRestaurantFilters(toRef(props, 'restaurants'));

// Dynamicznie pobierz unikalne typy kuchni z danych
const availableCuisines = computed(() => {
  const cuisines = new Set<string>();
  props.restaurants.forEach(r => {
    if (r.cuisine) {
      cuisines.add(r.cuisine);
    }
  });
  return Array.from(cuisines).sort();
});

// Dynamicznie pobierz unikalne przedziały cenowe z danych
const availablePriceRanges = computed(() => {
  const ranges = new Set<string>();
  props.restaurants.forEach(r => {
    if (r.priceRange) {
      ranges.add(r.priceRange);
    }
  });
  return Array.from(ranges).sort();
});

const updateFilters = (newFilters: Partial<RestaurantFilters>) => {
  filters.value = { ...filters.value, ...newFilters };
};

const updateSortBy = (newSort: string) => {
  sortBy.value = newSort as
    | 'recommended'
    | 'rating'
    | 'rating-asc'
    | 'popular'
    | 'popular-asc'
    | 'price-low'
    | 'price-high';
};
</script>
