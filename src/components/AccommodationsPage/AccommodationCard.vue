<template>
  <article
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
  >
    <div class="flex flex-col gap-4 md:flex-row md:gap-6">
      <!-- LEWA KOLUMNA – ZDJĘCIE -->
      <div class="relative w-full overflow-hidden md:w-1/3 md:flex-shrink-0">
        <img
          :src="imageUrl"
          :alt="accommodation.name"
          class="h-52 w-full rounded-t-2xl object-cover md:h-[280px] md:w-full md:object-cover md:rounded-l-2xl md:rounded-tr-none"
          style="min-height: 280px; max-height: 280px;"
          @error="handleImageError"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        />

        <!-- Overlay: ulubione + liczba zdjęć -->
        <div class="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-3">
          <button
            class="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-gray-700 shadow-sm backdrop-blur hover:bg-white dark:bg-gray-900/70 dark:text-gray-100"
            type="button"
            @click="toggleFavorite"
          >
            <component
              :is="favorite ? HeartSolidIcon : HeartOutlineIcon"
              class="h-5 w-5"
              :class="favorite ? 'text-red-500' : 'text-gray-400'"
            />
          </button>

          <div
            v-if="photosCount && photosCount > 1"
            class="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white backdrop-blur"
          >
            <PhotoIcon class="h-4 w-4" />
            <span>{{ photosCount }} zdjęć</span>
          </div>
        </div>
      </div>

      <!-- ŚRODKOWA KOLUMNA – INFORMACJE -->
      <div class="flex flex-1 flex-col gap-3 px-4 pb-4 pt-1 md:px-0 md:py-4">
        <!-- Tytuł + typ obiektu -->
        <header>
          <div class="mb-1 flex items-center justify-between gap-2">
            <h2 class="line-clamp-2 text-lg font-semibold text-gray-900 dark:text-white">
              {{ accommodation.name }}
            </h2>
            <span
              class="hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-medium md:inline-flex"
              :class="typeClass"
            >
              {{ typeLabel }}
            </span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ typeLabel }} •
            <span class="capitalize">{{ accommodation.type }}</span>
          </p>
        </header>

        <!-- Lokalizacja -->
        <section class="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <MapPinIcon class="h-4 w-4 text-gray-400 dark:text-gray-500" />
          <p class="line-clamp-1">
            {{ accommodation.address || accommodation.location }}
          </p>
        </section>

        <!-- Ocena -->
        <section class="flex flex-wrap items-center gap-3 text-xs">
          <div class="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-green-700 dark:bg-green-900/30 dark:text-green-200">
            <StarIcon class="h-4 w-4 text-yellow-400" />
            <span class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ accommodation.rating }}
            </span>
            <span class="text-[11px] text-gray-500 dark:text-gray-300">
              ({{ accommodation.reviews }} opinii)
            </span>
          </div>
        </section>

        <!-- Opis -->
        <p class="line-clamp-3 text-sm text-gray-700 dark:text-gray-300">
          {{ accommodation.description }}
        </p>

        <!-- Badge'e wyróżniające -->
        <section class="flex flex-wrap gap-2 text-[11px]">
          <span
            v-if="accommodation.freeCancellation"
            class="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200"
          >
            <ShieldCheckIcon class="mr-1 h-3.5 w-3.5" />
            Darmowa anulacja
          </span>
          <span
            v-if="instantConfirmation"
            class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
          >
            <BoltIcon class="mr-1 h-3.5 w-3.5" />
            Natychmiastowe potwierdzenie
          </span>
          <span
            v-if="noHiddenFees"
            class="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-1 font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200"
          >
            <BanknotesIcon class="mr-1 h-3.5 w-3.5" />
            Brak ukrytych opłat
          </span>
        </section>

        <!-- Udogodnienia -->
        <section class="mt-1">
          <div class="flex flex-wrap gap-2 text-xs">
            <div
              v-for="item in displayedAmenityChips"
              :key="item.key"
              class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
            >
              <component :is="item.icon" class="h-3.5 w-3.5 text-gray-400" />
              <span>{{ item.label }}</span>
            </div>

            <button
              v-if="remainingAmenitiesCount > 0"
              type="button"
              class="inline-flex cursor-pointer items-center rounded-full bg-gray-50 px-2.5 py-1 text-gray-500 transition hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              @click="toggleAmenitiesExpanded"
            >
              <span v-if="!amenitiesExpanded">+{{ remainingAmenitiesCount }} więcej</span>
              <span v-else>Pokaż mniej</span>
            </button>
          </div>
        </section>
      </div>

      <!-- PRAWA KOLUMNA – CENA + CTA -->
      <aside
        class="flex w-full flex-col justify-between border-t border-gray-100 px-4 pb-4 pt-3 text-right md:w-56 md:border-l md:border-t-0 md:px-5 md:py-4"
      >
        <div class="space-y-1">
          <p class="text-xs text-gray-500 dark:text-gray-400">Cena za noc</p>
          <p class="text-2xl font-semibold text-gray-900 dark:text-white">
            {{ accommodation.price }} zł
            <span class="text-sm font-normal text-gray-500 dark:text-gray-400">/ noc</span>
          </p>
          <p class="text-[11px] text-gray-500 dark:text-gray-400">
            {{ priceNote }}
          </p>
          <p v-if="availabilityNote" class="text-[11px] text-emerald-600 dark:text-emerald-300">
            {{ availabilityNote }}
          </p>
        </div>

        <button
          type="button"
          class="mt-3 inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-800"
          @click="handleViewDetails"
        >
          Zobacz szczegóły
        </button>
      </aside>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  HeartIcon as HeartSolidIcon,
  PhotoIcon,
  MapPinIcon,
  StarIcon,
  SparklesIcon,
  ShieldCheckIcon,
  BoltIcon,
  BanknotesIcon,
  UsersIcon,
  HomeModernIcon,
  WifiIcon,
  TruckIcon,
  SwatchIcon,
  BeakerIcon,
  FireIcon,
  BuildingLibraryIcon,
  HomeIcon,
  SunIcon,
  HeartIcon,
  Cog6ToothIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  PaperAirplaneIcon,
  BuildingOffice2Icon,
  RectangleStackIcon,
  UserCircleIcon,
  UserGroupIcon,
  XCircleIcon,
  BeakerIcon as GlassIcon,
  BellIcon,
  BriefcaseIcon,
  WrenchIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/vue/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/vue/24/outline';
import type { Accommodation } from '@/composables/useAccommodations';

interface Props {
  accommodation: Accommodation;
  photosCount?: number;
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  instantConfirmation?: boolean;
  noHiddenFees?: boolean;
  priceNote?: string;
  availabilityNote?: string;
  isFavorite?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  photosCount: 0,
  bedrooms: undefined,
  bathrooms: undefined,
  maxGuests: undefined,
  instantConfirmation: false,
  noHiddenFees: false,
  priceNote: 'Możliwe dodatkowe opłaty serwisowe.',
  availabilityNote: '',
  isFavorite: false,
});

const {
  accommodation,
  photosCount,
  bedrooms,
  bathrooms,
  maxGuests,
  instantConfirmation,
  noHiddenFees,
  priceNote,
  availabilityNote,
  isFavorite,
} = props;

const emit = defineEmits<{
  (e: 'toggle-favorite'): void;
  (e: 'update:isFavorite', value: boolean): void;
}>();

const typeClassMap: Record<string, string> = {
  hotel: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  apartment: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  hostel: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  bnb: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  villa: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const typeLabelMap: Record<string, string> = {
  hotel: 'Hotel',
  apartment: 'Apartament',
  hostel: 'Hostel',
  bnb: 'B&B',
  villa: 'Willa',
};

const amenityLabelMap: Record<string, string> = {
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
  airconditioning: 'Klimatyzacja',
  restaurant: 'Restauracja',
  reception24h: 'Recepcja 24h',
  airporttransfer: 'Transfer z lotniska',
  laundry: 'Pralnia',
  accessible: 'Dostępne dla niepełnosprawnych',
  kidfriendly: 'Przyjazne dzieciom',
  smokefree: 'Dla niepalących',
  bar: 'Bar',
  roomservice: 'Usługa pokojowa',
  businesscenter: 'Centrum biznesowe',
  heating: 'Ogrzewanie',
  ironing: 'Deska do prasowania',
  cabletv: 'Telewizja kablowa',
};

const typeClass = computed(
  () =>
    typeClassMap[accommodation.type] ||
    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
);

const typeLabel = computed(
  () => typeLabelMap[accommodation.type] || accommodation.type
);

// Udogodnienia z ikonami - każdy amenity ma unikalną ikonę
const amenityIconMap: Record<string, any> = {
  wifi: WifiIcon,
  parking: TruckIcon,
  pool: BeakerIcon, // Basen - ikona wody/beaker
  breakfast: FireIcon, // Śniadanie - ikona ognia (kuchnia)
  spa: SparklesIcon, // SPA - ikona iskier
  gym: BoltIcon, // Siłownia - ikona błyskawicy (energia)
  kitchen: HomeIcon, // Kuchnia - ikona domu
  balcony: SunIcon, // Balkon - ikona słońca
  lounge: BuildingLibraryIcon, // Salon - ikona biblioteki
  garden: SwatchIcon, // Ogród - ikona palety kolorów
  pets: HeartIcon, // Zwierzęta - ikona serca
  airconditioning: Cog6ToothIcon, // Klimatyzacja - ikona koła zębatego
  restaurant: BuildingStorefrontIcon || BuildingOffice2Icon, // Restauracja - ikona sklepu/budynku
  reception24h: ClockIcon, // Recepcja 24h - ikona zegara
  airporttransfer: PaperAirplaneIcon, // Transfer z lotniska - ikona samolotu
  laundry: RectangleStackIcon, // Pralnia - ikona stosu (ubrań)
  accessible: UserCircleIcon, // Dostępne dla niepełnosprawnych - ikona użytkownika
  kidfriendly: UserGroupIcon, // Przyjazne dzieciom - ikona grupy użytkowników
  smokefree: XCircleIcon, // Dla niepalących - ikona zakazu
  bar: GlassIcon, // Bar - ikona szkła
  roomservice: BellIcon, // Usługa pokojowa - ikona dzwonka
  businesscenter: BriefcaseIcon, // Centrum biznesowe - ikona teczki
  heating: FireIcon, // Ogrzewanie - ikona ognia
  ironing: WrenchIcon, // Deska do prasowania - ikona narzędzia
  cabletv: DevicePhoneMobileIcon, // Telewizja kablowa - ikona urządzenia
};

const amenitiesExpanded = ref(false);

const visibleAmenities = computed(() => {
  if (amenitiesExpanded.value) {
    return accommodation.amenities;
  }
  return accommodation.amenities.slice(0, 6);
});

const remainingAmenitiesCount = computed(
  () => accommodation.amenities.length - 6
);

const toggleAmenitiesExpanded = () => {
  amenitiesExpanded.value = !amenitiesExpanded.value;
};

const displayedAmenityChips = computed(() => {
  const chips: Array<{ key: string; label: string; icon: any }> = [];

  if (maxGuests) {
    chips.push({
      key: 'guests',
      label: `${maxGuests} gości`,
      icon: UsersIcon,
    });
  }
  if (bedrooms) {
    chips.push({
      key: 'bedrooms',
      label: `${bedrooms} sypialnie`,
      icon: HomeModernIcon,
    });
  }
  if (bathrooms) {
    chips.push({
      key: 'bathrooms',
      label: `${bathrooms} łazienki`,
      icon: SwatchIcon,
    });
  }

  visibleAmenities.value.forEach(key => {
    chips.push({
      key,
      label: amenityLabelMap[key] || key,
      icon: amenityIconMap[key] || SparklesIcon,
    });
  });

  return chips;
});

// Domyślne zdjęcie hotelu - fallback gdy brak zdjęcia
const DEFAULT_HOTEL_IMAGE = '/deafult-hotel.png';

/**
 * Waliduje czy URL zdjęcia jest poprawny
 */
const isValidImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  const trimmed = url.trim();
  if (trimmed === '' || trimmed === 'undefined' || trimmed === 'null') return false;
  
  // Lokalne ścieżki (zaczynające się od /) są poprawne
  if (trimmed.startsWith('/')) return true;
  
  // Sprawdź czy to poprawny URL
  try {
    const urlObj = new URL(trimmed);
    // Sprawdź czy to HTTP/HTTPS
    if (!['http:', 'https:'].includes(urlObj.protocol)) return false;
    return true;
  } catch {
    return false;
  }
};

// Computed dla URL zdjęcia z fallbackiem
const imageUrl = computed(() => {
  const img = accommodation.image;
  if (!isValidImageUrl(img)) {
    return DEFAULT_HOTEL_IMAGE;
  }
  return img;
});

// Obsługa błędu ładowania zdjęcia - automatycznie używa domyślnego
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  // Jeśli zdjęcie nie załadowało się i to nie jest już domyślne, użyj domyślnego
  if (img.src !== DEFAULT_HOTEL_IMAGE && !img.src.includes('deafult-hotel.png')) {
    img.src = DEFAULT_HOTEL_IMAGE;
  }
};

const favorite = ref<boolean>(isFavorite);

watch(
  () => isFavorite,
  value => {
    favorite.value = value;
  }
);

const toggleFavorite = (event: MouseEvent) => {
  event.stopPropagation();
  favorite.value = !favorite.value;
  emit('update:isFavorite', favorite.value);
  emit('toggle-favorite');
};

const handleViewDetails = () => {
  if (accommodation.externalUrl) {
    window.open(accommodation.externalUrl, '_blank', 'noopener,noreferrer');
  } else {
    const searchQuery = encodeURIComponent(`${accommodation.name} ${accommodation.location}`);
    window.open(
      `https://www.booking.com/searchresults.html?ss=${searchQuery}`,
      '_blank',
      'noopener,noreferrer'
    );
  }
};

</script>
