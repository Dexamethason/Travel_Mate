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
        location: params.destination, 
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        adults: params.adults.toString(),
      });

      if (params.children !== undefined && params.children > 0) {
        queryParams.append('children', params.children.toString());
      }
      
      const response = await fetch(`${API_URL}/accommodations/search?${queryParams.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Nie udało się wyszukać noclegów');
      }

      // Backend zwraca { data: [], meta: {} }
      const results = data.data || [];
      
      // Mapowanie wyników z backendu na format frontendowy jeśli konieczne
      accommodations.value = results.map((item: any) => ({
        id: item.id,
        name: item.name,
        type: 'Hotel', // Domyślnie
        location: item.location.address || item.name,
        address: item.location.address,
        price: item.price.amount,
        rating: item.rating,
        reviews: item.reviews,
        image: item.imageUrl,
        description: item.description,
        amenities: item.amenities || [],
        distance: '0 km', // Brak danych w SerpApi o odległości od centrum wprost
        latitude: item.location.latitude,
        longitude: item.location.longitude,
        externalUrl: item.link
      }));

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
