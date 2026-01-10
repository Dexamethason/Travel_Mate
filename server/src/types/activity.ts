//typy dla wyszukiwania

export interface ActivitySearchParams {
  location: string;
  query?: string;
  hl?: string; // język
  gl?: string; // kraj
}

export interface AttractionSearchParams extends ActivitySearchParams {
  type?: 'tourist_attraction' | 'museum' | 'landmark' | 'park';
}

export interface RestaurantSearchParams extends ActivitySearchParams {
  type?: 'restaurant' | 'cafe' | 'bar' | 'food';
}

// struktura odpowiedzi
export interface SerpApiPlacesResponse {
  search_metadata?: {
    id: string;
    status: string;
    created_at: string;
    processed_at: string;
  };
  search_parameters?: {
    engine: string;
    q: string;
    google_domain: string;
    hl: string;
    gl: string;
  };
  local_results?: SerpApiPlace[];
  error?: string;
}

export interface SerpApiPlace {
  position?: number;
  place_id: string;
  title?: string;
  data_id?: string;
  data_cid?: string;
  reviews_link?: string;
  photos_link?: string;
  gps_coordinates?: {
    latitude: number;
    longitude: number;
  };
  place_id_search?: string;
  provider_id?: string;
  rating?: number;
  reviews?: number;
  type?: string;
  types?: string[];
  type_id?: string;
  type_ids?: string[];
  address?: string;
  open_state?: string;
  hours?: string;
  operating_hours?: {
    [key: string]: string;
  };
  phone?: string;
  website?: string;
  description?: string;
  service_options?: {
    [key: string]: boolean;
  };
  price?: string;
  thumbnail?: string;
  images?: string[];
}

// struktura cache
export interface CachedActivityData<T> {
  searchParams: ActivitySearchParams | AttractionSearchParams | RestaurantSearchParams;
  results: T[];
  timestamp: number;
  expiresAt: number;
  metadata: {
    source: string;
    totalResults: number;
  };
}

export interface TransformedAttraction {
  id: string;
  name: string;
  rating?: number;
  reviews?: number;
  category?: string;
  type?: string;
  priceRange?: string;
  price?: string;
  distance?: string;
  duration?: string;
  wheelchairAccessible?: boolean;
  openingHours?: string;
  status?: string;
  buttonText?: string;
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  photo?: string;
  photos?: string[];
  amenities?: string[];
  place_id?: string;
  geometry?: {
    latitude: number;
    longitude: number;
  };
}

export interface TransformedRestaurant {
  id: string;
  name: string;
  rating?: number;
  reviews?: number;
  cuisine?: string;
  priceRange?: string;
  distance?: string;
  openingHours?: string;
  isOpen?: boolean;
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  photo?: string;
  photos?: string[];
  reservationRequired?: boolean;
  place_id?: string;
  geometry?: {
    latitude: number;
    longitude: number;
  };
}

