import { ref } from 'vue';
import { useAuth } from './useAuth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface AccommodationSearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  priceMin?: number;
  priceMax?: number;
  type?: string;
  minRating?: number;
  amenities?: string[];
  stars?: number; // Liczba gwiazdek (1-5)
  maxDistance?: number; // Maksymalna odległość od centrum w km
  freeCancellation?: boolean;
  breakfastIncluded?: boolean;
  petFriendly?: boolean;
  airConditioning?: boolean;
  balcony?: boolean;
  fitnessCenter?: boolean;
  spa?: boolean;
  restaurant?: boolean;
  reception24h?: boolean;
  airportTransfer?: boolean;
}

export interface AccommodationFilters {
  priceMin: number;
  priceMax: number;
  type: string;
  minRating: number;
  amenities: string[];
  stars: number;
  maxDistance: number;
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  petFriendly: boolean;
  airConditioning: boolean;
  balcony: boolean;
  fitnessCenter: boolean;
  spa: boolean;
  restaurant: boolean;
  reception24h: boolean;
  airportTransfer: boolean;
}

export interface Accommodation {
  id: string;
  name: string;
  type: string;
  location: string;
  address?: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  amenities: string[];
  distance: string;
  distanceValue?: number; // dla sortowania
  externalUrl?: string; // URL do zewnętrznej strony (np. Booking.com)
  latitude?: number;
  longitude?: number;
  stars?: number; // Liczba gwiazdek
  freeCancellation?: boolean;
  breakfastIncluded?: boolean;
  petFriendly?: boolean;
  airConditioning?: boolean;
  balcony?: boolean;
  fitnessCenter?: boolean;
  spa?: boolean;
  restaurant?: boolean;
  reception24h?: boolean;
  airportTransfer?: boolean;
}

export function useAccommodations() {
  const accommodations = ref<Accommodation[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const { getAuthHeaders } = useAuth();

  /**
   * Wyszukuje noclegi na podstawie parametrów wyszukiwania
   * GET /accommodations
   */
  const searchAccommodations = async (params: AccommodationSearchParams) => {
    loading.value = true;
    error.value = null;

    try {
      // Budowanie query string
      const queryParams = new URLSearchParams({
        destination: params.destination,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        adults: params.adults.toString(),
      });

      if (params.children !== undefined && params.children > 0) {
        queryParams.append('children', params.children.toString());
      }

      if (params.priceMin !== undefined) {
        queryParams.append('priceMin', params.priceMin.toString());
      }
      if (params.priceMax !== undefined) {
        queryParams.append('priceMax', params.priceMax.toString());
      }
      if (params.type) {
        queryParams.append('type', params.type);
      }
      if (params.minRating !== undefined) {
        queryParams.append('minRating', params.minRating.toString());
      }
      if (params.amenities && params.amenities.length > 0) {
        params.amenities.forEach(amenity => {
          queryParams.append('amenities', amenity);
        });
      }
      if (params.stars !== undefined) {
        queryParams.append('stars', params.stars.toString());
      }
      if (params.maxDistance !== undefined) {
        queryParams.append('maxDistance', params.maxDistance.toString());
      }
      if (params.freeCancellation !== undefined) {
        queryParams.append('freeCancellation', params.freeCancellation.toString());
      }
      if (params.breakfastIncluded !== undefined) {
        queryParams.append('breakfastIncluded', params.breakfastIncluded.toString());
      }
      if (params.petFriendly !== undefined) {
        queryParams.append('petFriendly', params.petFriendly.toString());
      }
      if (params.airConditioning !== undefined) {
        queryParams.append('airConditioning', params.airConditioning.toString());
      }
      if (params.balcony !== undefined) {
        queryParams.append('balcony', params.balcony.toString());
      }
      if (params.fitnessCenter !== undefined) {
        queryParams.append('fitnessCenter', params.fitnessCenter.toString());
      }
      if (params.spa !== undefined) {
        queryParams.append('spa', params.spa.toString());
      }
      if (params.restaurant !== undefined) {
        queryParams.append('restaurant', params.restaurant.toString());
      }
      if (params.reception24h !== undefined) {
        queryParams.append('reception24h', params.reception24h.toString());
      }
      if (params.airportTransfer !== undefined) {
        queryParams.append('airportTransfer', params.airportTransfer.toString());
      }

      const response = await fetch(`${API_URL}/accommodations?${queryParams.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || 'Nie udało się wyszukać noclegów');
      }

      accommodations.value = data.data || [];
      return accommodations.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Nieznany błąd podczas wyszukiwania noclegów';
      console.error('Błąd podczas wyszukiwania noclegów:', err);
      accommodations.value = [];
      return [];
    } finally {
      loading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  const clearResults = () => {
    accommodations.value = [];
  };

  return {
    accommodations,
    loading,
    error,
    searchAccommodations,
    clearError,
    clearResults,
  };
}
