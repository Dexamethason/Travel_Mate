import crypto from 'crypto';
import { adminDb } from '../config/firebase';
import { serpApiEnv } from '../config/env';
import {
  RestaurantSearchParams,
  SerpApiPlacesResponse,
  SerpApiPlace,
  CachedActivityData,
  TransformedRestaurant
} from '../types/activity';

const CACHE_COLLECTION = 'restaurants_cache';
const CACHE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; //7 dni

const generateCacheKey = (params: RestaurantSearchParams): string => {
  const keyData: any = {
    location: params.location.toLowerCase().trim(),
    hl: params.hl || 'pl',
    gl: params.gl || 'pl'
  };
  
  if (params.query) {
    keyData.query = params.query.toLowerCase().trim();
  }
  if (params.type) {
    keyData.type = params.type;
  }
  
  const dataToHash = JSON.stringify(keyData);
  return crypto.createHash('md5').update(dataToHash).digest('hex');
};

const mapPriceRange = (price?: string): string => {
  if (!price) return '€€';
  
  const dollarCount = (price.match(/\$/g) || []).length;
  
  if (dollarCount === 0 || price.toLowerCase().includes('free')) {
    return '€';
  } else if (dollarCount === 1) {
    return '€';
  } else if (dollarCount === 2) {
    return '€€';
  } else if (dollarCount === 3) {
    return '€€€';
  } else if (dollarCount >= 4) {
    return '€€€€';
  }
  
  return '€€';
};

// przemapowane typy "kuchni"
const mapCuisineType = (types?: string[], type?: string): string => {
  const cuisineMap: { [key: string]: string } = {
    'restaurant': 'Restauracja',
    'cafe': 'Kawiarnia',
    'bar': 'Bar',
    'bakery': 'Piekarnia',
    'meal_takeaway': 'Na wynos',
    'meal_delivery': 'Dostawa',
    'italian': 'Kuchnia włoska',
    'french': 'Kuchnia francuska',
    'japanese': 'Kuchnia japońska',
    'chinese': 'Kuchnia chińska',
    'indian': 'Kuchnia indyjska',
    'mexican': 'Kuchnia meksykańska',
    'thai': 'Kuchnia tajska',
    'vietnamese': 'Kuchnia wietnamska',
    'mediterranean': 'Kuchnia śródziemnomorska',
    'american': 'Kuchnia amerykańska',
    'seafood': 'Owoce morza',
    'steakhouse': 'Steakhouse',
    'pizza': 'Pizzeria',
    'sushi': 'Sushi',
    'fast_food': 'Fast food',
    'asian': 'Kuchnia azjatycka',
    'european': 'Kuchnia europejska'
  };
  
  if (type && cuisineMap[type.toLowerCase()]) {
    return cuisineMap[type.toLowerCase()];
  }
  
  if (types && types.length > 0) {
    for (const t of types) {
      const lowerType = t.toLowerCase();
      if (cuisineMap[lowerType]) {
        return cuisineMap[lowerType];
      }
    }
  }
  
  return 'Restauracja';
};

const mapOpenStatus = (openState?: string, hours?: string): { isOpen: boolean; openingHours: string } => {
  let isOpen = false;
  let openingHours = hours || 'Brak informacji';
  
  if (openState) {
    isOpen = openState.toLowerCase().includes('open');
  }
  
  return { isOpen, openingHours };
};

const transformSerpApiToRestaurant = (result: SerpApiPlace): TransformedRestaurant => {
  const { isOpen, openingHours } = mapOpenStatus(result.open_state, result.hours);
  const priceRange = mapPriceRange(result.price);
  const cuisine = mapCuisineType(result.types, result.type);
  
  // drogie restauracje w większości wymagają rezerwacji, niestety nie ma takich danych w API
  const requiresReservation = priceRange === '€€€€' || priceRange === '€€€';
  
  return {
    id: result.place_id || crypto.randomUUID(),
    place_id: result.place_id,
    name: result.title || 'Brak nazwy',
    rating: result.rating,
    reviews: result.reviews || 0,
    cuisine,
    priceRange,
    openingHours,
    isOpen,
    description: result.description,
    address: result.address,
    phone: result.phone,
    website: result.website,
    photo: result.thumbnail,
    photos: result.images,
    reservationRequired: requiresReservation,
    geometry: result.gps_coordinates ? {
      latitude: result.gps_coordinates.latitude,
      longitude: result.gps_coordinates.longitude
    } : undefined
  };
};

export const searchRestaurants = async (params: RestaurantSearchParams): Promise<TransformedRestaurant[]> => {
  try {
    const cacheKey = generateCacheKey(params);
    
    // 1. sprawdza cache
    const cacheDocRef = adminDb.collection(CACHE_COLLECTION).doc(cacheKey);
    const cacheDoc = await cacheDocRef.get();

    if (cacheDoc.exists) {
      const cachedData = cacheDoc.data() as CachedActivityData<TransformedRestaurant>;
      const now = Date.now();

      if (cachedData.expiresAt > now) {
        console.log(`🎯 Cache HIT for restaurants: ${params.location}`);
        return cachedData.results;
      } else {
        console.log(`⌛ Cache EXPIRED for restaurants: ${params.location}`);
      }
    } else {
      console.log(`💨 Cache MISS for restaurants: ${params.location}`);
    }

    // 2. request do API
    if (!serpApiEnv.apiKey) {
      throw new Error('SerpApi API Key is not configured');
    }

    const url = new URL('https://serpapi.com/search.json');
    url.searchParams.append('engine', 'google_maps');
    url.searchParams.append('type', 'search');
    
    let searchQuery = params.query 
      ? `${params.query} w ${params.location}` 
      : `${params.location} restauracje`;
    
    url.searchParams.append('q', searchQuery);
    url.searchParams.append('hl', params.hl || 'pl');
    url.searchParams.append('gl', params.gl || 'pl');
    url.searchParams.append('api_key', serpApiEnv.apiKey);

    console.log(`🌍 Fetching restaurants from SerpApi: ${searchQuery}`);
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`SerpApi responded with status: ${response.status}`);
    }

    const data = (await response.json()) as SerpApiPlacesResponse;

    if (data.error) {
      throw new Error(`SerpApi error: ${data.error}`);
    }

    // 3. przekształcenie wyników
    const results = (data.local_results || []).map(transformSerpApiToRestaurant);

    // 4. zapis do cache
    const cleanParams: any = {
      location: params.location,
      hl: params.hl || 'pl',
      gl: params.gl || 'pl'
    };
    
    if (params.query) {
      cleanParams.query = params.query;
    }
    if (params.type) {
      cleanParams.type = params.type;
    }
    
    const cleanResults = JSON.parse(JSON.stringify(results));
    
    const cacheData: CachedActivityData<TransformedRestaurant> = {
      searchParams: cleanParams,
      results: cleanResults,
      timestamp: Date.now(),
      expiresAt: Date.now() + CACHE_DURATION_MS,
      metadata: {
        source: 'serpapi',
        totalResults: results.length
      }
    };

    cacheDocRef.set(cacheData).catch(err => {
      console.error('❌ Failed to save restaurants to cache:', err);
    });

    console.log(`✅ Found ${results.length} restaurants`);
    return results;

  } catch (error) {
    console.error('Error in searchRestaurants:', error);
    throw error;
  }
};

