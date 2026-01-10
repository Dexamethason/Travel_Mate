import { ref } from 'vue';
import type { Flight, FlightSearchParams } from '@/types/flight';

// API endpoint
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function useFlights() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Wyszukuje loty
   */
  const searchFlights = async (params: FlightSearchParams): Promise<Flight[]> => {
    isLoading.value = true;
    error.value = null;

    try {
      const queryParams = new URLSearchParams({
        from: params.from,
        to: params.to,
        date: params.date,
        passengers: params.passengers?.toString() || '1'
      });

      if (params.returnDate) {
        queryParams.append('returnDate', params.returnDate);
      }

      const response = await fetch(`${API_URL}/flights/search?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Błąd podczas wyszukiwania lotów');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Flight search error:', err);
      error.value = 'Nie udało się wyszukać lotów. Spróbuj ponownie.';
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    searchFlights
  };
}
