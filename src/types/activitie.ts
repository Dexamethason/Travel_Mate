export interface Attraction {
  id: number | string;
  photo?: string;
  name: string;
  rating?: number;
  reviews?: number;
  type?: string;
  category?: string;
  priceRange?: string;
  price?: string;
  distance?: string;
  duration?: string;
  wheelchairAccessible?: boolean;
  openingHours?: string;
  status?: string;
  buttonText?: string;
  //modal szczegółów
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  detailedReviews?: Review[];
  photos?: string[];
  amenities?: string[];
  place_id?: string;
  user_ratings_total?: number;
  vicinity?: string;
  opening_hours_text?: string[];
  price_level?: number;
  types?: string[];
  geometry?: {
    latitude: number;
    longitude: number;
  };
}

export interface Restaurant {
  id: number | string;
  photo?: string;
  name: string;
  rating?: number;
  reviews?: number;
  cuisine?: string;
  priceRange?: string;
  distance?: string;
  openingHours?: string;
  isOpen?: boolean;
  //modal szczegółów
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  detailedReviews?: Review[];
  photos?: string[];
  menu?: string;
  reservationRequired?: boolean;
  place_id?: string;
  user_ratings_total?: number;
  vicinity?: string;
  opening_hours_text?: string[];
  price_level?: number;
  types?: string[];
  geometry?: {
    latitude: number;
    longitude: number;
  };
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
  helpful?: number;
}

export interface AttractionFilters {
  type: string;
  priceRange: string;
  minRating: string;
  openNow: boolean;
}

export interface RestaurantFilters {
  cuisine: string;
  priceRange: string;
  minRating: string;
  openNow: boolean;
}

export type SortOption = 'recommended' | 'rating' | 'distance' | 'popular' | 'price';
