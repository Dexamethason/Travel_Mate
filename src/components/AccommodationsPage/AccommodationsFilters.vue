<template>
  <div class="w-1/4">
    <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Filtry</h2>
        <button
          class="cursor-pointer text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          @click="resetFilters"
        >
          Resetuj wszystko
        </button>
      </div>

      <!-- price range -->
      <div class="mb-6">
        <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">
          Cena za noc (zł)
        </p>
        <div class="mb-2 flex items-center gap-4">
          <input
            :value="modelValue.priceMin"
            type="number"
            min="0"
            :max="modelValue.priceMax"
            class="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Min"
            @input="updateNumberField('priceMin', $event)"
          />
          <span class="text-gray-500">-</span>
          <input
            :value="modelValue.priceMax"
            type="number"
            :min="modelValue.priceMin"
            class="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Max"
            @input="updateNumberField('priceMax', $event)"
          />
        </div>
        <!-- Podwójny range slider -->
        <div class="relative mt-4">
          <div class="range-slider-container">
            <input
              :value="modelValue.priceMin"
              type="range"
              min="0"
              max="2000"
              step="10"
              class="range-input range-input-min"
              @input="updateRangeField('priceMin', $event)"
            />
            <input
              :value="modelValue.priceMax"
              type="range"
              min="0"
              max="2000"
              step="10"
              class="range-input range-input-max"
              @input="updateRangeField('priceMax', $event)"
            />
            <div class="range-track"></div>
            <div
              class="range-progress"
              :style="{
                left: `${(modelValue.priceMin / 2000) * 100}%`,
                width: `${((modelValue.priceMax - modelValue.priceMin) / 2000) * 100}%`
              }"
            ></div>
          </div>
        </div>
        <div class="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{{ modelValue.priceMin }} zł</span>
          <span>{{ modelValue.priceMax }} zł</span>
        </div>
      </div>

      <!-- typ noclegu -->
      <div class="mb-6">
        <div class="mb-4 flex items-center justify-between">
          <p class="text-base font-medium text-gray-900 dark:text-white">Typ noclegu</p>
          <button
            type="button"
            class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            @click="resetField('type')"
          >
            Resetuj
          </button>
        </div>
        <select
          :value="modelValue.type"
          class="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:border-blue-400"
          @change="handleSelectChange('type', $event)"
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
        <div class="mb-4 flex items-center justify-between">
          <p class="text-base font-medium text-gray-900 dark:text-white">
            Minimalna ocena gości
          </p>
          <button
            type="button"
            class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            @click="resetField('minRating')"
          >
            Resetuj
          </button>
        </div>
        <select
          :value="modelValue.minRating"
          class="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:border-blue-400"
          @change="handleSelectNumberChange('minRating', $event)"
        >
          <option :value="0">Wszystkie</option>
          <option :value="1">1.0+</option>
          <option :value="2">2.0+</option>
          <option :value="3">3.0+</option>
          <option :value="4">4.0+</option>
          <option :value="5">5.0+</option>
        </select>
      </div>

      <!-- filtr gwiazdek -->
      <div class="mb-6">
        <div class="mb-4 flex items-center justify-between">
          <p class="text-base font-medium text-gray-900 dark:text-white">
            Kategoria (gwiazdki)
          </p>
          <button
            type="button"
            class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            @click="resetField('stars')"
          >
            Resetuj
          </button>
        </div>
        <select
          :value="modelValue.stars"
          class="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:border-blue-400"
          @change="handleSelectNumberChange('stars', $event)"
        >
          <option :value="0">Wszystkie</option>
          <option :value="1">1 gwiazdka</option>
          <option :value="2">2 gwiazdki</option>
          <option :value="3">3 gwiazdki</option>
          <option :value="4">4 gwiazdki</option>
          <option :value="5">5 gwiazdek</option>
        </select>
      </div>

      <!-- udogodnienia podstawowe -->
      <div v-if="basicAvailableAmenities.length > 0" class="mb-6">
        <div class="mb-4 flex items-center justify-between">
          <p class="text-base font-medium text-gray-900 dark:text-white">Udogodnienia</p>
          <button
            type="button"
            class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            @click="resetAmenities"
          >
            Resetuj
          </button>
        </div>
        <div class="space-y-2">
          <label
            v-for="amenity in basicAvailableAmenities"
            :key="amenity"
            class="flex cursor-pointer items-center"
          >
            <input
              type="checkbox"
              class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="modelValue.amenities.includes(amenity)"
              :value="amenity"
              @change="toggleAmenity(amenity)"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">
              {{ amenityLabelMap[amenity] || amenity }}
            </span>
          </label>
        </div>
      </div>

      <!-- dodatkowe udogodnienia -->
      <div v-if="additionalAvailableAmenities.length > 0" class="mb-6">
        <div class="mb-4 flex items-center justify-between">
          <p class="text-base font-medium text-gray-900 dark:text-white">
            Dodatkowe udogodnienia
          </p>
          <button
            type="button"
            class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            @click="resetAmenities"
          >
            Resetuj
          </button>
        </div>
        <div class="space-y-2">
          <label
            v-for="amenity in additionalAvailableAmenities"
            :key="amenity"
            class="flex cursor-pointer items-center"
          >
            <input
              type="checkbox"
              class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="modelValue.amenities.includes(amenity)"
              :value="amenity"
              @change="toggleAmenity(amenity)"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">
              {{ amenityLabelMap[amenity] || amenity }}
            </span>
          </label>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { AccommodationFilters } from '@/composables/useAccommodations';

interface Props {
  modelValue: AccommodationFilters;
  availableAmenities?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  availableAmenities: () => [],
});

// Mapowanie nazw amenities na polskie etykiety
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

// Podział na podstawowe i dodatkowe amenities
const basicAmenities = ['wifi', 'parking', 'pool', 'breakfast', 'airconditioning', 'kitchen', 'balcony', 'pets'];
const isBasicAmenity = (amenity: string) => basicAmenities.includes(amenity);

// Filtruj dostępne amenities na podstawowe i dodatkowe
const basicAvailableAmenities = computed(() => {
  const available = props.availableAmenities || [];
  return available.filter(amenity => isBasicAmenity(amenity)).sort();
});

const additionalAvailableAmenities = computed(() => {
  const available = props.availableAmenities || [];
  return available.filter(amenity => !isBasicAmenity(amenity)).sort();
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: AccommodationFilters): void;
  (e: 'reset'): void;
}>();

const updateField = (
  field: keyof AccommodationFilters,
  value: string | number | boolean
) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value } as AccommodationFilters);
};

const updateNumberField = (
  field: keyof AccommodationFilters,
  event: Event
) => {
  const value = (event.target as HTMLInputElement | HTMLSelectElement).value;
  const num = Number(value);
  updateField(field, Number.isNaN(num) ? 0 : num);
};

const updateRangeField = (
  field: keyof AccommodationFilters,
  event: Event
) => {
  const value = (event.target as HTMLInputElement).value;
  const num = Number(value);
  if (!Number.isNaN(num)) {
    // Zapobieganie przekroczeniu wartości
    if (field === 'priceMin' && num > props.modelValue.priceMax) {
      updateField('priceMin', props.modelValue.priceMax);
    } else if (field === 'priceMax' && num < props.modelValue.priceMin) {
      updateField('priceMax', props.modelValue.priceMin);
    } else {
      updateField(field, num);
    }
  }
};

const toggleAmenity = (amenity: string) => {
  const current = props.modelValue.amenities;
  const exists = current.includes(amenity);
  const next = exists ? current.filter(a => a !== amenity) : [...current, amenity];
  emit('update:modelValue', { ...props.modelValue, amenities: next });
};

const handleSelectChange = (field: keyof AccommodationFilters, event: Event) => {
  const target = event.target as HTMLSelectElement;
  const value = target.value;
  updateField(field, value);
  // Usuń focus natychmiast po wyborze
  setTimeout(() => {
    target.blur();
  }, 0);
};

const handleSelectNumberChange = (field: keyof AccommodationFilters, event: Event) => {
  const target = event.target as HTMLSelectElement;
  const value = target.value;
  const num = Number(value);
  updateField(field, Number.isNaN(num) ? 0 : num);
  // Usuń focus natychmiast po wyborze
  setTimeout(() => {
    target.blur();
  }, 0);
};

const resetFilters = () => {
  emit('reset');
};

const resetField = (field: keyof AccommodationFilters) => {
  const defaultValue = getDefaultValue(field);
  if (field === 'amenities') {
    emit('update:modelValue', { ...props.modelValue, amenities: [] });
  } else {
    updateField(field, defaultValue as string | number | boolean);
  }
};

const resetAmenities = () => {
  emit('update:modelValue', { ...props.modelValue, amenities: [] });
};

const getDefaultValue = (field: keyof AccommodationFilters): string | number | boolean => {
  const defaults: Partial<Record<keyof AccommodationFilters, string | number | boolean>> = {
    priceMin: 0,
    priceMax: 2000,
    type: '',
    minRating: 0,
    stars: 0,
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
  return defaults[field] ?? '';
};
</script>

<style scoped>
.range-slider-container {
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0;
}

.range-track {
  position: absolute;
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  z-index: 1;
  top: 50%;
  transform: translateY(-50%);
}

.dark .range-track {
  background: #4b5563;
}

.range-progress {
  position: absolute;
  height: 6px;
  background: #2563eb;
  border-radius: 3px;
  z-index: 1;
  pointer-events: none;
  top: 50%;
  transform: translateY(-50%);
}

.range-input {
  position: absolute;
  width: 100%;
  height: 100%;
  background: none;
  pointer-events: none;
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
  padding: 0;
  top: 0;
  left: 0;
}

.range-input::-webkit-slider-runnable-track {
  height: 6px;
  background: transparent;
  border: none;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
  pointer-events: all;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: background 0.2s;
  margin-top: -6px;
}

.range-input::-webkit-slider-thumb:hover {
  background: #1d4ed8;
}

.range-input::-moz-range-track {
  height: 6px;
  background: transparent;
  border: none;
}

.range-input::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
  pointer-events: all;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: background 0.2s;
  position: relative;
}

.range-input::-moz-range-thumb:hover {
  background: #1d4ed8;
}

.range-input-min {
  z-index: 3;
}

.range-input-max {
  z-index: 4;
}

/* Stylowanie selectów - więcej miejsca na strzałkę i usunięcie focus outline */
select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

select:focus {
  outline: none;
  box-shadow: none;
}

/* Usuń ring przy kliknięciu myszką, zostaw tylko przy nawigacji klawiaturą */
select:focus:not(:focus-visible) {
  outline: none;
  box-shadow: none;
  border-color: inherit;
  --tw-ring-shadow: 0 0 #0000;
}

.dark select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%9ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
}
</style>


