<template>
  <div class="w-1/4">
    <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Filtry</h2>
        <button
          v-if="hasAnyFilters"
          class="cursor-pointer text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          @click="resetFilters"
        >
          Resetuj wszystkie
        </button>
      </div>

      <!-- Połączenia -->
      <div v-if="stopsOptions.length > 0" class="mb-6">
        <div class="mb-4 flex items-center justify-between">
          <p class="text-base font-medium text-gray-900 dark:text-white">Połączenia</p>
          <button
            v-if="hasStopsFilter"
            class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
            @click="resetStopsFilter"
          >
            Resetuj
          </button>
        </div>
        <div class="space-y-2">
          <label
            v-for="option in stopsOptions"
            :key="option.stops"
            class="flex cursor-pointer items-center justify-between"
          >
            <div class="flex items-center">
              <input
                type="checkbox"
                :checked="isStopOptionSelected(option.stops)"
                class="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-0 focus:ring-offset-0"
                @change="toggleStopFilter(option.stops)"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ option.label }}</span>
            </div>
            <span class="text-xs text-gray-500 dark:text-gray-400"
              >od {{ option.minPrice }} zł</span
            >
          </label>
        </div>
      </div>

      <!-- Filtr ceny -->
      <div class="mb-6">
        <div class="mb-4 flex items-center justify-between">
          <p class="text-base font-medium text-gray-900 dark:text-white">Przedział cenowy</p>
          <button
            v-if="hasPriceFilter"
            class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
            @click="resetPriceFilter"
          >
            Resetuj
          </button>
        </div>
        <div class="mb-2 flex items-center gap-4">
          <input
            :value="modelValue.priceMin ?? 0"
            type="number"
            min="0"
            step="100"
            class="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Min"
            @input="handlePriceMinChange(($event.target as HTMLInputElement).value)"
          />
          <span class="text-gray-500">-</span>
          <input
            :value="modelValue.priceMax ?? 10000"
            type="number"
            min="0"
            step="100"
            class="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Max"
            @input="handlePriceMaxChange(($event.target as HTMLInputElement).value)"
          />
        </div>
        <p class="text-xs text-gray-500">Cena w {{ modelValue.currency || 'PLN' }}</p>
      </div>

      <!-- Czas całkowity lotu -->
      <div class="mb-6">
        <div class="mb-4 flex items-center justify-between">
          <p class="text-base font-medium text-gray-900 dark:text-white">
            Czas lotu (max {{ modelValue.maxDuration || '24' }}h)
          </p>
          <button
            v-if="hasDurationFilter"
            class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
            @click="resetDurationFilter"
          >
            Resetuj
          </button>
        </div>
        <div class="relative py-2">
          <!-- Tło szare -->
          <div
            class="pointer-events-none absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-lg bg-gray-200 dark:bg-gray-600"
          ></div>
          <!-- Niebieski pasek od początku do wartości -->
          <div
            class="pointer-events-none absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-lg bg-blue-600"
            :style="{
              width: `${((modelValue.maxDuration || 24) / 48) * 100}%`,
            }"
          ></div>
          <!-- Suwak -->
          <input
            type="range"
            :value="modelValue.maxDuration || 24"
            min="1"
            max="48"
            step="1"
            class="dual-range-slider"
            @input="updateField('maxDuration', Number(($event.target as HTMLInputElement).value))"
          />
        </div>
        <div class="mt-1 flex justify-between text-xs text-gray-500">
          <span>1h</span>
          <span>48h</span>
        </div>
      </div>

      <!-- Godzina wylotu -->
      <div class="mb-6">
        <div class="mb-4 flex items-center justify-between">
          <p class="text-base font-medium text-gray-900 dark:text-white">Godzina wylotu</p>
          <button
            v-if="hasDepartureTimeFilter"
            class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
            @click="resetDepartureTimeFilter"
          >
            Resetuj
          </button>
        </div>
        <p class="mb-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {{ formatHour(departureTimeMin) }} - {{ formatHour(departureTimeMax) }}
        </p>
        <div class="relative py-2">
          <!-- Tło szare -->
          <div
            class="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-lg bg-gray-200 dark:bg-gray-600"
          ></div>
          <!-- Niebieski pasek między suwakami -->
          <div
            class="absolute top-1/2 h-1 -translate-y-1/2 rounded-lg bg-blue-600"
            :style="{
              left: `${(departureTimeMin / 24) * 100}%`,
              right: `${100 - (departureTimeMax / 24) * 100}%`,
            }"
          ></div>
          <!-- Suwak MIN -->
          <input
            type="range"
            :value="departureTimeMin"
            min="0"
            max="24"
            class="dual-range-slider"
            style="z-index: 3"
            @input="updateDepartureMin(Number(($event.target as HTMLInputElement).value))"
          />
          <!-- Suwak MAX -->
          <input
            type="range"
            :value="departureTimeMax"
            min="0"
            max="24"
            class="dual-range-slider"
            style="z-index: 4"
            @input="updateDepartureMax(Number(($event.target as HTMLInputElement).value))"
          />
        </div>
        <div class="mt-1 flex justify-between text-xs text-gray-500">
          <span>00:00</span>
          <span>24:00</span>
        </div>
      </div>

      <!-- Godzina przylotu -->
      <div class="mb-6">
        <div class="mb-4 flex items-center justify-between">
          <p class="text-base font-medium text-gray-900 dark:text-white">Godzina przylotu</p>
          <button
            v-if="hasArrivalTimeFilter"
            class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
            @click="resetArrivalTimeFilter"
          >
            Resetuj
          </button>
        </div>
        <p class="mb-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {{ formatHour(arrivalTimeMin) }} - {{ formatHour(arrivalTimeMax) }}
        </p>
        <div class="relative py-2">
          <!-- Tło szare -->
          <div
            class="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-lg bg-gray-200 dark:bg-gray-600"
          ></div>
          <!-- Niebieski pasek między suwakami -->
          <div
            class="absolute top-1/2 h-1 -translate-y-1/2 rounded-lg bg-blue-600"
            :style="{
              left: `${(arrivalTimeMin / 24) * 100}%`,
              right: `${100 - (arrivalTimeMax / 24) * 100}%`,
            }"
          ></div>
          <!-- Suwak MIN -->
          <input
            type="range"
            :value="arrivalTimeMin"
            min="0"
            max="24"
            class="dual-range-slider"
            style="z-index: 3"
            @input="updateArrivalMin(Number(($event.target as HTMLInputElement).value))"
          />
          <!-- Suwak MAX -->
          <input
            type="range"
            :value="arrivalTimeMax"
            min="0"
            max="24"
            class="dual-range-slider"
            style="z-index: 4"
            @input="updateArrivalMax(Number(($event.target as HTMLInputElement).value))"
          />
        </div>
        <div class="mt-1 flex justify-between text-xs text-gray-500">
          <span>00:00</span>
          <span>24:00</span>
        </div>
      </div>

      <!-- Linie lotnicze -->
      <div v-if="availableAirlines.length > 0" class="mb-6">
        <div class="mb-4 flex items-center justify-between">
          <p class="text-base font-medium text-gray-900 dark:text-white">Linie lotnicze</p>
          <button
            v-if="hasAirlinesFilter"
            class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
            @click="resetAirlinesFilter"
          >
            Resetuj
          </button>
        </div>
        <div class="max-h-48 space-y-2 overflow-y-auto">
          <label
            v-for="airline in availableAirlines"
            :key="airline.code"
            class="group flex cursor-pointer items-center justify-between"
          >
            <div class="flex items-center">
              <input
                type="checkbox"
                :checked="isAirlineSelected(airline.code)"
                class="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-0 focus:ring-offset-0"
                @change="toggleAirlineFilter(airline.code)"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {{ getAirlineName(airline.code) }}
              </span>
            </div>
            <button
              class="text-xs text-blue-600 opacity-0 transition-opacity hover:text-blue-700 group-hover:opacity-100 dark:text-blue-400"
              @click.stop="selectOnlyAirline(airline.code)"
            >
              TYLKO
            </button>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { FlightFiltersType } from '@/types/flight';
import { getAirlineName } from '@/data/airlines';

interface Props {
  modelValue: FlightFiltersType;
  availableAirlines?: Array<{ code: string; name: string }>;
  availableStops?: Array<{ stops: number; minPrice: number; count: number }>;
}

const props = withDefaults(defineProps<Props>(), {
  availableAirlines: () => [],
  availableStops: () => [],
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: FlightFiltersType): void;
  (e: 'reset'): void;
}>();

// Godziny jako pojedyncze wartości (0-24)
const departureTimeMin = ref(0);
const departureTimeMax = ref(24);
const arrivalTimeMin = ref(0);
const arrivalTimeMax = ref(24);

// Inicjalizacja z modelValue jeśli istnieje
watch(
  () => props.modelValue.departureTimeRange,
  newVal => {
    if (newVal) {
      departureTimeMin.value = newVal[0];
      departureTimeMax.value = newVal[1];
    }
  },
  { immediate: true }
);

watch(
  () => props.modelValue.arrivalTimeRange,
  newVal => {
    if (newVal) {
      arrivalTimeMin.value = newVal[0];
      arrivalTimeMax.value = newVal[1];
    }
  },
  { immediate: true }
);

// Opcje przesiadek z dynamicznymi cenami
const stopsOptions = computed(() => {
  if (props.availableStops.length > 0) {
    return props.availableStops.map(stop => ({
      stops: stop.stops,
      label:
        stop.stops === 0 ? 'Bezpośredni' : `${stop.stops} przesiadka${stop.stops > 1 ? 'i' : ''}`,
      minPrice: stop.minPrice,
      count: stop.count,
    }));
  }

  return [];
});

// Sprawdzanie czy filtry są aktywne
const hasStopsFilter = computed(() => {
  return (props.modelValue.excludedStops?.length ?? 0) > 0;
});

const hasPriceFilter = computed(() => {
  return (
    (props.modelValue.priceMin !== null &&
      props.modelValue.priceMin !== undefined &&
      props.modelValue.priceMin > 0) ||
    (props.modelValue.priceMax !== null && props.modelValue.priceMax !== undefined)
  );
});

const hasDurationFilter = computed(() => {
  return props.modelValue.maxDuration !== null && props.modelValue.maxDuration !== undefined;
});

const hasDepartureTimeFilter = computed(() => {
  return departureTimeMin.value > 0 || departureTimeMax.value < 24;
});

const hasArrivalTimeFilter = computed(() => {
  return arrivalTimeMin.value > 0 || arrivalTimeMax.value < 24;
});

const hasAirlinesFilter = computed(() => {
  return (props.modelValue.excludedAirlines?.length ?? 0) > 0;
});

const hasAnyFilters = computed(() => {
  return (
    hasStopsFilter.value ||
    hasPriceFilter.value ||
    hasDurationFilter.value ||
    hasDepartureTimeFilter.value ||
    hasArrivalTimeFilter.value ||
    hasAirlinesFilter.value
  );
});

// Formatowanie godziny do wyświetlenia (np. 14 => "14:00")
const formatHour = (hour: number): string => {
  return `${String(Math.floor(hour)).padStart(2, '0')}:00`;
};

// Aktualizacja zakresu godzin wylotu
const updateDepartureMin = (value: number) => {
  if (value < departureTimeMax.value) {
    departureTimeMin.value = value;
    emit('update:modelValue', {
      ...props.modelValue,
      departureTimeRange: [departureTimeMin.value, departureTimeMax.value],
    });
  }
};

const updateDepartureMax = (value: number) => {
  if (value > departureTimeMin.value) {
    departureTimeMax.value = value;
    emit('update:modelValue', {
      ...props.modelValue,
      departureTimeRange: [departureTimeMin.value, departureTimeMax.value],
    });
  }
};

// Aktualizacja zakresu godzin przylotu
const updateArrivalMin = (value: number) => {
  if (value < arrivalTimeMax.value) {
    arrivalTimeMin.value = value;
    emit('update:modelValue', {
      ...props.modelValue,
      arrivalTimeRange: [arrivalTimeMin.value, arrivalTimeMax.value],
    });
  }
};

const updateArrivalMax = (value: number) => {
  if (value > arrivalTimeMin.value) {
    arrivalTimeMax.value = value;
    emit('update:modelValue', {
      ...props.modelValue,
      arrivalTimeRange: [arrivalTimeMin.value, arrivalTimeMax.value],
    });
  }
};

// Sprawdź czy opcja przesiadek jest zaznaczona
const isStopOptionSelected = (stops: number): boolean => {
  const excluded = props.modelValue.excludedStops || [];
  return !excluded.includes(stops);
};

// Toggle opcji przesiadek
const toggleStopFilter = (stops: number) => {
  const excluded = props.modelValue.excludedStops || [];
  const isCurrentlyExcluded = excluded.includes(stops);

  let newExcluded: number[];
  if (isCurrentlyExcluded) {
    newExcluded = excluded.filter(s => s !== stops);
  } else {
    newExcluded = [...excluded, stops];
  }

  emit('update:modelValue', { ...props.modelValue, excludedStops: newExcluded });
};

// Sprawdź czy linia lotnicza jest zaznaczona
const isAirlineSelected = (airlineCode: string): boolean => {
  const excluded = props.modelValue.excludedAirlines || [];
  return !excluded.includes(airlineCode);
};

// Toggle linii lotniczej
const toggleAirlineFilter = (airlineCode: string) => {
  const excluded = props.modelValue.excludedAirlines || [];
  const isCurrentlyExcluded = excluded.includes(airlineCode);

  let newExcluded: string[];
  if (isCurrentlyExcluded) {
    newExcluded = excluded.filter(code => code !== airlineCode);
  } else {
    newExcluded = [...excluded, airlineCode];
  }

  emit('update:modelValue', { ...props.modelValue, excludedAirlines: newExcluded });
};

// Wybierz tylko jedną linię lotniczą
const selectOnlyAirline = (airlineCode: string) => {
  // Wyklucz wszystkie linie poza wybraną
  const allAirlineCodesExceptSelected = props.availableAirlines
    .map(a => a.code)
    .filter(code => code !== airlineCode);

  emit('update:modelValue', {
    ...props.modelValue,
    excludedAirlines: allAirlineCodesExceptSelected,
  });
};

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

// Resetowanie poszczególnych filtrów
const resetStopsFilter = () => {
  emit('update:modelValue', { ...props.modelValue, excludedStops: [] });
};

const resetPriceFilter = () => {
  emit('update:modelValue', {
    ...props.modelValue,
    priceMin: undefined,
    priceMax: undefined,
  });
};

const resetDurationFilter = () => {
  emit('update:modelValue', { ...props.modelValue, maxDuration: undefined });
};

const resetDepartureTimeFilter = () => {
  departureTimeMin.value = 0;
  departureTimeMax.value = 24;
  emit('update:modelValue', {
    ...props.modelValue,
    departureTimeRange: undefined,
  });
};

const resetArrivalTimeFilter = () => {
  arrivalTimeMin.value = 0;
  arrivalTimeMax.value = 24;
  emit('update:modelValue', {
    ...props.modelValue,
    arrivalTimeRange: undefined,
  });
};

const resetAirlinesFilter = () => {
  emit('update:modelValue', { ...props.modelValue, excludedAirlines: [] });
};

// Resetowanie wszystkich filtrów
const resetFilters = () => {
  departureTimeMin.value = 0;
  departureTimeMax.value = 24;
  arrivalTimeMin.value = 0;
  arrivalTimeMax.value = 24;
  emit('reset');
};
</script>

<style scoped>
/* Dual Range Slider Styling */
.dual-range-slider {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

/* Thumb styling for WebKit browsers (Chrome, Safari, Edge) */
.dual-range-slider::-webkit-slider-thumb {
  appearance: none;
  pointer-events: auto;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #2563eb;
  border: none;
  cursor: pointer;
  margin-top: -5.5px;
}

/* Track styling for WebKit */
.dual-range-slider::-webkit-slider-runnable-track {
  width: 100%;
  height: 3px;
  background: transparent;
}

/* Thumb styling for Firefox */
.dual-range-slider::-moz-range-thumb {
  appearance: none;
  pointer-events: auto;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #2563eb;
  border: none;
  cursor: pointer;
}

/* Track styling for Firefox */
.dual-range-slider::-moz-range-track {
  width: 100%;
  height: 3px;
  background: transparent;
}

/* Focus states */
.dual-range-slider:focus {
  outline: none;
}

/* Active/hover states */
.dual-range-slider::-webkit-slider-thumb:hover {
  background: #1d4ed8;
}

.dual-range-slider::-moz-range-thumb:hover {
  background: #1d4ed8;
}

.dual-range-slider::-webkit-slider-thumb:active {
  background: #1e40af;
}

.dual-range-slider::-moz-range-thumb:active {
  background: #1e40af;
}
</style>
