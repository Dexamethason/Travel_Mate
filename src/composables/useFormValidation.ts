import { ref } from 'vue';
import type { SearchForm } from '@/types/flight';

export function useFormValidation() {
  const fieldErrors = ref<Record<string, string>>({});

  const validateSearchForm = (form: SearchForm): boolean => {
    fieldErrors.value = {};

    if (!form.from) {
      fieldErrors.value.from = 'Wybierz miejsce wylotu';
    }
    if (!form.to) {
      fieldErrors.value.to = 'Wybierz miejsce przylotu';
    }
    if (!form.departure) {
      fieldErrors.value.dates = 'Wybierz datę wylotu';
    }
    if (form.tripType === 'roundTrip' && !form.return) {
      fieldErrors.value.dates = 'Wybierz datę powrotu';
    }

    return Object.keys(fieldErrors.value).length === 0;
  };

  const clearFieldError = (field: string) => {
    delete fieldErrors.value[field];
  };

  return { fieldErrors, validateSearchForm, clearFieldError };
}
