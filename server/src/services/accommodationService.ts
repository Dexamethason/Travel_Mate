import crypto from 'crypto';
import { adminDb } from '../config/firebase';
import { serpApiEnv } from '../config/env';
import { 
  AccommodationSearchParams, 
  Accommodation, 
  CachedAccommodationData, 
  SerpApiResponse, 
  SerpApiHotelResult 
} from '../types/accommodation';

const CACHE_COLLECTION = 'accommodation_cache';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// Generuje unikalny klucz na podstawie parametrów wyszukiwania
const generateCacheKey = (params: AccommodationSearchParams): string => {
  const dataToHash = JSON.stringify({
    location: params.location.toLowerCase().trim(),
    checkIn: params.checkInDate,
    checkOut: params.checkOutDate,
    adults: params.adults || 1,
    children: params.children || 0,
    currency: params.currency || 'USD'
  });
  
  return crypto.createHash('md5').update(dataToHash).digest('hex');
};

const transformSerpApiData = (result: SerpApiHotelResult): Accommodation => {
  let priceAmount = 0;
  const currency = 'USD';

  if (result.rate_per_night?.extracted_lowest) {
    priceAmount = result.rate_per_night.extracted_lowest;
  } else if (result.total_rate?.extracted_lowest) {
    priceAmount = result.total_rate.extracted_lowest;
  }
  
  // Parsowanie współrzędnych
  const location = {
    latitude: result.gps_coordinates?.latitude || 0,
    longitude: result.gps_coordinates?.longitude || 0,
    address: result.name
  };

  return {
    id: result.name || crypto.randomUUID(),
    name: result.name,
    description: result.description,
    location,
    price: {
      amount: priceAmount,
      currency: currency,
    },
    rating: result.overall_rating,
    reviews: result.reviews,
    imageUrl: result.images?.[0]?.original_image || result.images?.[0]?.thumbnail || 'https://img.freepik.com/premium-vector/file-folder-mascot-character-design-vector_166742-4413.jpg?semt=ais_hybrid&w=740&q=80',
    amenities: result.amenities,
    link: result.link
  };
};

export const searchAccommodations = async (params: AccommodationSearchParams): Promise<Accommodation[]> => {
  try {
    const cacheKey = generateCacheKey(params);
    
    // 1. Sprawdza cache w Firestore
    // Używamy adminDb bo jesteśmy po stronie serwera
    const cacheDocRef = adminDb.collection(CACHE_COLLECTION).doc(cacheKey);
    const cacheDoc = await cacheDocRef.get();

    if (cacheDoc.exists) {
      const cachedData = cacheDoc.data() as CachedAccommodationData;
      const now = Date.now();

      if (cachedData.expiresAt > now) {
        console.log(`🎯 Cache HIT for location: ${params.location}`);
        return cachedData.results;
      } else {
        console.log(`⌛ Cache EXPIRED for location: ${params.location}`);
      }
    } else {
      console.log(`💨 Cache MISS for location: ${params.location}`);
    }

    // 2. Pobiera dane z SerpApi
    if (!serpApiEnv.apiKey) {
      throw new Error('SerpApi API Key is not configured');
    }

    const url = new URL('https://serpapi.com/search.json');
    url.searchParams.append('engine', 'google_hotels');
    url.searchParams.append('q', params.location);
    url.searchParams.append('check_in_date', params.checkInDate);
    url.searchParams.append('check_out_date', params.checkOutDate);
    url.searchParams.append('adults', (params.adults || 1).toString());
    if (params.children) {
      url.searchParams.append('children', params.children.toString());
    }
    url.searchParams.append('currency', params.currency || 'USD');
    url.searchParams.append('api_key', serpApiEnv.apiKey);
    
    // TODO: Opcjonalnie: sortowanie, paginacja itp.
    // url.searchParams.append('sort_by', 'lowest_price');

    console.log(`🌍 Fetching from SerpApi: ${params.location}`);
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`SerpApi responded with status: ${response.status}`);
    }

    const data = (await response.json()) as SerpApiResponse;

    if (data.error) {
      throw new Error(`SerpApi error: ${data.error}`);
    }

    // 3. Przetwórz wyniki
    const results = (data.properties || []).map(transformSerpApiData);

    // 4. Zapisz do cache
    // Firestore nie akceptuje undefined w polach, więc czyścimy obiekt przed zapisem
    const cleanResults = JSON.parse(JSON.stringify(results));
    
    const cacheData: CachedAccommodationData = {
      searchParams: params,
      results: cleanResults,
      timestamp: Date.now(),
      expiresAt: Date.now() + CACHE_DURATION_MS,
      metadata: {
        source: 'serpapi',
        totalResults: results.length
      }
    };

    cacheDocRef.set(cacheData).catch(err => {
      console.error('❌ Failed to save to cache:', err);
    });

    return results;

  } catch (error) {
    console.error('Error in searchAccommodations:', error);
    throw error;
  }
};

