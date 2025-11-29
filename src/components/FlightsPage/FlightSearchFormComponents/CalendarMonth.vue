<template>
  <div class="w-64">
    <div class="mb-2 grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500">
      <div>Pn</div>
      <div>Wt</div>
      <div>Śr</div>
      <div>Cz</div>
      <div>Pt</div>
      <div>Sb</div>
      <div>Nd</div>
    </div>
    <div class="grid grid-cols-7 gap-1">
      <button
        v-for="day in monthDays"
        :key="`${month}-${day.date}`"
        type="button"
        :disabled="day.disabled"
        :class="getDayClasses(day)"
        @click="$emit('select-date', day.date)"
      >
        {{ day.day }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DayObject } from '@/types/flight';

interface Props {
  month: number;
  year: number;
  selectedStart: string;
  selectedEnd: string;
  tripType?: 'roundTrip' | 'oneWay';
}

const props = withDefaults(defineProps<Props>(), {
  tripType: 'roundTrip',
});

defineEmits<{
  (e: 'select-date', date: string): void;
}>();

const monthDays = computed<DayObject[]>(() => {
  const firstDay = new Date(props.year, props.month, 1).getDay();
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(props.year, props.month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days: DayObject[] = [];

  for (let i = 0; i < adjustedFirstDay; i++) {
    days.push({ day: '', date: '', disabled: true, isOtherMonth: true });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(props.year, props.month, day);
    date.setHours(0, 0, 0, 0);
    const dateStr = `${props.year}-${String(props.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    days.push({
      day: day.toString(),
      date: dateStr,
      disabled: date < today,
      isOtherMonth: false,
    });
  }

  return days;
});

const getDayClasses = (day: DayObject) => {
  if (day.isOtherMonth) return 'invisible';

  const isStartDate = day.date === props.selectedStart;
  const isEndDate = props.tripType === 'roundTrip' && day.date === props.selectedEnd;
  const isInRange =
    props.tripType === 'roundTrip' &&
    props.selectedStart &&
    props.selectedEnd &&
    day.date > props.selectedStart &&
    day.date < props.selectedEnd;

  return [
    'h-10 w-10 text-sm transition-colors flex items-center justify-center',
    {
      'cursor-not-allowed text-gray-300 dark:text-gray-600': day.disabled,
      'hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg':
        !day.disabled && !isStartDate && !isEndDate && !isInRange,
      'bg-blue-500 text-white font-bold rounded-lg': isStartDate && props.tripType === 'oneWay',
      'bg-blue-500 text-white font-bold rounded-l-lg':
        isStartDate && props.tripType === 'roundTrip',
      'bg-blue-500 text-white font-bold rounded-r-lg': isEndDate,
      'bg-blue-100 dark:bg-blue-900': isInRange,
    },
  ];
};
</script>
