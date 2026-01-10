import { ref } from 'vue';
import type { Attraction, Restaurant } from '@/types/activitie';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface SearchParams {
  location: string;
  query?: string;
  type?: string;
  hl?: string;
  gl?: string;
}

interface ApiResponse<T> {
  data: T[];
  meta: {
    count: number;
    params: SearchParams;
  };
}

export function useActivities() {
  const attractions = ref<Attraction[]>([]);
  const restaurants = ref<Restaurant[]>([]);
  const isLoadingAttractions = ref(false);
  const isLoadingRestaurants = ref(false);
  const attractionsError = ref<string | null>(null);
  const restaurantsError = ref<string | null>(null);

  // wyszukiwanie atrakcji 
  const searchAttractions = async (location: string, query?: string): Promise<Attraction[]> => {
    isLoadingAttractions.value = true;
    attractionsError.value = null;

    try {
      const params = new URLSearchParams({
        location,
        hl: 'pl',
        gl: 'pl'
      });

      if (query) {
        params.append('query', query);
      }

      const response = await fetch(`${API_BASE_URL}/activities/attractions/search?${params}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to fetch attractions');
      }

      const data: ApiResponse<Attraction> = await response.json();
      attractions.value = data.data;
      
      return data.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Błąd podczas wyszukiwania atrakcji';
      attractionsError.value = errorMessage;
      console.error('Error searching attractions:', error);
      throw error;
    } finally {
      isLoadingAttractions.value = false;
    }
  };

  // wyszukiwanie restauracji
  const searchRestaurants = async (location: string, query?: string): Promise<Restaurant[]> => {
    isLoadingRestaurants.value = true;
    restaurantsError.value = null;

    try {
      const params = new URLSearchParams({
        location,
        hl: 'pl',
        gl: 'pl'
      });

      if (query) {
        params.append('query', query);
      }

      const response = await fetch(`${API_BASE_URL}/activities/restaurants/search?${params}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to fetch restaurants');
      }

      const data: ApiResponse<Restaurant> = await response.json();
      restaurants.value = data.data;
      
      return data.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Błąd podczas wyszukiwania restauracji';
      restaurantsError.value = errorMessage;
      console.error('Error searching restaurants:', error);
      throw error;
    } finally {
      isLoadingRestaurants.value = false;
    }
  };

  const resetAttractions = () => {
    attractions.value = [];
    attractionsError.value = null;
  };

  const resetRestaurants = () => {
    restaurants.value = [];
    restaurantsError.value = null;
  };

  return {
    //state
    attractions,
    restaurants,
    isLoadingAttractions,
    isLoadingRestaurants,
    attractionsError,
    restaurantsError,
    
    //methods
    searchAttractions,
    searchRestaurants,
    resetAttractions,
    resetRestaurants
  };
}

