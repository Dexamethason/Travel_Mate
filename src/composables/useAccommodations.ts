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

/**
 * Normalizuje amenities z API do formatu używanego w filtrach
 * Mapuje różne warianty nazw na standardowe klucze
 */
const normalizeAmenities = (amenities: string[]): string[] => {
  if (!amenities || !Array.isArray(amenities)) {
    return [];
  }

  const normalized: string[] = [];
  const normalizedSet = new Set<string>();

  // Mapowanie różnych wariantów na standardowe klucze
  const amenityMapping: Record<string, string> = {
    // WiFi
    'wifi': 'wifi',
    'wi-fi': 'wifi',
    'wi fi': 'wifi',
    'free wifi': 'wifi',
    'wireless internet': 'wifi',
    'internet': 'wifi',
    'free wireless': 'wifi',
    'wireless': 'wifi',
    
    // Parking
    'parking': 'parking',
    'free parking': 'parking',
    'car park': 'parking',
    'parking available': 'parking',
    'valet parking': 'parking',
    
    // Pool
    'pool': 'pool',
    'swimming pool': 'pool',
    'outdoor pool': 'pool',
    'indoor pool': 'pool',
    
    // Breakfast
    'breakfast': 'breakfast',
    'free breakfast': 'breakfast',
    'breakfast included': 'breakfast',
    'continental breakfast': 'breakfast',
    'buffet breakfast': 'breakfast',
    
    // SPA
    'spa': 'spa',
    'spa services': 'spa',
    'spa center': 'spa',
    'wellness center': 'spa',
    
    // Gym/Fitness
    'gym': 'gym',
    'fitness center': 'gym',
    'fitness': 'gym',
    'fitness room': 'gym',
    'workout room': 'gym',
    
    // Restaurant
    'restaurant': 'restaurant',
    'dining': 'restaurant',
    'on-site restaurant': 'restaurant',
    
    // Kitchen
    'kitchen': 'kitchen',
    'kitchenette': 'kitchen',
    'full kitchen': 'kitchen',
    
    // Balcony
    'balcony': 'balcony',
    'terrace': 'balcony',
    'patio': 'balcony',
    
    // Air Conditioning
    'air conditioning': 'airconditioning',
    'ac': 'airconditioning',
    'climate control': 'airconditioning',
    
    // Pets
    'pets': 'pets',
    'pet friendly': 'pets',
    'pets allowed': 'pets',
    
    // Garden
    'garden': 'garden',
    'outdoor garden': 'garden',
    
    // Lounge
    'lounge': 'lounge',
    'lobby': 'lounge',
    'common area': 'lounge',
    
    // 24h Reception
    '24 hour reception': 'reception24h',
    '24/7 reception': 'reception24h',
    '24-hour front desk': 'reception24h',
    
    // Airport Transfer
    'airport transfer': 'airporttransfer',
    'airport shuttle': 'airporttransfer',
    'airport pickup': 'airporttransfer',
  };

  amenities.forEach(amenity => {
    if (!amenity) return;
    
    const normalizedAmenity = amenity.toLowerCase().trim();
    
    // Sprawdź bezpośrednie dopasowanie
    if (amenityMapping[normalizedAmenity]) {
      const mapped = amenityMapping[normalizedAmenity];
      if (!normalizedSet.has(mapped)) {
        normalized.push(mapped);
        normalizedSet.add(mapped);
      }
      return;
    }
    
    // Sprawdź częściowe dopasowanie - czy amenity zawiera któryś z kluczy
    for (const [key, value] of Object.entries(amenityMapping)) {
      if (normalizedAmenity.includes(key) || key.includes(normalizedAmenity)) {
        if (!normalizedSet.has(value)) {
          normalized.push(value);
          normalizedSet.add(value);
        }
        return;
      }
    }
  });

  return normalized;
};

/**
 * Normalizuje typ noclegu z wartości zwracanej przez API na standardowe klucze
 */
const normalizeAccommodationTypeFromApi = (apiType: string): string => {
  const type = apiType.toLowerCase().trim();
  
  // Mapowanie typów z API na nasze klucze
  if (type.includes('apartment') || type.includes('apartament')) {
    return 'apartment';
  }
  if (type.includes('hostel')) {
    return 'hostel';
  }
  if (type.includes('villa') || type.includes('willa')) {
    return 'villa';
  }
  if (type.includes('bed') && type.includes('breakfast') || type.includes('b&b') || type.includes('bnb')) {
    return 'bnb';
  }
  // Domyślnie hotel
  return 'hotel';
};

/**
 * Normalizuje typ noclegu z nazwy/opisu na standardowe klucze (fallback gdy API nie zwraca type)
 */
const normalizeAccommodationType = (name: string, description?: string): string => {
  const text = `${name} ${description || ''}`.toLowerCase();
  
  if (text.includes('apartment') || text.includes('apartament') || text.includes('mieszkanie')) {
    return 'apartment';
  }
  if (text.includes('hostel')) {
    return 'hostel';
  }
  if (text.includes('villa') || text.includes('willa')) {
    return 'villa';
  }
  if (text.includes('bed') && text.includes('breakfast') || text.includes('b&b') || text.includes('bnb')) {
    return 'bnb';
  }
  // Domyślnie hotel
  return 'hotel';
};

/**
 * Parsuje liczbę gwiazdek z hotel_class (np. "4-star hotel" -> 4)
 * Jeśli hotel_class nie jest dostępne, zwraca undefined
 */
const parseStarsFromHotelClass = (hotelClass?: string): number | undefined => {
  if (!hotelClass) return undefined;
  
  // hotel_class może być w formacie "4-star hotel" lub "4" lub "4 stars"
  const match = hotelClass.match(/(\d+)/);
  if (match && match[1]) {
    const stars = parseInt(match[1], 10);
    return stars >= 1 && stars <= 5 ? stars : undefined;
  }
  
  return undefined;
};

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
        hl: 'pl',
        gl: 'pl',
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
      accommodations.value = results.map((item: any) => {
        // Normalizacja typu noclegu - najpierw sprawdź czy backend zwraca type, jeśli nie - analizuj nazwę/opis
        let normalizedType: string;
        if (item.type) {
          // Backend zwraca type z API - znormalizuj do naszego formatu
          normalizedType = normalizeAccommodationTypeFromApi(item.type);
        } else {
          // Fallback - analizuj nazwę i opis
          normalizedType = normalizeAccommodationType(item.name || '', item.description);
        }
        
        // Parsowanie gwiazdek - jeśli backend nie zwraca hotel_class, próbujemy z innych źródeł
        // Możemy też sprawdzić czy w nazwie/opisie jest informacja o gwiazdkach
        let stars: number | undefined = undefined;
        if (item.hotel_class) {
          stars = parseStarsFromHotelClass(item.hotel_class);
        }
        
        // Sprawdź rating - upewnij się że jest liczbą
        const rating = item.rating || item.overall_rating || 0;
        
        return {
          id: item.id,
          name: item.name,
          type: normalizedType,
          location: item.location.address || item.name,
          address: item.location.address,
          price: item.price.amount,
          rating: typeof rating === 'number' ? rating : 0,
          reviews: item.reviews || 0,
          image: item.imageUrl || '', // Pusty string jeśli brak - fallback w komponencie
          description: item.description,
          amenities: normalizeAmenities(item.amenities || []), // Normalizacja amenities do formatu filtrów
          distance: '0 km', // Brak danych w SerpApi o odległości od centrum wprost
          latitude: item.location.latitude,
          longitude: item.location.longitude,
          externalUrl: item.link,
          stars: stars
        };
      });

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
