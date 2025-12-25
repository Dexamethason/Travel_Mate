import { ref, computed, type Ref } from 'vue';
import type { Restaurant, RestaurantFilters } from '@/types/activitie';

export function useRestaurantFilters(restaurants: Ref<Restaurant[]>) {
  const filters = ref<RestaurantFilters>({
    cuisine: '',
    priceRange: '',
    minRating: '',
    openNow: false,
  });

  const sortBy = ref<'recommended' | 'rating' | 'distance' | 'price-low' | 'price-high'>('recommended');

  const filteredRestaurants = computed(() => {
    let result = [...restaurants.value];

    // Filtr typu kuchni - sprawdza czy cuisine zawiera wybrany tekst
    if (filters.value.cuisine) {
      result = result.filter(r => 
        r.cuisine.toLowerCase().includes(filters.value.cuisine.toLowerCase())
      );
    }

    // Filtr przedziału cenowego - porównuje długość stringów
    if (filters.value.priceRange) {
      result = result.filter(r => r.priceRange === filters.value.priceRange);
    }

    // Filtr minimalnej oceny
    if (filters.value.minRating) {
      const minRating = parseFloat(filters.value.minRating);
      result = result.filter(r => r.rating >= minRating);
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
        return result.sort((a, b) => b.rating - a.rating);
      
      case 'distance':
        return result.sort((a, b) => {
          // Wyciąga liczby z stringów typu "12 min spacerem"
          const distA = parseFloat(a.distance.match(/\d+/)?.[0] || '999');
          const distB = parseFloat(b.distance.match(/\d+/)?.[0] || '999');
          return distA - distB;
        });
      
      case 'price-low':
        return result.sort((a, b) => a.priceRange.length - b.priceRange.length);
      
      case 'price-high':
        return result.sort((a, b) => b.priceRange.length - a.priceRange.length);
      
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
      cuisine: '',
      priceRange: '',
      minRating: '',
      openNow: false,
    };
    sortBy.value = 'recommended';
  };

  const activeFiltersCount = computed(() => {
    let count = 0;
    if (filters.value.cuisine) count++;
    if (filters.value.priceRange) count++;
    if (filters.value.minRating) count++;
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