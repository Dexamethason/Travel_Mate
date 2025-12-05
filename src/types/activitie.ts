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
