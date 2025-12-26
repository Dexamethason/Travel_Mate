<template>
  <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
    <div v-if="showHeader" class="mb-4 text-center">
      <h2 class="mb-1 text-3xl font-bold leading-tight text-gray-900 dark:text-white">
        Znajdź idealne noclegi
      </h2>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Wyszukaj najlepsze oferty noclegów w wymarzonym miejscu
      </p>
    </div>

    <!-- Jedna linia z polami -->
    <div class="flex flex-wrap items-end gap-3 rounded-lg bg-white px-2 py-2 dark:bg-gray-800">
      <!-- Miejsce docelowe -->
      <label class="relative flex min-w-56 flex-1 flex-col">
        <p class="mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Miejsce docelowe
        </p>
        <input
          v-model="localForm.destination"
          ref="destinationInputRef"
          class="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="Miasto lub region (np. Paryż)"
          @input="handleDestinationInput"
          @keyup.enter="handleSearchClick"
          @focus="showSuggestions = true"
          @blur="handleDestinationBlur"
        />
        <!-- Lista sugestii -->
        <div
          v-if="showSuggestions && filteredSuggestions.length > 0"
          class="absolute top-full z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <button
            v-for="(suggestion, index) in filteredSuggestions"
            :key="index"
            type="button"
            class="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
            @click="selectSuggestion(suggestion)"
          >
            {{ suggestion }}
          </button>
        </div>
      </label>

      <!-- Termin (bez napisu „pobytu”) -->
      <div class="min-w-56 flex-1">
        <DateRangePicker
          :departure="localForm.checkIn"
          :return-date="localForm.checkOut"
          trip-type="roundTrip"
          @update:departure="localForm.checkIn = $event"
          @update:return-date="localForm.checkOut = $event"
        />
      </div>

      <!-- Goście -->
      <div class="relative min-w-40 flex-1">
        <p class="mb-2 text-sm font-medium text-gray-900 dark:text-white">Goście</p>
        <button
          ref="travelersButtonRef"
          type="button"
          class="flex h-12 w-full items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 text-left text-gray-900 transition-colors focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
          @click="toggleTravelers"
        >
          <UserGroupIcon class="h-5 w-5 flex-shrink-0 text-gray-400" />
          <span class="flex-1 text-sm">
            {{ totalGuests }} goś{{ totalGuests !== 1 ? 'ci' : 'ć' }}
          </span>
        </button>

        <!-- Panel gości -->
        <div
          v-if="showTravelers"
          ref="travelersRef"
          class="absolute z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800"
          @click.stop
        >
          <TravelersSelector
            :adults="localForm.adults"
            :children="localForm.children"
            @update="updateTravelers"
          />
        </div>
      </div>

      <!-- Przycisk szukaj -->
      <div class="w-full min-w-36 sm:w-auto">
        <button
          :disabled="loading || !isSearchFormValid"
          class="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          @click="handleSearchClick"
        >
          <span v-if="loading" class="inline-flex items-center gap-2">
            <span
              class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            ></span>
            Szukanie...
          </span>
          <span v-else>Szukaj</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { UserGroupIcon } from '@heroicons/vue/24/outline';
import DateRangePicker from '@/components/FlightsPage/FlightSearchFormComponents/DateRangePicker.vue';
import TravelersSelector from '@/components/FlightsPage/FlightSearchFormComponents/TravelersSelector.vue';
import { useActivePanel } from '@/composables/useActivePanel';

interface AccommodationsSearchForm {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}

interface Props {
  modelValue: AccommodationsSearchForm;
  loading?: boolean;
  showHeader?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showHeader: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: AccommodationsSearchForm): void;
  (e: 'search'): void;
}>();

const localForm = ref<AccommodationsSearchForm>({ ...props.modelValue });

const showTravelers = ref(false);
const travelersButtonRef = ref<HTMLElement | null>(null);
const travelersRef = ref<HTMLElement | null>(null);
const destinationInputRef = ref<HTMLInputElement | null>(null);

// Lista popularnych miast
const popularCities = [
  'Warszawa', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań', 'Łódź', 'Katowice', 'Lublin',
  'Białystok', 'Szczecin', 'Bydgoszcz', 'Toruń', 'Zakopane', 'Sopot', 'Gdynia',
  'Paryż', 'Londyn', 'Berlin', 'Rzym', 'Madryt', 'Barcelona', 'Amsterdam', 'Wiedeń',
  'Praga', 'Budapeszt', 'Sztokholm', 'Kopenhaga', 'Oslo', 'Helsinki', 'Dublin',
  'Lizbona', 'Ateny', 'Istanbul', 'Dubaj', 'Nowy Jork', 'Los Angeles', 'Chicago',
  'Miami', 'Las Vegas', 'San Francisco', 'Boston', 'Seattle', 'Toronto', 'Vancouver',
  'Sydney', 'Melbourne', 'Tokio', 'Seul', 'Singapur', 'Bangkok', 'Hongkong',
  'Bombaj', 'Delhi', 'Kair', 'Kapsztad', 'Rio de Janeiro', 'São Paulo', 'Buenos Aires'
];

const showSuggestions = ref(false);
const filteredSuggestions = ref<string[]>([]);

const { setActivePanel, isActive, closePanel } = useActivePanel();

const totalGuests = computed(
  () => localForm.value.adults + localForm.value.children
);

const isSearchFormValid = computed(() => {
  return localForm.value.destination.trim() !== '' && localForm.value.adults > 0;
});

watch(
  localForm,
  newValue => {
    emit('update:modelValue', { ...newValue });
  },
  { deep: true }
);

watch(
  () => isActive('travelers'),
  (active: boolean) => {
    if (!active && showTravelers.value) {
      showTravelers.value = false;
    }
  }
);

const toggleTravelers = (event: Event) => {
  event.stopPropagation();
  if (showTravelers.value) {
    showTravelers.value = false;
    closePanel();
  } else {
    showTravelers.value = true;
    setActivePanel('travelers');
  }
};

const updateTravelers = (value: { adults: number; children: number }) => {
  localForm.value.adults = value.adults;
  localForm.value.children = value.children;
  showTravelers.value = false;
  closePanel();
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;

  if (
    showTravelers.value &&
    travelersRef.value &&
    !travelersRef.value.contains(target) &&
    travelersButtonRef.value &&
    !travelersButtonRef.value.contains(target)
  ) {
    showTravelers.value = false;
    closePanel();
  }
};

/**
 * Normalizuje polskie znaki diakrytyczne do ich odpowiedników bez znaków
 * np. "Kraków" -> "krakow", "Łódź" -> "lodz"
 */
const normalizePolishChars = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Usuwa znaki diakrytyczne
    .replace(/ą/g, 'a')
    .replace(/ć/g, 'c')
    .replace(/ę/g, 'e')
    .replace(/ł/g, 'l')
    .replace(/ń/g, 'n')
    .replace(/ó/g, 'o')
    .replace(/ś/g, 's')
    .replace(/ź/g, 'z')
    .replace(/ż/g, 'z');
};

const handleDestinationInput = () => {
  const query = localForm.value.destination.trim();
  if (query.length > 0) {
    const normalizedQuery = normalizePolishChars(query);
    filteredSuggestions.value = popularCities
      .filter(city => {
        const normalizedCity = normalizePolishChars(city);
        return normalizedCity.includes(normalizedQuery);
      })
      .slice(0, 8); // Maksymalnie 8 sugestii
    showSuggestions.value = true;
  } else {
    filteredSuggestions.value = [];
    showSuggestions.value = false;
  }
};

const selectSuggestion = (suggestion: string) => {
  localForm.value.destination = suggestion;
  showSuggestions.value = false;
  destinationInputRef.value?.blur();
};

const handleDestinationBlur = () => {
  // Opóźnienie, aby umożliwić kliknięcie w sugestię
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
};

const handleSearchClick = () => {
  if (!isSearchFormValid.value || props.loading) return;
  showSuggestions.value = false;
  emit('search');
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
