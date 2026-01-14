<template>
  <div class="flex-1 overflow-hidden">
    <AttractionsList
      :attractions="sortedAttractions"
      :filters="filters"
      :sort-by="sortBy"
      :active-filters-count="activeFiltersCount"
      :available-types="availableTypes"
      @update:filters="updateFilters"
      @update:sort-by="updateSortBy"
      @reset-filters="resetFilters"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AttractionsList from './AttractionsList.vue';
import { useAttractionFilters } from '@/composables/useAttractionFilters';
import type { Attraction, AttractionFilters } from '@/types/activitie';

const props = defineProps<{
  attractions: Attraction[];
}>();

const attractionsToDisplay = computed(() => props.attractions);

const { filters, sortBy, sortedAttractions, resetFilters, activeFiltersCount } =
  useAttractionFilters(attractionsToDisplay);

// Dynamicznie pobierz unikalne typy atrakcji z danych
const availableTypes = computed(() => {
  const types = new Set<string>();
  props.attractions.forEach(a => {
    if (a.category) types.add(a.category);
    if (a.type) types.add(a.type);
  });
  return Array.from(types).sort();
});

const updateFilters = (newFilters: Partial<AttractionFilters>) => {
  filters.value = { ...filters.value, ...newFilters };
};

const updateSortBy = (newSort: string) => {
  sortBy.value = newSort as 'recommended' | 'rating' | 'popular' | 'rating-asc' | 'popular-asc';
};
</script>
