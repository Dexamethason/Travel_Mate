import { ref, computed, type Ref } from 'vue';
import type { Attraction, AttractionFilters } from '@/types/activitie';

export function useAttractionFilters(attractions: Ref<Attraction[]>) {
  const filters = ref<AttractionFilters>({
    type: 'all',
    priceRange: 'all',
    minRating: 'all',
    wheelchairAccessible: false,
  });

  const sortBy = ref<'recommended' | 'rating' | 'distance' | 'popular'>('recommended');

  const filteredAttractions = computed(() => {
    let result = [...attractions.value];

    // Filtr typu atrakcji - porównuje z category
    if (filters.value.type && filters.value.type !== 'all') {
      result = result.filter(
        a =>
          a.category?.toLowerCase().includes(filters.value.type.toLowerCase()) ||
          a.type?.toLowerCase().includes(filters.value.type.toLowerCase())
      );
    }

    // Price range filter
    if (filters.value.priceRange && filters.value.priceRange !== 'all') {
      result = result.filter(a => {
        if (filters.value.priceRange === 'free') {
          return a.price?.toLowerCase().includes('darmowe') ?? false;
        }
        return a.priceRange === filters.value.priceRange;
      });
    }

    // Rating filter
    if (filters.value.minRating && filters.value.minRating !== 'all') {
      const minRating = parseFloat(filters.value.minRating);
      result = result.filter(a => (a.rating ?? 0) >= minRating);
    }

    // Filtr dostępności dla niepełnosprawnych
    if (filters.value.wheelchairAccessible) {
      result = result.filter(a => a.wheelchairAccessible);
    }

    return result;
  });

  const sortedAttractions = computed(() => {
    const result = [...filteredAttractions.value];

    switch (sortBy.value) {
      case 'rating':
        return result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

      case 'distance':
        return result.sort((a, b) => {
          const distA = parseFloat(a.distance?.match(/\d+/)?.[0] || '999');
          const distB = parseFloat(b.distance?.match(/\d+/)?.[0] || '999');
          return distA - distB;
        });

      case 'popular':
        return result.sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0));

      case 'recommended':
      default:
        return result.sort((a, b) => {
          const scoreA = (a.rating ?? 0) * Math.log10((a.reviews ?? 0) + 1);
          const scoreB = (b.rating ?? 0) * Math.log10((b.reviews ?? 0) + 1);
          return scoreB - scoreA;
        });
    }
  });

  const resetFilters = () => {
    filters.value = {
      type: 'all',
      priceRange: 'all',
      minRating: 'all',
      wheelchairAccessible: false,
    };
    sortBy.value = 'recommended';
  };

  const activeFiltersCount = computed(() => {
    let count = 0;
    if (filters.value.type && filters.value.type !== 'all') count++;
    if (filters.value.priceRange && filters.value.priceRange !== 'all') count++;
    if (filters.value.minRating && filters.value.minRating !== 'all') count++;
    if (filters.value.wheelchairAccessible) count++;
    return count;
  });

  return {
    filters,
    sortBy,
    filteredAttractions,
    sortedAttractions,
    resetFilters,
    activeFiltersCount,
  };
}
