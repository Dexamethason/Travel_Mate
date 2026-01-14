import { ref, computed, type Ref } from 'vue';
import type { Restaurant, RestaurantFilters } from '@/types/activitie';

export function useRestaurantFilters(restaurants: Ref<Restaurant[]>) {
  const filters = ref<RestaurantFilters>({
    cuisine: '',
    priceRange: '',
    minRating: '',
    openNow: false,
  });

  const sortBy = ref<
    'recommended' | 'rating' | 'rating-asc' | 'popular' | 'popular-asc' | 'price-low' | 'price-high'
  >('recommended');

  const filteredRestaurants = computed(() => {
    let result = [...restaurants.value];

    // Cuisine filter
    if (filters.value.cuisine && filters.value.cuisine !== '') {
      result = result.filter(r =>
        r.cuisine?.toLowerCase().includes(filters.value.cuisine.toLowerCase())
      );
    }

    // Price range filter
    if (filters.value.priceRange && filters.value.priceRange !== '') {
      result = result.filter(r => r.priceRange === filters.value.priceRange);
    }

    // Rating filter
    if (filters.value.minRating && filters.value.minRating !== '') {
      const minRating = parseFloat(filters.value.minRating);
      result = result.filter(r => (r.rating ?? 0) >= minRating);
    }

    // Open now filter
    if (filters.value.openNow) {
      result = result.filter(r => {
        const hours = r.openingHours;

        // Jeśli brak informacji o godzinach, pokaż restaurację
        if (!hours) return true;

        // Sprawdź czy czynne całą dobę
        if (/Czynne całą dobę/i.test(hours)) {
          return true;
        }

        // Sprawdź czy zawiera słowo "Otwarte"
        if (/Otwarte/i.test(hours)) {
          return true;
        }

        // Sprawdź czy zawiera słowo "Zamknięte" - jeśli tak, ukryj
        if (/Zamknięte/i.test(hours)) {
          return false;
        }

        return true;
      });
    }

    return result;
  });

  const sortedRestaurants = computed(() => {
    const result = [...filteredRestaurants.value];

    switch (sortBy.value) {
      case 'rating':
        return result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

      case 'rating-asc':
        return result.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));

      case 'popular':
        return result.sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0));

      case 'popular-asc':
        return result.sort((a, b) => (a.reviews ?? 0) - (b.reviews ?? 0));

      case 'price-low':
        return result.sort((a, b) => {
          const priceA = a.priceRange?.length ?? 0;
          const priceB = b.priceRange?.length ?? 0;
          return priceA - priceB;
        });

      case 'price-high':
        return result.sort((a, b) => {
          const priceA = a.priceRange?.length ?? 0;
          const priceB = b.priceRange?.length ?? 0;
          return priceB - priceA;
        });

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
      cuisine: '',
      priceRange: '',
      minRating: '',
      openNow: false,
    };
  };

  const activeFiltersCount = computed(() => {
    let count = 0;
    if (filters.value.cuisine && filters.value.cuisine !== '') count++;
    if (filters.value.priceRange && filters.value.priceRange !== '') count++;
    if (filters.value.minRating && filters.value.minRating !== '') count++;
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
