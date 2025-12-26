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

  // Mapowanie różnych wariantów na standardowe klucze (angielskie i polskie)
  const amenityMapping: Record<string, string> = {
    // WiFi
    'wifi': 'wifi',
    'wi-fi': 'wifi',
    'wi fi': 'wifi',
    'free wifi': 'wifi',
    'free wi-fi': 'wifi',
    'wireless internet': 'wifi',
    'internet': 'wifi',
    'free wireless': 'wifi',
    'wireless': 'wifi',
    'bezpłatne wi-fi': 'wifi',
    'bezpłatne wifi': 'wifi',
    'darmowe wi-fi': 'wifi',
    'darmowe wifi': 'wifi',
    
    // Parking
    'parking': 'parking',
    'free parking': 'parking',
    'parking ($)': 'parking',
    'parking($)': 'parking',
    'car park': 'parking',
    'parking available': 'parking',
    'valet parking': 'parking',
    'bezpłatny parking': 'parking',
    'darmowy parking': 'parking',
    'parking bezpłatny': 'parking',
    
    // Pool
    'pool': 'pool',
    'swimming pool': 'pool',
    'outdoor pool': 'pool',
    'indoor pool': 'pool',
    'basen kryty': 'pool',
    'basen': 'pool',
    'basen odkryty': 'pool',
    
    // Breakfast
    'breakfast': 'breakfast',
    'free breakfast': 'breakfast',
    'breakfast included': 'breakfast',
    'breakfast ($)': 'breakfast',
    'breakfast($)': 'breakfast',
    'continental breakfast': 'breakfast',
    'buffet breakfast': 'breakfast',
    'śniadanie': 'breakfast',
    'śniadanie wliczone': 'breakfast',
    
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
    'siłownia': 'gym',
    'centrum fitness': 'gym',
    
    // Restaurant
    'restaurant': 'restaurant',
    'dining': 'restaurant',
    'on-site restaurant': 'restaurant',
    'restauracja': 'restaurant',
    
    // Kitchen
    'kitchen': 'kitchen',
    'kitchenette': 'kitchen',
    'full kitchen': 'kitchen',
    'kuchnia': 'kitchen',
    'aneks kuchenny': 'kitchen',
    'kuchenka mikrofalowa': 'kitchen',
    'kuchenka z piekarnikiem': 'kitchen',
    
    // Balcony
    'balcony': 'balcony',
    'terrace': 'balcony',
    'patio': 'balcony',
    'taras': 'balcony',
    'balkon': 'balcony',
    
    // Air Conditioning
    'air conditioning': 'airconditioning',
    'airconditioning': 'airconditioning',
    'ac': 'airconditioning',
    'climate control': 'airconditioning',
    'klimatyzacja': 'airconditioning',
    
    // Pets
    'pets': 'pets',
    'pet friendly': 'pets',
    'pet-friendly': 'pets',
    'pets allowed': 'pets',
    'petsallowed': 'pets',
    'przyjazny zwierzętom': 'pets',
    'zwierzęta dozwolone': 'pets',
    
    // Garden
    'garden': 'garden',
    'outdoor garden': 'garden',
    'ogród': 'garden',
    
    // Lounge
    'lounge': 'lounge',
    'lobby': 'lounge',
    'common area': 'lounge',
    'salon': 'lounge',
    
    // 24h Reception
    '24 hour reception': 'reception24h',
    '24/7 reception': 'reception24h',
    '24-hour front desk': 'reception24h',
    'recepcja 24h': 'reception24h',
    'recepcja 24/7': 'reception24h',
    
    // Airport Transfer
    'airport transfer': 'airporttransfer',
    'airport shuttle': 'airporttransfer',
    'airport pickup': 'airporttransfer',
    'transfer lotniskowy': 'airporttransfer',
    'shuttle lotniskowy': 'airporttransfer',
    
    // Laundry
    'laundry': 'laundry',
    'full-service laundry': 'laundry',
    'full service laundry': 'laundry',
    'laundry service': 'laundry',
    'pralnia': 'laundry',
    'pralka': 'laundry',
    'usługa pralni': 'laundry',
    
    // Accessible
    'accessible': 'accessible',
    'wheelchair accessible': 'accessible',
    'disabled access': 'accessible',
    'dostępne dla osób na wózkach': 'accessible',
    'dla niepełnosprawnych': 'accessible',
    'winda': 'accessible', // Elevator też może być związane z dostępnością
    
    // Kid-friendly
    'kid-friendly': 'kidfriendly',
    'kid friendly': 'kidfriendly',
    'children friendly': 'kidfriendly',
    'family friendly': 'kidfriendly',
    'przyjazny dzieciom': 'kidfriendly',
    'dla rodzin': 'kidfriendly',
    'łóżeczko dziecięce': 'kidfriendly',
    
    // Smoke-free
    'smoke-free property': 'smokefree',
    'smoke free property': 'smokefree',
    'non-smoking': 'smokefree',
    'nonsmoking': 'smokefree',
    'dla niepalących': 'smokefree',
    'zakaz palenia': 'smokefree',
    
    // Bar
    'bar': 'bar',
    'cocktail bar': 'bar',
    'bar/lounge': 'bar',
    
    // Room Service
    'room service': 'roomservice',
    'roomservice': 'roomservice',
    'room-service': 'roomservice',
    'usługa pokojowa': 'roomservice',
    
    // Business Center
    'business center': 'businesscenter',
    'businesscentre': 'businesscenter',
    'business centre': 'businesscenter',
    'centrum biznesowe': 'businesscenter',
    
    // Heating
    'heating': 'heating',
    'central heating': 'heating',
    'ogrzewanie': 'heating',
    
    // Ironing
    'ironing board': 'ironing',
    'iron': 'ironing',
    'deska do prasowania': 'ironing',
    
    // Cable TV
    'cable tv': 'cabletv',
    'cable television': 'cabletv',
    'satellite tv': 'cabletv',
    'telewizja kablowa': 'cabletv',
    'tv': 'cabletv',
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
 * Parsuje liczbę gwiazdek z hotel_class (np. "4-star hotel" -> 4)
 * Obsługuje różne formaty: "4-star hotel", "4", "4 stars", "4.0", liczby itp.
 * Jeśli hotel_class nie jest dostępne, zwraca undefined
 */
const parseStarsFromHotelClass = (hotelClass?: string | number): number | undefined => {
  if (!hotelClass) return undefined;
  
  // Jeśli już jest liczbą
  if (typeof hotelClass === 'number') {
    const stars = Math.round(hotelClass);
    return stars >= 1 && stars <= 5 ? stars : undefined;
  }
  
  // Jeśli jest stringiem, wyciągnij liczbę
  // hotel_class może być w formacie "4-star hotel", "4", "4 stars", "4.0" itp.
  const match = String(hotelClass).match(/(\d+)/);
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
        // Parsowanie gwiazdek z hotelClass
        let stars: number | undefined = undefined;
        if (item.hotelClass) {
          stars = parseStarsFromHotelClass(item.hotelClass);
        }
        
        // Sprawdź rating - upewnij się że jest liczbą
        const rating = item.rating || item.overall_rating || 0;
        
        return {
          id: item.id,
          name: item.name,
          type: 'hotel', // Wszystko jest hotelem
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
