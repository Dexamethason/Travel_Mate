<template>
  <div class="flex min-h-screen flex-1 justify-center bg-gray-50 px-10 py-5 dark:bg-gray-900">
    <div class="flex max-w-6xl flex-1 flex-col">
      <!-- Header -->
      <div class="flex flex-wrap justify-between gap-3 p-4">
        <h1 class="text-3xl font-bold leading-tight text-gray-900 dark:text-white">
          Znajdź idealne noclegi
        </h1>
      </div>

      <!-- formularz wyszukiwania -->
      <div
        class="mb-8 flex flex-wrap items-end gap-4 rounded-lg bg-white px-4 py-3 shadow-sm dark:bg-gray-800"
      >
        <label class="flex min-w-40 flex-1 flex-col">
          <p class="pb-2 text-base font-medium leading-normal text-gray-900 dark:text-white">
            Miejsce docelowe
          </p>
          <input
            v-model="searchForm.destination"
            class="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Miasto lub region"
          />
        </label>

        <label class="flex min-w-40 flex-1 flex-col">
          <p class="pb-2 text-base font-medium leading-normal text-gray-900 dark:text-white">
            Zameldowanie
          </p>
          <input
            v-model="searchForm.checkIn"
            type="date"
            class="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </label>

        <label class="flex min-w-40 flex-1 flex-col">
          <p class="pb-2 text-base font-medium leading-normal text-gray-900 dark:text-white">
            Wymeldowanie
          </p>
          <input
            v-model="searchForm.checkOut"
            type="date"
            class="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </label>

        <label class="flex min-w-40 flex-1 flex-col">
          <p class="pb-2 text-base font-medium leading-normal text-gray-900 dark:text-white">
            Goście
          </p>
          <input
            v-model="searchForm.guests"
            type="number"
            min="1"
            class="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="2 dorosłych"
          />
        </label>

        <button
          class="h-12 rounded-lg bg-blue-500 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-600"
          @click="searchAccommodations"
        >
          Szukaj
        </button>
      </div>

      <div class="flex gap-8">
        <!-- sidebar z filtrami -->
        <div class="w-1/4">
          <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <h2 class="mb-6 text-xl font-bold text-gray-900 dark:text-white">Filtry</h2>

            <!-- price range -->
            <div class="mb-6">
              <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">
                Cena za noc (zł)
              </p>
              <div class="mb-2 flex items-center gap-4">
                <input
                  v-model="filters.priceMin"
                  type="number"
                  class="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Min"
                />
                <span class="text-gray-500">-</span>
                <input
                  v-model="filters.priceMax"
                  type="number"
                  class="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Max"
                />
              </div>
            </div>

            <!-- filtr typów noclegu -->
            <div class="mb-6">
              <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">Typ noclegu</p>
              <select
                v-model="filters.type"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Wszystkie</option>
                <option value="hotel">Hotel</option>
                <option value="apartment">Apartament</option>
                <option value="hostel">Hostel</option>
                <option value="villa">Willa</option>
                <option value="bnb">Bed & Breakfast</option>
              </select>
            </div>

            <!-- filtr ocen -->
            <div class="mb-6">
              <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">
                Minimalna ocena
              </p>
              <select
                v-model="filters.minRating"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="0">Wszystkie</option>
                <option value="6">6.0+</option>
                <option value="7">7.0+</option>
                <option value="8">8.0+</option>
                <option value="9">9.0+</option>
              </select>
            </div>

            <!-- filtr udogodnień -->
            <div class="mb-6">
              <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">Udogodnienia</p>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    v-model="filters.amenities"
                    type="checkbox"
                    value="wifi"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Wi-Fi</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="filters.amenities"
                    type="checkbox"
                    value="parking"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Parking</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="filters.amenities"
                    type="checkbox"
                    value="pool"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Basen</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="filters.amenities"
                    type="checkbox"
                    value="breakfast"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Śniadanie</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- wyniki wyszukiwania -->
        <div class="flex-1">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              Wyniki ({{ filteredAccommodations.length }})
            </h2>
            <select
              v-model="sortBy"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="price">Cena: od najniższej</option>
              <option value="rating">Ocena: od najwyższej</option>
              <option value="distance">Odległość</option>
            </select>
          </div>

          <div
            v-if="accommodations.length === 0"
            class="py-16 text-center text-gray-500 dark:text-gray-400"
          >
            Użyj formularza powyżej, aby wyszukać noclegi
          </div>

          <div class="grid gap-6">
            <div
              v-for="accommodation in sortedAccommodations"
              :key="accommodation.id"
              class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="flex">
                <!-- zdjęcie -->
                <div class="h-48 w-64 flex-shrink-0">
                  <img
                    :src="accommodation.image"
                    :alt="accommodation.name"
                    class="h-full w-full object-cover"
                  />
                </div>

                <!-- treść -->
                <div class="flex-1 p-6">
                  <div class="mb-2 flex items-start justify-between">
                    <div>
                      <h3 class="mb-1 text-lg font-bold text-gray-900 dark:text-white">
                        {{ accommodation.name }}
                      </h3>
                      <p class="mb-2 text-sm text-gray-600 dark:text-gray-400">
                        {{ accommodation.location }}
                      </p>
                      <div class="mb-2 flex items-center gap-2">
                        <span
                          class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                          :class="getTypeClass(accommodation.type)"
                        >
                          {{ getTypeLabel(accommodation.type) }}
                        </span>
                        <div class="flex items-center">
                          <svg class="h-4 w-4 fill-current text-yellow-400" viewBox="0 0 20 20">
                            <path
                              d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                            />
                          </svg>
                          <span class="ml-1 text-sm font-medium text-gray-900 dark:text-white">
                            {{ accommodation.rating }}
                          </span>
                          <span class="ml-1 text-sm text-gray-500 dark:text-gray-400">
                            ({{ accommodation.reviews }} opinii)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div class="text-right">
                      <p class="text-2xl font-bold text-gray-900 dark:text-white">
                        {{ accommodation.price }} zł
                      </p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">za noc</p>
                    </div>
                  </div>

                  <p class="mb-4 text-sm text-gray-700 dark:text-gray-300">
                    {{ accommodation.description }}
                  </p>

                  <!-- udogodnienia -->
                  <div class="mb-4 flex flex-wrap gap-2">
                    <span
                      v-for="amenity in accommodation.amenities.slice(0, 4)"
                      :key="amenity"
                      class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {{ getAmenityLabel(amenity) }}
                    </span>
                    <span
                      v-if="accommodation.amenities.length > 4"
                      class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    >
                      +{{ accommodation.amenities.length - 4 }} więcej
                    </span>
                  </div>

                  <div class="flex items-center justify-between">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ accommodation.distance }} od centrum
                    </p>
                    <div class="flex gap-2">
                      <button
                        class="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        Zobacz szczegóły
                      </button>
                      <button
                        class="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600"
                      >
                        Dodaj do planu
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Accommodation {
  id: number;
  name: string;
  type: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  amenities: string[];
  distance: string;
}

const searchForm = ref({
  destination: '',
  checkIn: '',
  checkOut: '',
  guests: 2,
});

const filters = ref({
  priceMin: 0,
  priceMax: 2000,
  type: '',
  minRating: 0,
  amenities: [] as string[],
});

const sortBy = ref('price');

const accommodations = ref<Accommodation[]>([
  {
    id: 1,
    name: 'Hotel Luxe Paris',
    type: 'hotel',
    location: 'Centrum Paryża, 1. dzielnica',
    price: 450,
    rating: 9.2,
    reviews: 1247,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    description:
      'Elegancki hotel butikowy w sercu Paryża, w pobliżu Luwru i Ogrodu Tuileries. Oferuje luksusowe pokoje z widokiem na miasto.',
    amenities: ['wifi', 'parking', 'breakfast', 'spa', 'gym'],
    distance: '0.2 km',
  },
  {
    id: 2,
    name: 'Cozy Montmartre Apartment',
    type: 'apartment',
    location: 'Montmartre, 18. dzielnica',
    price: 180,
    rating: 8.7,
    reviews: 432,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    description:
      'Przytulny apartament w artystycznej dzielnicy Montmartre. Idealny dla par szukających autentycznego paryskiego doświadczenia.',
    amenities: ['wifi', 'kitchen', 'balcony'],
    distance: '2.1 km',
  },
  {
    id: 3,
    name: 'Budget Hostel Central',
    type: 'hostel',
    location: 'Łacińska Dzielnica, 5. dzielnica',
    price: 45,
    rating: 7.8,
    reviews: 892,
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    description:
      'Nowoczesny hostel w centrum Paryża. Doskonały wybór dla podróżników z ograniczonym budżetem.',
    amenities: ['wifi', 'breakfast', 'lounge', 'kitchen'],
    distance: '1.5 km',
  },
  {
    id: 4,
    name: 'Charming B&B Seine View',
    type: 'bnb',
    location: 'Île Saint-Louis, 4. dzielnica',
    price: 280,
    rating: 9.5,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    description: 'Urokliwy pensjonat z widokiem na Sekwanę. Rodzinna atmosfera i domowe śniadania.',
    amenities: ['wifi', 'breakfast', 'garden', 'pets'],
    distance: '0.8 km',
  },
  {
    id: 5,
    name: 'Modern Villa Suburbs',
    type: 'villa',
    location: 'Neuilly-sur-Seine',
    price: 650,
    rating: 8.9,
    reviews: 78,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    description: 'Luksusowa willa na przedmieściach Paryża. Idealna dla większych grup i rodzin.',
    amenities: ['wifi', 'parking', 'pool', 'garden', 'kitchen'],
    distance: '8.5 km',
  },
]);

const filteredAccommodations = computed(() => {
  return accommodations.value.filter(accommodation => {
    const priceInRange =
      accommodation.price >= filters.value.priceMin &&
      accommodation.price <= filters.value.priceMax;

    const typeMatch = !filters.value.type || accommodation.type === filters.value.type;

    const ratingMatch = accommodation.rating >= filters.value.minRating;

    const amenitiesMatch =
      filters.value.amenities.length === 0 ||
      filters.value.amenities.every(amenity => accommodation.amenities.includes(amenity));

    return priceInRange && typeMatch && ratingMatch && amenitiesMatch;
  });
});

const sortedAccommodations = computed(() => {
  const sorted = [...filteredAccommodations.value];

  switch (sortBy.value) {
    case 'price':
      return sorted.sort((a, b) => a.price - b.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'distance':
      return sorted.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    default:
      return sorted;
  }
});

const getTypeClass = (type: string) => {
  const classes: Record<string, string> = {
    hotel: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    apartment: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    hostel: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    bnb: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    villa: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };
  return classes[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
};

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    hotel: 'Hotel',
    apartment: 'Apartament',
    hostel: 'Hostel',
    bnb: 'B&B',
    villa: 'Willa',
  };
  return labels[type] || type;
};

const getAmenityLabel = (amenity: string) => {
  const labels: Record<string, string> = {
    wifi: 'Wi-Fi',
    parking: 'Parking',
    pool: 'Basen',
    breakfast: 'Śniadanie',
    spa: 'SPA',
    gym: 'Siłownia',
    kitchen: 'Kuchnia',
    balcony: 'Balkon',
    lounge: 'Salon',
    garden: 'Ogród',
    pets: 'Zwierzęta',
  };
  return labels[amenity] || amenity;
};

const searchAccommodations = () => {
  console.log('Wyszukiwanie noclegów...', searchForm.value);
  // TODO: podpiąć API jak będzie gotowe
};
</script>
