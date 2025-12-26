export interface Attraction {
  id: number;
  photo?: string;
  name: string;
  rating: number;
  reviews: number;
  type?: string;
  category: string;
  priceRange?: string;
  price: string;
  distance: string;
  duration?: string;
  wheelchairAccessible?: boolean;
  openingHours: string;
  status: string;
  buttonText: string;
  // Nowe pola dla szczegółów
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  detailedReviews?: Review[];
  photos?: string[];
  amenities?: string[];
}

export interface Restaurant {
  id: number;
  photo?: string;
  name: string;
  rating: number;
  reviews: number;
  cuisine: string;
  priceRange: string;
  distance: string;
  openingHours: string;
  isOpen: boolean;
  // Nowe pola dla szczegółów
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  detailedReviews?: Review[];
  photos?: string[];
  menu?: string;
  reservationRequired?: boolean;
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
  wheelchairAccessible: boolean;
}

export interface RestaurantFilters {
  cuisine: string;
  priceRange: string;
  minRating: string;
  openNow: boolean;
}

export type SortOption = 'recommended' | 'rating' | 'distance' | 'popular' | 'price';
