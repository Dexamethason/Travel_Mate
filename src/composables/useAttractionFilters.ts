import { ref, computed, type Ref } from 'vue';
import type { Attraction, AttractionFilters } from '@/types/activitie';

export function useAttractionFilters(attractions: Ref<Attraction[]>) {
  const filters = ref<AttractionFilters>({
    type: '',
    priceRange: '',
    minRating: '',
    openNow: false,
  });

  const sortBy = ref<'recommended' | 'rating' | 'popular' | 'rating-asc' | 'popular-asc'>(
    'recommended'
  );

  const filteredAttractions = computed(() => {
    let result = [...attractions.value];

    // Filtr typu atrakcji
    if (filters.value.type && filters.value.type !== '') {
      result = result.filter(
        a =>
          a.category?.toLowerCase().includes(filters.value.type.toLowerCase()) ||
          a.type?.toLowerCase().includes(filters.value.type.toLowerCase())
      );
    }

    // Rating filter
    if (filters.value.minRating && filters.value.minRating !== '') {
      const minRating = parseFloat(filters.value.minRating);
      result = result.filter(a => (a.rating ?? 0) >= minRating);
    }

    // Open now filter - sprawdź czy atrakcja jest teraz otwarta
    if (filters.value.openNow) {
      result = result.filter(a => {
        const hours = a.openingHours;

        // Jeśli brak informacji o godzinach, pokaż jako otwarte
        if (!hours) return true;

        // Sprawdź czy jest status "Brak informacji"
        if (/Brak informacji/i.test(hours)) {
          return true;
        }

        // Sprawdź czy czynne całą dobę
        if (/Czynne całą dobę/i.test(hours)) {
          return true;
        }

        // Sprawdź czy zawiera słowo "Zamknięte" - jeśli tak, ukryj
        if (/Zamknięte/i.test(hours)) {
          return false;
        }

        // Sprawdź czy zawiera słowo "Otwarte" - jeśli tak, pokaż
        if (/Otwarte/i.test(hours)) {
          return true;
        }

        return false;
      });
    }

    return result;
  });

  const sortedAttractions = computed(() => {
    const result = [...filteredAttractions.value];

    switch (sortBy.value) {
      case 'rating':
        return result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

      case 'rating-asc':
        return result.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));

      case 'popular':
        return result.sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0));

      case 'popular-asc':
        return result.sort((a, b) => (a.reviews ?? 0) - (b.reviews ?? 0));

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
      type: '',
      priceRange: '',
      minRating: '',
      openNow: false,
    };
  };

  const activeFiltersCount = computed(() => {
    let count = 0;
    if (filters.value.type && filters.value.type !== '') count++;
    if (filters.value.priceRange && filters.value.priceRange !== '') count++;
    if (filters.value.minRating && filters.value.minRating !== '') count++;
    if (filters.value.openNow) count++;
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
