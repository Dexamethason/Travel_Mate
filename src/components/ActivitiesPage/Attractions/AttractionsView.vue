<template>
  <div class="flex-1 overflow-hidden">
    <AttractionsList
      :attractions="sortedAttractions"
      :filters="filters"
      :sort-by="sortBy"
      :active-filters-count="activeFiltersCount"
      :available-types="availableTypes"
      :available-price-ranges="availablePriceRanges"
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

// Dynamicznie pobierz unikalne przedziały cenowe z danych
const availablePriceRanges = computed(() => {
  const ranges = new Set<string>();
  props.attractions.forEach(a => {
    if (a.priceRange) {
      ranges.add(a.priceRange);
    }
    if (a.price) {
      // Jeśli jest tekst "Darmowe", dodaj jako osobną opcję
      if (a.price.toLowerCase().includes('darmowe')) {
        ranges.add('Darmowe');
      }
    }
  });
  return Array.from(ranges).sort();
});

const updateFilters = (newFilters: Partial<AttractionFilters>) => {
  filters.value = { ...filters.value, ...newFilters };
};

const updateSortBy = (newSort: string) => {
  sortBy.value = newSort as 'recommended' | 'rating' | 'distance' | 'popular';
};
</script>
