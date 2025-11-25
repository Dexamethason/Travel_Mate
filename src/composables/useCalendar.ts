import { ref, computed } from 'vue';

export function useCalendar() {
  const currentMonth = ref<number>(new Date().getMonth());
  const currentYear = ref<number>(new Date().getFullYear());

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

  const nextMonth = computed(() => (currentMonth.value === 11 ? 0 : currentMonth.value + 1));
  const nextMonthYear = computed(() =>
    currentMonth.value === 11 ? currentYear.value + 1 : currentYear.value
  );

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

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
  };

  const formatDateFull = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return {
    currentMonth,
    currentYear,
    months,
    nextMonth,
    nextMonthYear,
    previousMonth,
    nextMonthFn,
    formatDate,
    formatDateFull,
  };
}
