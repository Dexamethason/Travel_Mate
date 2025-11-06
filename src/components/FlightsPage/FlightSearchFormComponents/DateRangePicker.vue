<template>
  <div class="relative flex min-w-64 flex-1 flex-col" @click.stop>
    <p class="pb-2 text-base font-medium leading-normal text-gray-900 dark:text-white">
      Termin podróży
    </p>
    <button
      type="button"
      class="flex h-12 w-full items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 text-left text-gray-900 transition-colors focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
      @click="toggleCalendar"
    >
      <CalendarIcon class="h-5 w-5 flex-shrink-0 text-gray-400" />
      <span v-if="departure && returnDate" class="flex-1 truncate">
        {{ formatDate(departure) }} — {{ formatDate(returnDate) }}
      </span>
      <span v-else-if="departure" class="flex-1 truncate">
        {{ formatDate(departure) }} — Wybierz datę powrotu
      </span>
      <span v-else class="flex-1 text-gray-500 dark:text-gray-400">Wybierz daty</span>
    </button>

    <!-- Kalendarz -->
    <Teleport to="body">
      <div
        v-if="showCalendar"
        ref="calendarRef"
        :style="calendarPosition"
        class="fixed z-50 rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800"
      >
        <!-- Nagłówek z datami -->
        <div
          class="mb-4 flex justify-center gap-8 border-b border-gray-200 pb-4 dark:border-gray-700"
        >
          <div class="text-center">
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Wylot</p>
            <p class="text-base font-bold text-gray-900 dark:text-white">
              {{ tempDeparture ? formatDateFull(tempDeparture) : 'Wybierz datę' }}
            </p>
          </div>
          <div class="text-center">
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
            <span class="font-semibold text-gray-900 dark:text-white">
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

        <!-- Dwa miesiące -->
        <div class="flex gap-4">
          <CalendarMonth
            :month="currentMonth"
            :year="currentYear"
            :selected-start="tempDeparture"
            :selected-end="tempReturn"
            @select-date="selectDate"
          />
          <CalendarMonth
            :month="nextMonth"
            :year="nextMonthYear"
            :selected-start="tempDeparture"
            :selected-end="tempReturn"
            @select-date="selectDate"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';
import CalendarMonth from './CalendarMonth.vue';
import { useActivePanel } from '../../../composables/useActivePanel';

interface Props {
  departure: string;
  returnDate: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:departure', value: string): void;
  (e: 'update:returnDate', value: string): void;
}>();

const { setActivePanel, isActive, closePanel } = useActivePanel();

const showCalendar = ref(false);
const currentMonth = ref<number>(new Date().getMonth());
const currentYear = ref<number>(new Date().getFullYear());
const tempDeparture = ref<string>('');
const tempReturn = ref<string>('');
const calendarRef = ref<HTMLElement | null>(null);
const buttonRef = ref<HTMLElement | null>(null);
const calendarPosition = ref({
  top: '0px',
  left: '0px',
  transform: '',
  maxHeight: '',
  overflowY: 'auto' as 'auto' | 'visible',
});

const months = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
];

const nextMonth = computed<number>(() => {
  return currentMonth.value === 11 ? 0 : currentMonth.value + 1;
});

const nextMonthYear = computed<number>(() => {
  return currentMonth.value === 11 ? currentYear.value + 1 : currentYear.value;
});

// Obserwuj zmiany aktywnego panelu
watch(
  () => isActive('calendar'),
  active => {
    if (!active && showCalendar.value) {
      showCalendar.value = false;
    }
  }
);

const updateCalendarPosition = () => {
  if (!buttonRef.value) return;

  const rect = buttonRef.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  const calendarHeight = 600;
  const calendarWidth = 600;
  const padding = 16;
  const minSpaceRequired = 350; // Minimalna przestrzeń potrzebna do otwarcia w dół

  let top = rect.bottom + 8;
  let left = rect.left;
  let transform = '';
  let maxHeight = '';
  let overflowY: 'auto' | 'visible' = 'visible';

  const spaceBelow = viewportHeight - rect.bottom - padding;
  const spaceAbove = rect.top - padding;

  // ZAWSZE próbuj otworzyć w dół, chyba że naprawdę nie ma miejsca
  if (spaceBelow >= minSpaceRequired) {
    // Jest wystarczająco miejsca w dół - otwórz w dół
    if (spaceBelow < calendarHeight) {
      maxHeight = `${spaceBelow - padding}px`;
      overflowY = 'auto';
    }
  } else if (spaceAbove > spaceBelow && spaceAbove >= minSpaceRequired) {
    // Bardzo mało miejsca w dół, ale jest wystarczająco w górę - otwórz w górę
    top = rect.top - padding;
    transform = 'translateY(-100%)';
    maxHeight = `${Math.min(spaceAbove - padding, calendarHeight)}px`;
    overflowY = 'auto';
  } else {
    // Mało miejsca w obu kierunkach - wybierz większą przestrzeń
    if (spaceBelow >= spaceAbove) {
      // Preferuj w dół
      maxHeight = `${spaceBelow - padding}px`;
      overflowY = 'auto';
    } else {
      // Otwórz w górę
      top = rect.top - padding;
      transform = 'translateY(-100%)';
      maxHeight = `${spaceAbove - padding}px`;
      overflowY = 'auto';
    }
  }

  // Sprawdź czy kalendarz się zmieści poziomo
  if (left + calendarWidth > viewportWidth - padding) {
    left = Math.max(padding, viewportWidth - calendarWidth - padding);
  }

  // Dla bardzo małych ekranów - wyśrodkuj
  if (viewportWidth < 768) {
    left = viewportWidth / 2;
    transform = transform ? `${transform} translateX(-50%)` : 'translateX(-50%)';
  }

  calendarPosition.value = {
    top: `${top}px`,
    left: `${left}px`,
    transform,
    maxHeight,
    overflowY,
  };
};

const toggleCalendar = (event: Event) => {
  event.stopPropagation();
  const target = event.currentTarget as HTMLElement;
  buttonRef.value = target;

  if (showCalendar.value) {
    showCalendar.value = false;
    closePanel();
  } else {
    showCalendar.value = true;
    setActivePanel('calendar');
    tempDeparture.value = props.departure || tempDeparture.value;
    tempReturn.value = props.returnDate || tempReturn.value;
    nextTick(() => {
      updateCalendarPosition();
    });
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
};

const formatDateFull = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const selectDate = (date: string) => {
  if (!date) return;

  if (!tempDeparture.value || (tempDeparture.value && tempReturn.value)) {
    tempDeparture.value = date;
    tempReturn.value = '';
    emit('update:departure', date);
  } else if (date < tempDeparture.value) {
    tempDeparture.value = date;
    tempReturn.value = '';
    emit('update:departure', date);
  } else {
    tempReturn.value = date;
    emit('update:returnDate', date);
    showCalendar.value = false;
    closePanel();
  }
};

const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonthFn = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (
    showCalendar.value &&
    calendarRef.value &&
    !calendarRef.value.contains(target) &&
    buttonRef.value &&
    !buttonRef.value.contains(target)
  ) {
    showCalendar.value = false;
    closePanel();
  }
};

onMounted(() => {
  tempDeparture.value = props.departure;
  tempReturn.value = props.returnDate;
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', updateCalendarPosition);
  window.addEventListener('scroll', updateCalendarPosition, true);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', updateCalendarPosition);
  window.removeEventListener('scroll', updateCalendarPosition, true);
});
</script>
