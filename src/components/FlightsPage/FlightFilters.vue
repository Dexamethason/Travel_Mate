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

      <!-- Filtr ceny -->
      <div class="mb-6">
        <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">Przedział cenowy</p>
        <div class="mb-2 flex items-center gap-4">
          <input
            :value="modelValue.priceMin ?? 0"
            type="number"
            min="0"
            class="price-input w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Min"
            @input="handlePriceMinChange(($event.target as HTMLInputElement).value)"
          />
          <span class="text-gray-500">-</span>
          <input
            :value="modelValue.priceMax ?? 10000"
            type="number"
            min="0"
            class="price-input w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Max"
            @input="handlePriceMaxChange(($event.target as HTMLInputElement).value)"
          />
        </div>
        <p class="text-xs text-gray-500">Cena w {{ modelValue.currency || 'PLN' }}</p>
      </div>

      <!-- Filtr przesiadek -->
      <div class="mb-6">
        <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">Liczba przesiadek</p>
        <div class="space-y-2">
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              :checked="modelValue.directOnly"
              class="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              @change="updateField('directOnly', ($event.target as HTMLInputElement).checked)"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Bezpośrednie</span>
          </label>
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              :checked="modelValue.maxStops === 1"
              class="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              @change="
                updateField('maxStops', ($event.target as HTMLInputElement).checked ? 1 : null)
              "
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Maks. 1 przesiadka</span>
          </label>
        </div>
      </div>

      <!-- Czas całkowity lotu -->
      <div class="mb-6">
        <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">
          Czas lotu (max {{ modelValue.maxDuration || '24' }}h)
        </p>
        <input
          type="range"
          :value="modelValue.maxDuration || 24"
          min="1"
          max="48"
          class="w-full cursor-pointer accent-blue-600"
          @input="updateField('maxDuration', Number(($event.target as HTMLInputElement).value))"
        />
        <div class="mt-1 flex justify-between text-xs text-gray-500">
          <span>1h</span>
          <span>48h</span>
        </div>
      </div>

      <!-- Godzina wylotu -->
      <div class="mb-6">
        <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">Godzina wylotu</p>
        <div class="space-y-2">
          <label
            v-for="time in departureTimeOptions"
            :key="time.value"
            class="flex cursor-pointer items-center"
          >
            <input
              type="checkbox"
              :checked="modelValue.departureTime?.includes(time.value)"
              class="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              @change="toggleArrayField('departureTime', time.value)"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ time.label }}</span>
          </label>
        </div>
      </div>

      <!-- Godzina przylotu -->
      <div class="mb-6">
        <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">Godzina przylotu</p>
        <div class="space-y-2">
          <label
            v-for="time in arrivalTimeOptions"
            :key="time.value"
            class="flex cursor-pointer items-center"
          >
            <input
              type="checkbox"
              :checked="modelValue.arrivalTime?.includes(time.value)"
              class="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              @change="toggleArrayField('arrivalTime', time.value)"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ time.label }}</span>
          </label>
        </div>
      </div>

      <!-- Linie lotnicze -->
      <div class="mb-6">
        <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">Linie lotnicze</p>
        <div class="max-h-48 space-y-2 overflow-y-auto">
          <label
            v-for="airline in availableAirlines"
            :key="airline.code"
            class="flex cursor-pointer items-center"
          >
            <input
              type="checkbox"
              :checked="modelValue.airlines?.includes(airline.code)"
              class="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              @change="toggleArrayField('airlines', airline.code)"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ airline.name }}</span>
          </label>
        </div>
      </div>

      <!-- Klasa podróży -->
      <div class="mb-6">
        <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">Klasa podróży</p>
        <div class="space-y-2">
          <label
            v-for="cabin in cabinOptions"
            :key="cabin.value"
            class="flex cursor-pointer items-center"
          >
            <input
              type="checkbox"
              :checked="modelValue.cabin?.includes(cabin.value)"
              class="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              @change="toggleArrayField('cabin', cabin.value)"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ cabin.label }}</span>
          </label>
        </div>
      </div>

      <!-- Dodatkowe opcje -->
      <div class="mb-6">
        <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">Dodatkowe opcje</p>
        <div class="space-y-2">
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              :checked="modelValue.includedBaggage"
              class="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              @change="updateField('includedBaggage', ($event.target as HTMLInputElement).checked)"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300"
              >Bagaż rejestrowany w cenie</span
            >
          </label>
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              :checked="modelValue.refundable"
              class="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              @change="updateField('refundable', ($event.target as HTMLInputElement).checked)"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Zwrotny bilet</span>
          </label>
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              :checked="modelValue.noPenalty"
              class="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              @change="updateField('noPenalty', ($event.target as HTMLInputElement).checked)"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Bez kar za zmianę</span>
          </label>
          <label class="flex cursor-pointer items-center">
            <input
              type="checkbox"
              :checked="modelValue.ecoFriendly"
              class="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              @change="updateField('ecoFriendly', ($event.target as HTMLInputElement).checked)"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Niższa emisja CO₂</span>
          </label>
        </div>
      </div>

      <!-- Minimalna liczba miejsc -->
      <div class="mb-6">
        <p class="mb-4 text-base font-medium text-gray-900 dark:text-white">
          Min. liczba dostępnych miejsc
        </p>
        <select
          :value="modelValue.minSeats || 1"
          class="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          @change="updateField('minSeats', Number(($event.target as HTMLSelectElement).value))"
        >
          <option :value="1">1 miejsce</option>
          <option :value="2">2 miejsca</option>
          <option :value="3">3 miejsca</option>
          <option :value="4">4 miejsca</option>
          <option :value="5">5+ miejsc</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FlightFiltersType } from '@/types/flight';

interface Props {
  modelValue: FlightFiltersType;
  availableAirlines?: Array<{ code: string; name: string }>;
}

const props = withDefaults(defineProps<Props>(), {
  availableAirlines: () => [],
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: FlightFiltersType): void;
  (e: 'reset'): void;
}>();

const departureTimeOptions = [
  { value: 'morning', label: 'Rano (06:00 - 12:00)' },
  { value: 'afternoon', label: 'Popołudnie (12:00 - 18:00)' },
  { value: 'evening', label: 'Wieczór (18:00 - 00:00)' },
  { value: 'night', label: 'Noc (00:00 - 06:00)' },
];

const arrivalTimeOptions = [
  { value: 'morning', label: 'Rano (06:00 - 12:00)' },
  { value: 'afternoon', label: 'Popołudnie (12:00 - 18:00)' },
  { value: 'evening', label: 'Wieczór (18:00 - 00:00)' },
  { value: 'night', label: 'Noc (00:00 - 06:00)' },
];

const cabinOptions = [
  { value: 'ECONOMY', label: 'Ekonomiczna' },
  { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' },
  { value: 'BUSINESS', label: 'Biznes' },
  { value: 'FIRST', label: 'Pierwsza' },
];

const handlePriceMinChange = (value: string) => {
  const numValue = Number(value);
  if (numValue < 0) {
    updateField('priceMin', 0);
  } else {
    updateField('priceMin', numValue);
  }
};

const handlePriceMaxChange = (value: string) => {
  const numValue = Number(value);
  if (numValue < 0) {
    updateField('priceMax', 0);
  } else {
    updateField('priceMax', numValue);
  }
};

const updateField = (field: keyof FlightFiltersType, value: string | number | boolean | null) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value });
};

const toggleArrayField = (field: keyof FlightFiltersType, value: string) => {
  const currentArray = (props.modelValue[field] as string[]) || [];
  const index = currentArray.indexOf(value);
  const newArray =
    index > -1 ? currentArray.filter(item => item !== value) : [...currentArray, value];

  emit('update:modelValue', { ...props.modelValue, [field]: newArray });
};

const resetFilters = () => {
  emit('reset');
};
</script>

<style scoped>
.price-input {
  cursor: text;
}

.price-input::-webkit-inner-spin-button,
.price-input::-webkit-outer-spin-button {
  cursor: pointer;
}
</style>
