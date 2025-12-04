<template>
  <div class="container mx-auto px-4">
    <!-- Wycentrowany formularz przed wyszukaniem -->
    <div
      v-if="!searchPerformed"
      class="flex min-h-[calc(100vh-200px)] items-center justify-center"
    >
      <div class="w-full max-w-6xl">
        <AccommodationsSearchForm
          v-model="searchForm"
          :loading="loading"
          :show-header="true"
          @search="handleSearch"
              />
            </div>
        </div>

    <!-- Widok po wyszukaniu -->
    <div v-else class="py-8">
      <AccommodationsSearchForm
        v-model="searchForm"
        :loading="loading"
        :show-header="false"
        @search="handleSearch"
      />

      <!-- Komunikat błędu -->
      <div v-if="error" class="my-4 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
        <div class="flex items-center justify-between">
          <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
          <button
            class="text-red-400 hover:text-red-600 dark:hover:text-red-300"
            @click="clearError"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Loader -->
      <div v-if="loading" class="py-16 text-center">
        <div
          class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
        ></div>
        <p class="text-gray-600 dark:text-gray-400">Wyszukiwanie noclegów...</p>
            </div>

      <!-- Wyniki -->
      <div v-else class="mt-8 flex gap-8">
        <!-- Filtry -->
        <AccommodationsFilters v-model="filters" @reset="resetFilters" />

        <!-- Lista wyników -->
        <div class="flex-1">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              Wyniki ({{ filteredAccommodations.length }})
            </h2>
            <select
              v-model="sortBy"
              class="cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="price-asc">Cena: od najniższej</option>
              <option value="price-desc">Cena: od najwyższej</option>
              <option value="rating-desc">Ocena: od najwyższej</option>
              <option value="rating-asc">Ocena: od najniższej</option>
              <option value="popularity-desc">Popularność: najpopularniejsze</option>
              <option value="popularity-asc">Popularność: najmniej popularne</option>
              <option value="distance-asc">Odległość: najbliżej centrum</option>
              <option value="distance-desc">Odległość: najdalej od centrum</option>
            </select>
          </div>

          <div
            v-if="!accommodations.length"
            class="py-16 text-center text-gray-500 dark:text-gray-400"
          >
            <p class="mb-2 text-lg font-medium">Brak wyników dla wybranych kryteriów</p>
            <p class="text-sm">Spróbuj zmienić daty, miejsce lub filtry.</p>
          </div>

          <div v-else class="grid gap-6">
            <AccommodationCard
              v-for="accommodation in sortedAccommodations"
              :key="accommodation.id"
              :accommodation="accommodation"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import AccommodationsSearchForm from '@/components/AccommodationsPage/AccommodationsSearchForm.vue';
import AccommodationsFilters from '@/components/AccommodationsPage/AccommodationsFilters.vue';
import AccommodationCard from '@/components/AccommodationsPage/AccommodationCard.vue';
import {
  useAccommodations,
  type Accommodation,
  type AccommodationFilters,
} from '@/composables/useAccommodations';

const {
  accommodations,
  loading,
  error,
  clearError,
} = useAccommodations();

const searchPerformed = ref(false);

const searchForm = ref({
  destination: '',
  checkIn: '',
  checkOut: '',
  adults: 2,
  children: 0,
});

const defaultFilters: AccommodationFilters = {
  priceMin: 0,
  priceMax: 2000,
  type: '',
  minRating: 0,
  amenities: [] as string[],
  stars: 0,
  maxDistance: 0,
  freeCancellation: false,
  breakfastIncluded: false,
  petFriendly: false,
  airConditioning: false,
  balcony: false,
  fitnessCenter: false,
  spa: false,
  restaurant: false,
  reception24h: false,
  airportTransfer: false,
};

const filters = ref<AccommodationFilters>({ ...defaultFilters });

const resetFilters = () => {
  filters.value = { ...defaultFilters };
};

const sortBy = ref('price-asc');

const filteredAccommodations = computed<Accommodation[]>(() => {
  return accommodations.value.filter((accommodation: Accommodation) => {
    const priceInRange =
      (!filters.value.priceMin || accommodation.price >= filters.value.priceMin) &&
      (!filters.value.priceMax || accommodation.price <= filters.value.priceMax);

    const typeMatch = !filters.value.type || accommodation.type === filters.value.type;

    const ratingMatch = accommodation.rating >= filters.value.minRating;

    const amenitiesMatch =
      filters.value.amenities.length === 0 ||
      filters.value.amenities.every((amenity: string) =>
        accommodation.amenities.includes(amenity)
      );

    const starsMatch =
      !filters.value.stars ||
      (accommodation.stars !== undefined && accommodation.stars >= filters.value.stars);

    const distanceMatch =
      !filters.value.maxDistance ||
      (accommodation.distanceValue !== undefined &&
        accommodation.distanceValue <= filters.value.maxDistance);

    const freeCancellationMatch =
      !filters.value.freeCancellation || accommodation.freeCancellation === true;

    const breakfastMatch =
      !filters.value.breakfastIncluded || accommodation.breakfastIncluded === true;

    const petFriendlyMatch = !filters.value.petFriendly || accommodation.petFriendly === true;

    const airConditioningMatch =
      !filters.value.airConditioning || accommodation.airConditioning === true;

    const balconyMatch = !filters.value.balcony || accommodation.balcony === true;

    const fitnessMatch = !filters.value.fitnessCenter || accommodation.fitnessCenter === true;

    const spaMatch = !filters.value.spa || accommodation.spa === true;

    const restaurantMatch = !filters.value.restaurant || accommodation.restaurant === true;

    const reception24hMatch = !filters.value.reception24h || accommodation.reception24h === true;

    const airportTransferMatch =
      !filters.value.airportTransfer || accommodation.airportTransfer === true;

    return (
      priceInRange &&
      typeMatch &&
      ratingMatch &&
      amenitiesMatch &&
      starsMatch &&
      distanceMatch &&
      freeCancellationMatch &&
      breakfastMatch &&
      petFriendlyMatch &&
      airConditioningMatch &&
      balconyMatch &&
      fitnessMatch &&
      spaMatch &&
      restaurantMatch &&
      reception24hMatch &&
      airportTransferMatch
    );
  });
});

const sortedAccommodations = computed<Accommodation[]>(() => {
  const sorted = [...filteredAccommodations.value];

      const getDistanceValue = (acc: Accommodation) => {
        if (acc.distanceValue !== undefined) return acc.distanceValue;
        if (!acc.distance) return Infinity;
        const match = acc.distance.match(/([\d.]+)/);
        return match && match[1] ? parseFloat(match[1]) : Infinity;
      };

  switch (sortBy.value) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating-desc':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'rating-asc':
      return sorted.sort((a, b) => a.rating - b.rating);
    case 'popularity-desc':
      return sorted.sort((a, b) => b.reviews - a.reviews);
    case 'popularity-asc':
      return sorted.sort((a, b) => a.reviews - b.reviews);
    case 'distance-asc':
      return sorted.sort((a, b) => getDistanceValue(a) - getDistanceValue(b));
    case 'distance-desc':
      return sorted.sort((a, b) => getDistanceValue(b) - getDistanceValue(a));
    default:
      return sorted;
  }
});

const handleSearch = async () => {
  searchPerformed.value = true;

  // TODO: Po podłączeniu backendu odkomentuj wywołanie API poniżej
  // await searchAccommodationsAPI({
  //   destination: searchForm.value.destination,
  //   checkIn: searchForm.value.checkIn,
  //   checkOut: searchForm.value.checkOut,
  //   adults: searchForm.value.adults,
  //   children: searchForm.value.children > 0 ? searchForm.value.children : undefined,
  //   priceMin: filters.value.priceMin || undefined,
  //   priceMax: filters.value.priceMax || undefined,
  //   type: filters.value.type || undefined,
  //   minRating: filters.value.minRating || undefined,
  //   amenities: filters.value.amenities.length > 0 ? filters.value.amenities : undefined,
  //   stars: filters.value.stars || undefined,
  //   maxDistance: filters.value.maxDistance || undefined,
  //   freeCancellation: filters.value.freeCancellation || undefined,
  //   breakfastIncluded: filters.value.breakfastIncluded || undefined,
  //   petFriendly: filters.value.petFriendly || undefined,
  //   airConditioning: filters.value.airConditioning || undefined,
  //   balcony: filters.value.balcony || undefined,
  //   fitnessCenter: filters.value.fitnessCenter || undefined,
  //   spa: filters.value.spa || undefined,
  //   restaurant: filters.value.restaurant || undefined,
  //   reception24h: filters.value.reception24h || undefined,
  //   airportTransfer: filters.value.airportTransfer || undefined,
  // });

  // Mockowane dane – do podmiany na wynik z API w przyszłości
  loading.value = true;

  const mock: Accommodation[] = [
    {
      id: '1',
      name: 'Hotel Luxe Paris',
      type: 'hotel',
      location: 'Centrum Paryża, 1. dzielnica',
      address: '15 Rue de Rivoli, 75001 Paris, Francja',
      price: 450,
      rating: 9.2,
      reviews: 1247,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      description:
        'Elegancki hotel butikowy w sercu Paryża, w pobliżu Luwru i Ogrodu Tuileries. Oferuje luksusowe pokoje z widokiem na miasto.',
      amenities: ['wifi', 'parking', 'breakfast', 'spa', 'gym', 'restaurant', 'airConditioning'],
      distance: '0.2 km',
      distanceValue: 0.2,
      externalUrl: 'https://www.booking.com',
      stars: 5,
      freeCancellation: true,
      breakfastIncluded: true,
      airConditioning: true,
      fitnessCenter: true,
      spa: true,
      restaurant: true,
      reception24h: true,
    },
    {
      id: '2',
      name: 'Cozy Montmartre Apartment',
      type: 'apartment',
      location: 'Montmartre, 18. dzielnica',
      address: '42 Rue Lepic, 75018 Paris, Francja',
      price: 180,
      rating: 8.7,
      reviews: 432,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      description:
        'Przytulny apartament w artystycznej dzielnicy Montmartre. Idealny dla par szukających autentycznego paryskiego doświadczenia.',
      amenities: ['wifi', 'kitchen', 'balcony', 'airConditioning'],
      distance: '2.1 km',
      distanceValue: 2.1,
      externalUrl: 'https://www.booking.com',
      stars: 0,
      freeCancellation: true,
      breakfastIncluded: false,
      airConditioning: true,
      balcony: true,
    },
    {
      id: '3',
      name: 'Budget Hostel Central',
      type: 'hostel',
      location: 'Łacińska Dzielnica, 5. dzielnica',
      address: '8 Rue Mouffetard, 75005 Paris, Francja',
      price: 45,
      rating: 7.8,
      reviews: 892,
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
      description:
        'Nowoczesny hostel w centrum Paryża. Doskonały wybór dla podróżników z ograniczonym budżetem.',
      amenities: ['wifi', 'breakfast', 'lounge', 'kitchen'],
      distance: '1.5 km',
      distanceValue: 1.5,
      externalUrl: 'https://www.booking.com',
      stars: 2,
      freeCancellation: false,
      breakfastIncluded: true,
    },
    {
      id: '4',
      name: 'Charming B&B Seine View',
      type: 'bnb',
      location: 'Île Saint-Louis, 4. dzielnica',
      address: "12 Quai d'Orléans, 75004 Paris, Francja",
      price: 280,
      rating: 9.5,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      description:
        'Urokliwy pensjonat z widokiem na Sekwanę. Rodzinna atmosfera i domowe śniadania.',
      amenities: ['wifi', 'breakfast', 'garden', 'pets'],
      distance: '0.8 km',
      distanceValue: 0.8,
      externalUrl: 'https://www.booking.com',
      stars: 4,
      freeCancellation: true,
      breakfastIncluded: true,
      petFriendly: true,
    },
    {
      id: '5',
      name: 'Modern Villa Suburbs',
      type: 'villa',
      location: 'Neuilly-sur-Seine',
      address: '45 Avenue de Madrid, 92200 Neuilly-sur-Seine, Francja',
      price: 650,
      rating: 8.9,
      reviews: 78,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      description: 'Luksusowa willa na przedmieściach Paryża. Idealna dla większych grup i rodzin.',
      amenities: [
        'wifi',
        'parking',
        'pool',
        'garden',
        'kitchen',
        'airConditioning',
        'fitnessCenter',
      ],
      distance: '8.5 km',
      distanceValue: 8.5,
      externalUrl: 'https://www.booking.com',
      stars: 5,
      freeCancellation: true,
      breakfastIncluded: false,
      airConditioning: true,
      fitnessCenter: true,
    },
    {
      id: '6',
      name: 'Boutique Hotel Marais',
      type: 'hotel',
      location: 'Le Marais, 3. dzielnica',
      address: '28 Rue des Rosiers, 75003 Paris, Francja',
      price: 320,
      rating: 8.5,
      reviews: 567,
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      description:
        'Stylowy hotel butikowy w modnej dzielnicy Le Marais. Blisko najlepszych restauracji i sklepów.',
      amenities: ['wifi', 'breakfast', 'spa', 'restaurant', 'airConditioning', 'reception24h'],
      distance: '1.2 km',
      distanceValue: 1.2,
      externalUrl: 'https://www.booking.com',
      stars: 4,
      freeCancellation: true,
      breakfastIncluded: true,
      airConditioning: true,
      spa: true,
      restaurant: true,
      reception24h: true,
    },
    {
      id: '7',
      name: 'Eco-Friendly Hostel',
      type: 'hostel',
      location: 'Belleville, 20. dzielnica',
      address: '15 Rue de Belleville, 75020 Paris, Francja',
      price: 35,
      rating: 7.5,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
      description:
        'Ekologiczny hostel z przyjazną atmosferą. Idealny dla świadomych podróżników.',
      amenities: ['wifi', 'breakfast', 'kitchen', 'garden'],
      distance: '3.8 km',
      distanceValue: 3.8,
      externalUrl: 'https://www.booking.com',
      stars: 1,
      freeCancellation: false,
      breakfastIncluded: true,
    },
    {
      id: '8',
      name: 'Luxury Suite Eiffel Tower',
      type: 'apartment',
      location: '7. dzielnica, blisko Wieży Eiffla',
      address: '12 Avenue de la Bourdonnais, 75007 Paris, Francja',
      price: 520,
      rating: 9.8,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      description:
        'Luksusowy apartament z widokiem na Wieżę Eiffla. Nowoczesne wnętrza i pełne wyposażenie.',
      amenities: ['wifi', 'kitchen', 'balcony', 'airConditioning', 'parking'],
      distance: '0.5 km',
      distanceValue: 0.5,
      externalUrl: 'https://www.booking.com',
      stars: 0,
      freeCancellation: true,
      breakfastIncluded: false,
      airConditioning: true,
      balcony: true,
    },
  ];

  setTimeout(() => {
    accommodations.value = mock;
    loading.value = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 300);
};
</script>