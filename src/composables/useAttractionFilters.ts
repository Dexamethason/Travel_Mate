import { ref, computed, type Ref } from 'vue';
import type { Attraction, AttractionFilters } from '@/types/activitie';

export function useAttractionFilters(attractions: Ref<Attraction[]>) {
  const filters = ref<AttractionFilters>({
    type: '',
    priceRange: '',
    minRating: '',
    wheelchairAccessible: false,
  });

  const sortBy = ref<'recommended' | 'rating' | 'distance' | 'popular'>('recommended');

  const filteredAttractions = computed(() => {
    let result = [...attractions.value];

    // Filtr typu atrakcji - porównuje z category
    if (filters.value.type) {
      result = result.filter(a => 
        a.category.toLowerCase().includes(filters.value.type.toLowerCase()) ||
        a.type?.toLowerCase().includes(filters.value.type.toLowerCase())
      );
    }

    // Filtr przedziału cenowego
    if (filters.value.priceRange) {
      if (filters.value.priceRange === 'free') {
        result = result.filter(a => 
          a.priceRange?.toLowerCase().includes('darmowe') || 
          a.price.toLowerCase().includes('darmowe')
        );
      } else {
        result = result.filter(a => a.priceRange === filters.value.priceRange);
      }
    }

    // Filtr minimalnej oceny
    if (filters.value.minRating) {
      const minRating = parseFloat(filters.value.minRating);
      result = result.filter(a => a.rating >= minRating);
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
        return result.sort((a, b) => b.rating - a.rating);
      
      case 'distance':
        return result.sort((a, b) => {
          // Wyciąga liczby z stringów typu "5 min spacerem"
          const distA = parseFloat(a.distance.match(/\d+/)?.[0] || '999');
          const distB = parseFloat(b.distance.match(/\d+/)?.[0] || '999');
          return distA - distB;
        });
      
      case 'popular':
        return result.sort((a, b) => b.reviews - a.reviews);
      
      case 'recommended':
      default:
        // Sortowanie według kombinacji oceny i liczby opinii
        return result.sort((a, b) => {
          const scoreA = a.rating * Math.log10(a.reviews + 1);
          const scoreB = b.rating * Math.log10(b.reviews + 1);
          return scoreB - scoreA;
        });
    }
  });

  const resetFilters = () => {
    filters.value = {
      type: '',
      priceRange: '',
      minRating: '',
      wheelchairAccessible: false,
    };
    sortBy.value = 'recommended';
  };

  const activeFiltersCount = computed(() => {
    let count = 0;
    if (filters.value.type) count++;
    if (filters.value.priceRange) count++;
    if (filters.value.minRating) count++;
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