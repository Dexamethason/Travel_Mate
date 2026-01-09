import crypto from 'crypto';
import { adminDb } from '../config/firebase';
import { serpApiEnv } from '../config/env';
import {
  AttractionSearchParams,
  SerpApiPlacesResponse,
  SerpApiPlace,
  CachedActivityData,
  TransformedAttraction
} from '../types/activity';

const CACHE_COLLECTION = 'attractions_cache';
const CACHE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 dni

const generateCacheKey = (params: AttractionSearchParams): string => {
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
  if (!price) return 'Brak informacji';
  
  const dollarCount = (price.match(/\$/g) || []).length;
  
  if (dollarCount === 0 || price.toLowerCase().includes('free')) {
    return 'Darmowe';
  } else if (dollarCount === 1) {
    return '€';
  } else if (dollarCount === 2) {
    return '€€';
  } else if (dollarCount >= 3) {
    return '€€€';
  }
  
  return 'Brak informacji';
};

const mapOpenStatus = (openState?: string, hours?: string): { status: string; openingHours: string } => {
  let status = 'Brak informacji';
  let openingHours = hours || 'Brak informacji';
  
  if (openState) {
    if (openState.toLowerCase().includes('open')) {
      status = 'Otwarte';
    } else if (openState.toLowerCase().includes('closed')) {
      status = 'Zamknięte';
    }
  }
  
  return { status, openingHours };
};

const transformSerpApiToAttraction = (result: SerpApiPlace): TransformedAttraction => {
  const { status, openingHours } = mapOpenStatus(result.open_state, result.hours);
  const priceRange = mapPriceRange(result.price);
  
  let category = 'Atrakcja';
  let type = 'Atrakcja';
  
  if (result.type) {
    category = result.type;
    type = result.type;
  } else if (result.types && result.types.length > 0) {
    const typeMap: { [key: string]: string } = {
      'tourist_attraction': 'Atrakcja turystyczna',
      'museum': 'Muzeum',
      'art_gallery': 'Galeria sztuki',
      'park': 'Park',
      'amusement_park': 'Park rozrywki',
      'landmark': 'Zabytek',
      'church': 'Kościół',
      'synagogue': 'Synagoga',
      'mosque': 'Meczet',
      'hindu_temple': 'Świątynia',
      'zoo': 'Zoo',
      'aquarium': 'Akwarium',
      'stadium': 'Stadion',
      'shopping_mall': 'Centrum handlowe',
      'library': 'Biblioteka'
    };
    
    for (const t of result.types) {
      if (typeMap[t]) {
        category = typeMap[t];
        type = typeMap[t];
        break;
      }
    }
  }
  
  return {
    id: result.place_id || crypto.randomUUID(),
    place_id: result.place_id,
    name: result.title || 'Brak nazwy',
    rating: result.rating,
    reviews: result.reviews || 0,
    category,
    type,
    priceRange,
    price: priceRange,
    openingHours,
    status,
    buttonText: status === 'Otwarte' ? 'Zobacz więcej' : 'Niedostępne',
    description: result.description,
    address: result.address,
    phone: result.phone,
    website: result.website,
    photo: result.thumbnail,
    photos: result.images,
    geometry: result.gps_coordinates ? {
      latitude: result.gps_coordinates.latitude,
      longitude: result.gps_coordinates.longitude
    } : undefined,
    // Dodatkowe pola które mogą być dostępne
    amenities: result.service_options ? Object.keys(result.service_options).filter(key => result.service_options![key]) : undefined
  };
};

export const searchAttractions = async (params: AttractionSearchParams): Promise<TransformedAttraction[]> => {
  try {
    const cacheKey = generateCacheKey(params);
    
    const cacheDocRef = adminDb.collection(CACHE_COLLECTION).doc(cacheKey);
    const cacheDoc = await cacheDocRef.get();

    if (cacheDoc.exists) {
      const cachedData = cacheDoc.data() as CachedActivityData<TransformedAttraction>;
      const now = Date.now();

      if (cachedData.expiresAt > now) {
        console.log(`🎯 Cache HIT for attractions: ${params.location}`);
        return cachedData.results;
      } else {
        console.log(`⌛ Cache EXPIRED for attractions: ${params.location}`);
      }
    } else {
      console.log(`💨 Cache MISS for attractions: ${params.location}`);
    }

    if (!serpApiEnv.apiKey) {
      throw new Error('SerpApi API Key is not configured');
    }

    const url = new URL('https://serpapi.com/search.json');
    url.searchParams.append('engine', 'google_maps');
    url.searchParams.append('type', 'search');
    
    let searchQuery = params.query 
      ? `${params.query} w ${params.location}` 
      : `${params.location} atrakcje turystyczne`;
    
    url.searchParams.append('q', searchQuery);
    url.searchParams.append('hl', params.hl || 'pl');
    url.searchParams.append('gl', params.gl || 'pl');
    url.searchParams.append('api_key', serpApiEnv.apiKey);

    console.log(`🌍 Fetching attractions from SerpApi: ${searchQuery}`);
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`SerpApi responded with status: ${response.status}`);
    }

    const data = (await response.json()) as SerpApiPlacesResponse;

    if (data.error) {
      throw new Error(`SerpApi error: ${data.error}`);
    }

    const results = (data.local_results || []).map(transformSerpApiToAttraction);

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
    
    const cacheData: CachedActivityData<TransformedAttraction> = {
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
      console.error('❌ Failed to save attractions to cache:', err);
    });

    console.log(`✅ Found ${results.length} attractions`);
    return results;

  } catch (error) {
    console.error('Error in searchAttractions:', error);
    throw error;
  }
};

