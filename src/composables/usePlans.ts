import { ref } from 'vue';
import type { TravelPlan, PlannerInput } from '../types/plan';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function usePlans() {
  const plans = ref<TravelPlan[]>([]);
  const currentPlan = ref<TravelPlan | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const generating = ref(false);

  // pobiera wszystkie plany użytkownika
  const fetchPlans = async (userId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_URL}/plans?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        plans.value = data.data;
      } else {
        error.value = data.error || 'Nie udało się pobrać planów';
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Nieznany błąd';
      console.error('Błąd podczas pobierania planów:', err);
    } finally {
      loading.value = false;
    }
  };

  // pobiera pojedynczy plan
  const fetchPlanById = async (planId: string, userId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_URL}/plans/${planId}?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        currentPlan.value = data.data;
        return data.data;
      } else {
        error.value = data.error || 'Nie udało się pobrać planu';
        return null;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Nieznany błąd';
      console.error('Błąd podczas pobierania planu:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // generuje nowy plan podróży przy użyciu AI
  const generatePlan = async (input: PlannerInput, userId: string) => {
    generating.value = true;
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_URL}/plans/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...input,
          userId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        currentPlan.value = data.data;
        await fetchPlans(userId); // odświeża listę planów
        return data.data;
      } else {
        error.value = data.error || 'Nie udało się wygenerować planu';
        return null;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Nieznany błąd';
      console.error('Błąd podczas generowania planu:', err);
      return null;
    } finally {
      generating.value = false;
      loading.value = false;
    }
  };

  // update planu
  const updatePlan = async (planId: string, userId: string, updates: Partial<TravelPlan>) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_URL}/plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          updates,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchPlans(userId); 
        if (currentPlan.value?.id === planId) {
          await fetchPlanById(planId, userId); // odświeża aktualny plan
        }
        return data.data;
      } else {
        error.value = data.error || 'Nie udało się zaktualizować planu';
        return null;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Nieznany błąd';
      console.error('Błąd podczas aktualizacji planu:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // usuwa plan
  const deletePlan = async (planId: string, userId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_URL}/plans/${planId}?userId=${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await fetchPlans(userId);
        if (currentPlan.value?.id === planId) {
          currentPlan.value = null;
        }
        return true;
      } else {
        error.value = data.error || 'Nie udało się usunąć planu';
        return false;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Nieznany błąd';
      console.error('Błąd podczas usuwania planu:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    plans,
    currentPlan,
    loading,
    error,
    generating,
    fetchPlans,
    fetchPlanById,
    generatePlan,
    updatePlan,
    deletePlan,
    clearError,
  };
}

