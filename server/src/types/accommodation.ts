export interface AccommodationSearchParams {
  location: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  adults?: number;
  children?: number;
  currency?: string;
  hl?: string;
  gl?: string;
}

export interface Accommodation {
  id: string; 
  name: string;
  description?: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  price?: {
    amount: number;
    currency: string;
    totalAmount?: number;
  };
  rating?: number;
  reviews?: number;
  imageUrl?: string;
  amenities?: string[];
  link?: string;
  hotelClass?: number;
}

export interface SerpApiHotelResult {
  type: string;
  name: string;
  description?: string;
  gps_coordinates?: {
    latitude: number;
    longitude: number;
  };
  rate_per_night?: {
    lowest?: string;
    extracted_lowest?: number;
    before_taxes_fees?: string;
    extracted_before_taxes_fees?: number;
  };
  total_rate?: {
    lowest?: string;
    extracted_lowest?: number;
  };
  prices?: {
    source: string;
    logo: string;
    rate_per_night: {
      lowest: string;
      extracted_lowest: number;
    };
  }[];
  overall_rating?: number;
  reviews?: number;
  images?: {
    thumbnail: string;
    original_image?: string;
  }[];
  amenities?: string[];
  link?: string;
  hotel_class?: string;
  extracted_hotel_class?: number;
  check_in_time?: string;
  check_out_time?: string;
}

export interface SerpApiResponse {
  properties?: SerpApiHotelResult[];
  search_metadata?: {
    id: string;
    status: string;
    json_endpoint: string;
    created_at: string;
    processed_at: string;
    google_hotels_url: string;
    raw_html_file: string;
    total_time_taken: number;
  };
  error?: string;
}

export interface CachedAccommodationData {
  searchParams: AccommodationSearchParams;
  results: Accommodation[];
  timestamp: number; // Date.now()
  expiresAt: number; // timestamp + 24h
  metadata?: {
    source: 'serpapi';
    totalResults: number;
  };
}

