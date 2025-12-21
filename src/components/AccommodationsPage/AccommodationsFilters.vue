<template>
  <div class="w-1/4">
    <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Filtry</h2>
        <button
          class="cursor-pointer text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          @click="resetFilters"
        >
          Resetuj
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
        <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">Typ noclegu</p>
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
        <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">
          Minimalna ocena gości
        </p>
        <select
          :value="modelValue.minRating"
          class="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:border-blue-400"
          @change="handleSelectNumberChange('minRating', $event)"
        >
          <option :value="0">Wszystkie</option>
          <option :value="4">4.0+</option>
          <option :value="5">5.0+</option>
          <option :value="6">6.0+</option>
          <option :value="7">7.0+</option>
          <option :value="8">8.0+</option>
          <option :value="9">9.0+</option>
        </select>
      </div>

      <!-- filtr gwiazdek -->
      <div class="mb-6">
        <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">
          Kategoria (gwiazdki)
        </p>
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
      <div class="mb-6">
        <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">Udogodnienia</p>
        <div class="space-y-2">
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="modelValue.amenities.includes('wifi')"
              value="wifi"
              @change="toggleAmenity('wifi')"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">Wi-Fi</span>
          </label>
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="modelValue.amenities.includes('parking')"
              value="parking"
              @change="toggleAmenity('parking')"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">Parking</span>
          </label>
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="modelValue.amenities.includes('pool')"
              value="pool"
              @change="toggleAmenity('pool')"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">Basen</span>
          </label>
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="modelValue.amenities.includes('breakfast')"
              value="breakfast"
              @change="toggleAmenity('breakfast')"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">Śniadanie</span>
          </label>
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="modelValue.amenities.includes('airconditioning')"
              value="airconditioning"
              @change="toggleAmenity('airconditioning')"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">Klimatyzacja</span>
          </label>
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="modelValue.amenities.includes('balcony')"
              value="balcony"
              @change="toggleAmenity('balcony')"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">Balkon/Taras</span>
          </label>
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="modelValue.amenities.includes('kitchen')"
              value="kitchen"
              @change="toggleAmenity('kitchen')"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">Kuchnia</span>
          </label>
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="modelValue.amenities.includes('pets')"
              value="pets"
              @change="toggleAmenity('pets')"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">Przyjazne zwierzętom</span>
          </label>
        </div>
      </div>

      <!-- dodatkowe udogodnienia -->
      <div class="mb-6">
        <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">
          Dodatkowe udogodnienia
        </p>
        <div class="space-y-2">
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="modelValue.amenities.includes('gym')"
              value="gym"
              @change="toggleAmenity('gym')"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">Siłownia</span>
          </label>
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="modelValue.amenities.includes('spa')"
              value="spa"
              @change="toggleAmenity('spa')"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">SPA</span>
          </label>
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="modelValue.amenities.includes('restaurant')"
              value="restaurant"
              @change="toggleAmenity('restaurant')"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">Restauracja</span>
          </label>
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="modelValue.amenities.includes('reception24h')"
              value="reception24h"
              @change="toggleAmenity('reception24h')"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">Recepcja 24h</span>
          </label>
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="modelValue.amenities.includes('airporttransfer')"
              value="airporttransfer"
              @change="toggleAmenity('airporttransfer')"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">Transfer z lotniska</span>
          </label>
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="modelValue.amenities.includes('garden')"
              value="garden"
              @change="toggleAmenity('garden')"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">Ogród</span>
          </label>
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="modelValue.amenities.includes('lounge')"
              value="lounge"
              @change="toggleAmenity('lounge')"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">Salon</span>
          </label>
        </div>
      </div>

      <!-- opcje specjalne -->
      <div class="mb-6">
        <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">Opcje specjalne</p>
        <div class="space-y-2">
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="modelValue.freeCancellation"
              @change="updateBooleanField('freeCancellation', $event)"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">Anulowanie bezpłatne</span>
          </label>
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="modelValue.petFriendly"
              @change="updateBooleanField('petFriendly', $event)"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">Przyjazne zwierzętom</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AccommodationFilters } from '@/composables/useAccommodations';

interface Props {
  modelValue: AccommodationFilters;
}

const props = defineProps<Props>();

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

const updateBooleanField = (
  field: keyof AccommodationFilters,
  event: Event
) => {
  const checked = (event.target as HTMLInputElement).checked;
  updateField(field, checked);
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


