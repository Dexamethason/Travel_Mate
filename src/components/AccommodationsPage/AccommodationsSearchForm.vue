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
      <label class="flex min-w-56 flex-1 flex-col">
        <p class="mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Miejsce docelowe
        </p>
        <input
          v-model="localForm.destination"
          class="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="Miasto lub region (np. Paryż)"
          @keyup.enter="handleSearchClick"
        />
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

const handleSearchClick = () => {
  if (!isSearchFormValid.value || props.loading) return;
  emit('search');
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
