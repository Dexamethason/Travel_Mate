import { ref } from 'vue';
import type { TravelPlan } from '../types/plan';

export function usePlanValidation() {
  const validationErrors = ref<Record<string, string>>({});

  const validateDeletePlan = (plan: TravelPlan | null, userId: string | null): boolean => {
    validationErrors.value = {};

    if (!plan) {
      validationErrors.value.plan = 'Plan nie został znaleziony';
      return false;
    }

    if (!plan.id) {
      validationErrors.value.plan = 'Plan nie ma przypisanego ID';
      return false;
    }

    if (!userId) {
      validationErrors.value.user = 'Musisz być zalogowany, aby usunąć plan';
      return false;
    }

    return Object.keys(validationErrors.value).length === 0;
  };

  const validateViewPlan = (plan: TravelPlan | null, userId: string | null): boolean => {
    validationErrors.value = {};

    if (!plan) {
      validationErrors.value.plan = 'Plan nie został znaleziony';
      return false;
    }

    if (!userId) {
      validationErrors.value.user = 'Musisz być zalogowany, aby wyświetlić plan';
      return false;
    }

    if (plan.userId !== userId) {
      validationErrors.value.permission = 'Nie masz uprawnień do wyświetlenia tego planu';
      return false;
    }

    return Object.keys(validationErrors.value).length === 0;
  };

  const clearValidationError = (field: string) => {
    delete validationErrors.value[field];
  };

  const clearAllErrors = () => {
    validationErrors.value = {};
  };

  return {
    validationErrors,
    validateDeletePlan,
    validateViewPlan,
    clearValidationError,
    clearAllErrors,
  };
}

