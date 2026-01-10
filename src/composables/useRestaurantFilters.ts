import { ref, computed, type Ref } from 'vue';
import type { Restaurant, RestaurantFilters } from '@/types/activitie';

export function useRestaurantFilters(restaurants: Ref<Restaurant[]>) {
  const filters = ref<RestaurantFilters>({
    cuisine: 'all',
    priceRange: 'all',
    minRating: 'all',
    openNow: false,
  });

  const sortBy = ref<'recommended' | 'rating' | 'distance' | 'price-low' | 'price-high'>(
    'recommended'
  );

  const filteredRestaurants = computed(() => {
    let result = [...restaurants.value];

    // Filtr typu kuchni - sprawdza czy cuisine zawiera wybrany tekst
    if (filters.value.cuisine && filters.value.cuisine !== 'all') {
      result = result.filter(
        r => r.cuisine?.toLowerCase().includes(filters.value.cuisine.toLowerCase()) ?? false
      );
    }

    // Filtr przedziału cenowego - porównuje długość stringów
    if (filters.value.priceRange && filters.value.priceRange !== 'all') {
      result = result.filter(r => r.priceRange === filters.value.priceRange);
    }

    // Filtr minimalnej oceny
    if (filters.value.minRating && filters.value.minRating !== 'all') {
      const minRating = parseFloat(filters.value.minRating);
      result = result.filter(r => (r.rating ?? 0) >= minRating);
    }

    // Filtr otwarte teraz
    if (filters.value.openNow) {
      result = result.filter(r => r.isOpen);
    }

    return result;
  });

  const sortedRestaurants = computed(() => {
    const result = [...filteredRestaurants.value];

    switch (sortBy.value) {
      case 'rating':
        return result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

      case 'distance':
        return result.sort((a, b) => {
          const distA = parseFloat(a.distance?.match(/\d+/)?.[0] || '999');
          const distB = parseFloat(b.distance?.match(/\d+/)?.[0] || '999');
          return distA - distB;
        });

      case 'price-low':
        return result.sort((a, b) => (a.priceRange?.length ?? 0) - (b.priceRange?.length ?? 0));

      case 'price-high':
        return result.sort((a, b) => (b.priceRange?.length ?? 0) - (a.priceRange?.length ?? 0));

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
      cuisine: 'all',
      priceRange: 'all',
      minRating: 'all',
      openNow: false,
    };
    sortBy.value = 'recommended';
  };

  const activeFiltersCount = computed(() => {
    let count = 0;
    if (filters.value.cuisine && filters.value.cuisine !== 'all') count++;
    if (filters.value.priceRange && filters.value.priceRange !== 'all') count++;
    if (filters.value.minRating && filters.value.minRating !== 'all') count++;
    if (filters.value.openNow) count++;
    return count;
  });

  return {
    filters,
    sortBy,
    filteredRestaurants,
    sortedRestaurants,
    resetFilters,
    activeFiltersCount,
  };
}
