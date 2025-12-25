<template>
  <RestaurantsList 
    :restaurants="sortedRestaurants" 
    :filters="filters"
    :sort-by="sortBy"
    :active-filters-count="activeFiltersCount"
    @update:filters="updateFilters"
    @update:sort-by="updateSortBy"
    @reset-filters="resetFilters"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RestaurantsList from './RestaurantsList.vue';
import { useRestaurantFilters } from '@/composables/useRestaurantFilters';
import type { Restaurant } from '@/types/activitie';

// Przykładowe dane restauracji z rozszerzonymi informacjami
const restaurants = ref<Restaurant[]>([
  {
    id: 1,
    name: 'Le Jules Verne',
    rating: 4.7,
    reviews: 14394,
    cuisine: 'Kuchnia francuska',
    priceRange: '€€€',
    distance: '1 min od wieży Eiffla',
    openingHours: 'Czynne do 22:00',
    isOpen: true,
    description: 'Ekskluzywna restauracja na drugim piętrze Wieży Eiffla z niesamowitym widokiem na Paryż. Kuchnia francuska haute cuisine w wykonaniu szefa kuchni Frédérica Antona.',
    address: 'Wieża Eiffla, Avenue Gustave Eiffel, 75007 Paryż',
    phone: '+33 1 45 55 61 44',
    website: 'https://www.lejulesverne-paris.com',
    reservationRequired: true,
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'],
    detailedReviews: [
      {
        id: 1,
        author: 'Anna Kowalska',
        rating: 5.0,
        date: '2024-01-15',
        comment: 'Niezapomniane doświadczenie! Jedzenie było wyśmienite, a widok z okna zapierał dech w piersiach.',
        helpful: 24,
      },
      {
        id: 2,
        author: 'Jean Dupont',
        rating: 4.5,
        date: '2024-01-10',
        comment: 'Doskonała kuchnia i wyjątkowa atmosfera. Menu degustacyjne było perfekcyjnie skomponowane.',
        helpful: 18,
      },
    ],
  },
  {
    id: 2,
    name: 'Café de Flore',
    rating: 4.5,
    reviews: 8234,
    cuisine: 'Kawiarnia',
    priceRange: '€€',
    distance: '12 min spacerem',
    openingHours: 'Czynne do 23:00',
    isOpen: true,
    description: 'Legendarna paryska kawiarnia z 1887 roku, ulubione miejsce spotkań artystów i intelektualistów.',
    address: '172 Boulevard Saint-Germain, 75006 Paryż',
    phone: '+33 1 45 48 55 26',
    website: 'https://www.cafedeflore.fr',
    photos: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800'],
    detailedReviews: [
      {
        id: 1,
        author: 'Pierre Dubois',
        rating: 4.5,
        date: '2024-01-18',
        comment: 'Kultowe miejsce z prawdziwą paryską atmosferą. Croissanty są przepyszne.',
        helpful: 19,
      },
    ],
  },
  {
    id: 3,
    name: "L'Atelier de Joël Robuchon",
    rating: 4.6,
    reviews: 5621,
    cuisine: 'Haute cuisine',
    priceRange: '€€€€',
    distance: '8 min spacerem',
    openingHours: 'Czynne do 23:30',
    isOpen: true,
    description: 'Restauracja słynnego szefa kuchni Joëla Robuchona oferująca wyjątkowe menu degustacyjne.',
    address: '5 Rue de Montalembert, 75007 Paryż',
    phone: '+33 1 42 22 56 56',
    website: 'https://www.robuchon.fr',
    reservationRequired: true,
    detailedReviews: [
      {
        id: 1,
        author: 'Isabella Romano',
        rating: 5.0,
        date: '2024-01-14',
        comment: 'Kulinarne arcydzieło! Każde danie było perfekcyjne.',
        helpful: 28,
      },
    ],
  },
  {
    id: 4,
    name: 'Septime',
    rating: 4.8,
    reviews: 3892,
    cuisine: 'Współczesna francuska',
    priceRange: '€€€',
    distance: '15 min taksówką',
    openingHours: 'Otwarte od 19:00',
    isOpen: false,
    description: 'Modna restauracja w 11. dzielnicy, oferująca sezonowe menu z lokalnych składników.',
    address: '80 Rue de Charonne, 75011 Paryż',
    phone: '+33 1 43 67 38 29',
    reservationRequired: true,
    detailedReviews: [
      {
        id: 1,
        author: 'Claire Lefevre',
        rating: 5.0,
        date: '2024-01-16',
        comment: 'Absolutnie najlepsza restauracja w Paryżu! Innowacyjne dania.',
        helpful: 35,
      },
    ],
  },
  {
    id: 5,
    name: 'Le Comptoir du Relais',
    rating: 4.4,
    reviews: 6745,
    cuisine: 'Bistro',
    priceRange: '€€',
    distance: '10 min spacerem',
    openingHours: 'Czynne do 22:30',
    isOpen: true,
    description: 'Przytulne bistro prowadzone przez szefa Yves Camdeborde. Klasyczne francuskie dania.',
    address: '9 Carrefour de l\'Odéon, 75006 Paryż',
    phone: '+33 1 44 27 07 97',
    detailedReviews: [
      {
        id: 1,
        author: 'Marc Rousseau',
        rating: 4.5,
        date: '2024-01-13',
        comment: 'Autentyczne francuskie bistro. Confit de canard był przepyszny!',
        helpful: 21,
      },
    ],
  },
]);

const { 
  filters, 
  sortBy, 
  sortedRestaurants, 
  resetFilters, 
  activeFiltersCount 
} = useRestaurantFilters(restaurants);

const updateFilters = (newFilters: any) => {
  filters.value = { ...filters.value, ...newFilters };
};

const updateSortBy = (newSort: any) => {
  sortBy.value = newSort;
};
</script>
