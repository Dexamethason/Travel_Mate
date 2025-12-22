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
            class="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Min"
            @input="updateNumberField('priceMin', $event)"
          />
          <span class="text-gray-500">-</span>
          <input
            :value="modelValue.priceMax"
            type="number"
            min="0"
            class="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Max"
            @input="updateNumberField('priceMax', $event)"
          />
        </div>
      </div>

      <!-- typ noclegu -->
      <div class="mb-6">
        <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">Typ noclegu</p>
        <select
          :value="modelValue.type"
          class="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          @change="updateField('type', ($event.target as HTMLSelectElement).value)"
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
        <p class="mb-2 text-base font-medium text-gray-900 dark:text-white">
          Minimalna ocena gości
        </p>
        <p class="mb-3 text-xs text-gray-500 dark:text-gray-400">
          Ocena użytkowników (opinie gości)
        </p>
        <select
          :value="modelValue.minRating"
          class="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          @change="updateNumberField('minRating', $event)"
        >
          <option :value="0">Wszystkie</option>
          <option :value="6">6.0+</option>
          <option :value="7">7.0+</option>
          <option :value="8">8.0+</option>
          <option :value="9">9.0+</option>
        </select>
      </div>

      <!-- filtr gwiazdek -->
      <div class="mb-6">
        <p class="mb-2 text-base font-medium text-gray-900 dark:text-white">
          Kategoria (gwiazdki)
        </p>
        <p class="mb-3 text-xs text-gray-500 dark:text-gray-400">
          Oficjalna klasyfikacja hoteli (1-5 gwiazdek)
        </p>
        <select
          :value="modelValue.stars"
          class="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          @change="updateNumberField('stars', $event)"
        >
          <option :value="0">Wszystkie</option>
          <option :value="1">1 gwiazdka</option>
          <option :value="2">2 gwiazdki</option>
          <option :value="3">3 gwiazdki</option>
          <option :value="4">4 gwiazdki</option>
          <option :value="5">5 gwiazdek</option>
        </select>
      </div>

      <!-- filtr odległości -->
      <div class="mb-6">
        <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">
          Maksymalna odległość od centrum (km)
        </p>
        <input
          :value="modelValue.maxDistance"
          type="number"
          min="0"
          step="0.5"
          class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="np. 5"
          @input="updateNumberField('maxDistance', $event)"
        />
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Zostaw puste, aby pokazać wszystkie
        </p>
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
              :checked="modelValue.breakfastIncluded"
              @change="updateBooleanField('breakfastIncluded', $event)"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">Śniadanie wliczone</span>
          </label>
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="modelValue.airConditioning"
              @change="updateBooleanField('airConditioning', $event)"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">Klimatyzacja</span>
          </label>
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="modelValue.balcony"
              @change="updateBooleanField('balcony', $event)"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">Balkon/Taras</span>
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
              :checked="modelValue.fitnessCenter"
              @change="updateBooleanField('fitnessCenter', $event)"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">Siłownia</span>
          </label>
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="modelValue.spa"
              @change="updateBooleanField('spa', $event)"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">SPA</span>
          </label>
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="modelValue.restaurant"
              @change="updateBooleanField('restaurant', $event)"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">Restauracja</span>
          </label>
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="modelValue.reception24h"
              @change="updateBooleanField('reception24h', $event)"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">Recepcja 24h</span>
          </label>
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              class="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="modelValue.airportTransfer"
              @change="updateBooleanField('airportTransfer', $event)"
            />
            <span class="ml-2 text-gray-700 dark:text-gray-300">Transfer z lotniska</span>
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

const resetFilters = () => {
  emit('reset');
};
</script>


