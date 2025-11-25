<template>
  <div class="rounded-lg bg-white p-8 shadow-sm dark:bg-gray-800">
    <!-- Nagłówki - pokazują się tylko przed wyszukaniem -->
    <div v-if="showHeader">
      <h2 class="mb-4 text-center text-3xl font-bold text-gray-900 dark:text-white">
        Znajdź idealny lot
      </h2>
      <p class="mb-8 text-center text-sm text-gray-600 dark:text-gray-400">
        Wyszukaj najlepsze oferty lotów do wymarzonego miejsca
      </p>
    </div>

    <!-- Typ lotu -->
    <div class="mb-6 flex justify-center gap-6">
      <label class="flex cursor-pointer items-center">
        <input
          v-model="localForm.tripType"
          type="radio"
          value="roundTrip"
          class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
        />
        <span class="ml-2 text-sm font-medium text-gray-900 dark:text-white">W obie strony</span>
      </label>
      <label class="flex cursor-pointer items-center">
        <input
          v-model="localForm.tripType"
          type="radio"
          value="oneWay"
          class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
        />
        <span class="ml-2 text-sm font-medium text-gray-900 dark:text-white">W jedną stronę</span>
      </label>
    </div>

    <!-- Jedna linia z wszystkimi polami -->
    <div class="flex items-end gap-3">
      <!-- Wylot z -->
      <LocationInput
        v-model="localForm.from"
        label="Wylot z"
        placeholder="Warszawa"
        :has-error="!!fieldErrors.from"
        @update:model-value="clearFieldError('from')"
      />

      <!-- Strzałka swap -->
      <div class="flex h-12 items-center pb-0">
        <button
          type="button"
          class="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          @click="swapLocations"
        >
          <ArrowsRightLeftIcon class="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <!-- Lot do -->
      <LocationInput
        v-model="localForm.to"
        label="Lot do"
        placeholder="Paryż"
        :has-error="!!fieldErrors.to"
        @update:model-value="clearFieldError('to')"
      />

      <!-- Termin podróży -->
      <div class="relative flex-1">
        <p class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Termin podróży
          <span v-if="fieldErrors.dates" class="text-red-600 dark:text-red-400">*</span>
        </p>
        <button
          ref="dateButtonRef"
          type="button"
          :class="[
            'flex h-12 w-full items-center gap-3 rounded-lg border px-4 text-left text-gray-900 transition-colors focus:outline-none dark:bg-gray-700 dark:text-white',
            fieldErrors.dates
              ? 'border-red-500 bg-red-50 focus:border-red-500 dark:border-red-700 dark:bg-red-900/20'
              : 'border-gray-300 bg-white focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-500',
          ]"
          @click="toggleCalendar"
        >
          <CalendarIcon
            :class="['h-5 w-5 flex-shrink-0', fieldErrors.dates ? 'text-red-400' : 'text-gray-400']"
          />
          <span
            v-if="localForm.tripType === 'oneWay' && localForm.departure"
            class="flex-1 truncate text-sm"
          >
            {{ formatDate(localForm.departure) }}
          </span>
          <span v-else-if="localForm.departure && localForm.return" class="flex-1 truncate text-sm">
            {{ formatDate(localForm.departure) }} — {{ formatDate(localForm.return) }}
          </span>
          <span
            v-else-if="localForm.departure && !localForm.return"
            class="flex-1 truncate text-sm"
          >
            {{ formatDate(localForm.departure) }} —
            <span class="text-gray-500">Wybierz datę powrotu</span>
          </span>
          <span v-else class="flex-1 text-sm text-gray-500 dark:text-gray-400">Wybierz daty</span>
        </button>

        <!-- Kalendarz jako popup -->
        <Teleport to="body">
          <div
            v-if="showCalendar"
            ref="calendarRef"
            :style="calendarPosition"
            class="fixed z-50 rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800"
            @click.stop
          >
            <!-- Nagłówek z datami -->
            <div
              class="mb-4 flex justify-center border-b border-gray-200 pb-4 dark:border-gray-700"
              :class="localForm.tripType === 'oneWay' ? 'gap-4' : 'gap-8'"
            >
              <div class="text-center">
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Wylot</p>
                <p class="text-base font-bold text-gray-900 dark:text-white">
                  {{ tempDeparture ? formatDateFull(tempDeparture) : 'Wybierz datę' }}
                </p>
              </div>
              <div v-if="localForm.tripType === 'roundTrip'" class="text-center">
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Powrót</p>
                <p class="text-base font-bold text-gray-900 dark:text-white">
                  {{ tempReturn ? formatDateFull(tempReturn) : 'Wybierz datę' }}
                </p>
              </div>
            </div>

            <!-- Nawigacja miesięcy -->
            <div class="mb-4 flex items-center justify-between">
              <button
                type="button"
                class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="previousMonth"
              >
                <ChevronLeftIcon class="h-5 w-5" />
              </button>

              <div class="flex gap-8">
                <span class="font-semibold text-gray-900 dark:text-white">
                  {{ months[currentMonth] }} {{ currentYear }}
                </span>
                <span
                  v-if="localForm.tripType === 'roundTrip'"
                  class="font-semibold text-gray-900 dark:text-white"
                >
                  {{ months[nextMonth] }} {{ nextMonthYear }}
                </span>
              </div>

              <button
                type="button"
                class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="nextMonthFn"
              >
                <ChevronRightIcon class="h-5 w-5" />
              </button>
            </div>

            <!-- Jeden lub dwa miesiące -->
            <div class="flex gap-4">
              <CalendarMonth
                :month="currentMonth"
                :year="currentYear"
                :selected-start="tempDeparture"
                :selected-end="localForm.tripType === 'roundTrip' ? tempReturn : ''"
                :trip-type="localForm.tripType"
                @select-date="selectDate"
              />
              <CalendarMonth
                v-if="localForm.tripType === 'roundTrip'"
                :month="nextMonth"
                :year="nextMonthYear"
                :selected-start="tempDeparture"
                :selected-end="tempReturn"
                :trip-type="localForm.tripType"
                @select-date="selectDate"
              />
            </div>
          </div>
        </Teleport>
      </div>

      <!-- Pasażerowie -->
      <div class="relative flex-1">
        <p class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Pasażerowie</p>
        <button
          ref="travelersButtonRef"
          type="button"
          class="flex h-12 w-full items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 text-left text-gray-900 transition-colors focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
          @click="toggleTravelers"
        >
          <UserGroupIcon class="h-5 w-5 flex-shrink-0 text-gray-400" />
          <span class="flex-1 text-sm">
            {{ localForm.adults + localForm.children }} pasażer{{
              localForm.adults + localForm.children !== 1 ? 'ów' : ''
            }}
          </span>
        </button>

        <!-- Panel pasażerów jako popup -->
        <Teleport to="body">
          <div
            v-if="showTravelers"
            ref="travelersRef"
            :style="travelersPosition"
            class="fixed z-50 w-80 rounded-lg border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800"
            @click.stop
          >
            <TravelersSelector
              :adults="localForm.adults"
              :children="localForm.children"
              @update="updateTravelers"
            />
          </div>
        </Teleport>
      </div>

      <!-- Przycisk szukaj -->
      <div>
        <button
          class="flex h-12 items-center gap-2 rounded-lg bg-blue-600 px-10 text-base font-bold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="handleSearch"
        >
          <MagnifyingGlassIcon class="h-5 w-5" />
          <span>Szukaj</span>
        </button>
      </div>
    </div>

    <!-- Komunikaty błędów POD całą linią -->
    <Transition name="error">
      <div v-if="hasErrors" class="mt-3 flex gap-3">
        <div class="flex-1">
          <p v-if="fieldErrors.from" class="text-xs text-red-600 dark:text-red-400">
            {{ fieldErrors.from }}
          </p>
        </div>
        <div class="w-[56px]"></div>
        <div class="flex-1">
          <p v-if="fieldErrors.to" class="text-xs text-red-600 dark:text-red-400">
            {{ fieldErrors.to }}
          </p>
        </div>
        <div class="flex-1">
          <p v-if="fieldErrors.dates" class="text-xs text-red-600 dark:text-red-400">
            {{ fieldErrors.dates }}
          </p>
        </div>
        <div class="flex-1"></div>
        <div class="w-[146px]"></div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import {
  CalendarIcon,
  UserGroupIcon,
  ArrowsRightLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/vue/24/outline';
import CalendarMonth from './FlightSearchFormComponents/CalendarMonth.vue';
import TravelersSelector from './FlightSearchFormComponents/TravelersSelector.vue';
import LocationInput from './FlightSearchFormComponents/LocationInput.vue';
import type { SearchForm } from '@/types/flight';
import { useActivePanel } from '@/composables/useActivePanel';
import { useCalendar } from '@/composables/useCalendar';
import { usePopupPosition } from '@/composables/usePopupPosition';
import { useFormValidation } from '@/composables/useFormValidation';

interface Props {
  modelValue: SearchForm;
  showHeader?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showHeader: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: SearchForm): void;
  (e: 'search'): void;
}>();

// Composables
const { setActivePanel, isActive, closePanel } = useActivePanel();
const {
  currentMonth,
  currentYear,
  months,
  nextMonth,
  nextMonthYear,
  previousMonth,
  nextMonthFn,
  formatDate,
  formatDateFull,
} = useCalendar();
const { updatePosition } = usePopupPosition();
const { fieldErrors, validateSearchForm, clearFieldError } = useFormValidation();

// Reactive state
const localForm = ref<SearchForm>({ ...props.modelValue });
const showCalendar = ref(false);
const showTravelers = ref(false);
const dateButtonRef = ref<HTMLElement | null>(null);
const travelersButtonRef = ref<HTMLElement | null>(null);
const calendarRef = ref<HTMLElement | null>(null);
const travelersRef = ref<HTMLElement | null>(null);
const calendarPosition = ref({ top: '0px', left: '0px' });
const travelersPosition = ref({ top: '0px', left: '0px' });
const tempDeparture = ref<string>('');
const tempReturn = ref<string>('');

// Computed
const hasErrors = computed(() => Object.keys(fieldErrors.value).length > 0);

// Watchers
watch(
  () => props.modelValue,
  newValue => {
    localForm.value = { ...newValue };
  },
  { deep: true }
);

watch(
  localForm,
  newValue => {
    emit('update:modelValue', { ...newValue });
  },
  { deep: true }
);

watch(
  () => localForm.value.tripType,
  newType => {
    if (newType === 'oneWay') {
      localForm.value.return = '';
    } else {
      if (localForm.value.departure && !localForm.value.return) {
        const departureDate = new Date(localForm.value.departure);
        const returnDate = new Date(departureDate);
        returnDate.setDate(departureDate.getDate() + 7);
        const year = returnDate.getFullYear();
        const month = String(returnDate.getMonth() + 1).padStart(2, '0');
        const day = String(returnDate.getDate()).padStart(2, '0');
        localForm.value.return = `${year}-${month}-${day}`;
      }
    }
  }
);

watch(
  () => isActive('calendar'),
  active => {
    if (!active && showCalendar.value) {
      showCalendar.value = false;
      if (tempDeparture.value) {
        localForm.value.departure = tempDeparture.value;
        clearFieldError('dates');
      }
      if (tempReturn.value || localForm.value.tripType === 'oneWay') {
        localForm.value.return = tempReturn.value;
        clearFieldError('dates');
      }
    }
  }
);

watch(
  () => isActive('travelers'),
  active => {
    if (!active && showTravelers.value) {
      showTravelers.value = false;
    }
  }
);

// Methods
const swapLocations = () => {
  const temp = localForm.value.from;
  localForm.value.from = localForm.value.to;
  localForm.value.to = temp;
};

const toggleCalendar = (event: Event) => {
  event.stopPropagation();
  clearFieldError('dates');
  if (showCalendar.value) {
    showCalendar.value = false;
    closePanel();
  } else {
    showTravelers.value = false;
    showCalendar.value = true;
    setActivePanel('calendar');
    tempDeparture.value = localForm.value.departure;
    tempReturn.value = localForm.value.return;
    nextTick(() => {
      const popupWidth = localForm.value.tripType === 'oneWay' ? 350 : 650;
      updatePosition(dateButtonRef.value, calendarPosition, popupWidth);
    });
  }
};

const toggleTravelers = (event: Event) => {
  event.stopPropagation();
  if (showTravelers.value) {
    showTravelers.value = false;
    closePanel();
  } else {
    showCalendar.value = false;
    showTravelers.value = true;
    setActivePanel('travelers');
    nextTick(() => {
      updatePosition(travelersButtonRef.value, travelersPosition, 320);
    });
  }
};

const selectDate = (date: string) => {
  if (!date) return;

  if (localForm.value.tripType === 'oneWay') {
    tempDeparture.value = date;
    localForm.value.departure = date;
    localForm.value.return = '';
    showCalendar.value = false;
    closePanel();
    clearFieldError('dates');
  } else {
    if (!tempDeparture.value || (tempDeparture.value && tempReturn.value)) {
      tempDeparture.value = date;
      tempReturn.value = '';
      localForm.value.departure = date;
      localForm.value.return = '';
    } else if (date < tempDeparture.value) {
      tempDeparture.value = date;
      tempReturn.value = '';
      localForm.value.departure = date;
      localForm.value.return = '';
    } else {
      tempReturn.value = date;
      localForm.value.departure = tempDeparture.value;
      localForm.value.return = date;
      showCalendar.value = false;
      closePanel();
      clearFieldError('dates');
    }
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
    showCalendar.value &&
    calendarRef.value &&
    !calendarRef.value.contains(target) &&
    dateButtonRef.value &&
    !dateButtonRef.value.contains(target)
  ) {
    if (tempDeparture.value) {
      localForm.value.departure = tempDeparture.value;
    }
    if (tempReturn.value || localForm.value.tripType === 'oneWay') {
      localForm.value.return = tempReturn.value;
    }
    showCalendar.value = false;
    closePanel();
  }

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

const handleSearch = () => {
  if (!validateSearchForm(localForm.value)) {
    return;
  }
  emit('search');
};

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', () => {
    if (showCalendar.value) {
      const popupWidth = localForm.value.tripType === 'oneWay' ? 350 : 650;
      updatePosition(dateButtonRef.value, calendarPosition, popupWidth);
    }
    if (showTravelers.value) {
      updatePosition(travelersButtonRef.value, travelersPosition, 320);
    }
  });
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.error-enter-active,
.error-leave-active {
  transition: all 0.2s ease;
}

.error-enter-from {
  opacity: 0;
  max-height: 0;
}

.error-enter-to {
  opacity: 1;
  max-height: 100px;
}

.error-leave-from {
  opacity: 1;
  max-height: 100px;
}

.error-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
