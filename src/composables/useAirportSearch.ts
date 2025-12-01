import { ref, computed } from 'vue';
import { searchAirports, getAirportByCode, type Airport } from '@/data/airports';

export function useAirportSearch() {
  const query = ref('');

  const results = computed(() => searchAirports(query.value, 10));

  function search(searchQuery: string) {
    query.value = searchQuery;
  }

  function formatAirport(airport: Airport): string {
    return `${airport.city_pl} (${airport.code})`;
  }

  return {
    query,
    results,
    search,
    getAirportByCode,
    formatAirport,
  };
}

export type { Airport };
