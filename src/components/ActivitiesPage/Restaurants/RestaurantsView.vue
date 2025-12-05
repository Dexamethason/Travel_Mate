<template>
  <RestaurantsList :restaurants="sortedRestaurants" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import RestaurantsList from './RestaurantsList.vue';
import type { Restaurant } from '@/types/activitie';

// Przykładowe dane restauracji
const restaurants = ref<Restaurant[]>([
  {
    id: 1,
    name: 'Le Jules Verne',
    rating: 4.7,
    reviews: 14394,
    cuisine: 'Kuchnia francuska',
    priceRange: '€€€',
    distance: 'min od wieży Eiffla',
    openingHours: 'Czynne do 22:00',
    isOpen: true,
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
  },
  {
    id: 6,
    name: 'Pink Mamma',
    rating: 4.5,
    reviews: 9123,
    cuisine: 'Kuchnia włoska',
    priceRange: '€€',
    distance: '18 min spacerem',
    openingHours: 'Czynne do 23:00',
    isOpen: true,
  },
  {
    id: 7,
    name: 'Breizh Café',
    rating: 4.6,
    reviews: 4567,
    cuisine: 'Crêperie',
    priceRange: '€',
    distance: '14 min spacerem',
    openingHours: 'Czynne do 22:00',
    isOpen: true,
  },
  {
    id: 8,
    name: "L'Avant Comptoir",
    rating: 4.3,
    reviews: 3421,
    cuisine: 'Tapas francuskie',
    priceRange: '€€',
    distance: '9 min spacerem',
    openingHours: 'Czynne do 23:00',
    isOpen: true,
  },
  {
    id: 9,
    name: 'Bouillon Chartier',
    rating: 4.2,
    reviews: 12456,
    cuisine: 'Tradycyjna francuska',
    priceRange: '€',
    distance: '20 min metrem',
    openingHours: 'Czynne do 22:00',
    isOpen: true,
  },
  {
    id: 10,
    name: 'Le Chateaubriand',
    rating: 4.7,
    reviews: 2891,
    cuisine: 'Kuchnia fusion',
    priceRange: '€€€',
    distance: '25 min taksówką',
    openingHours: 'Otwarte od 19:30',
    isOpen: false,
  },
]);

const sortedRestaurants = computed(() => restaurants.value);
</script>
