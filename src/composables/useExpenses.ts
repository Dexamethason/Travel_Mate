import { ref } from 'vue';
import type { Expense, CreateExpenseData, UpdateExpenseData } from '../types/expense';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function useExpenses() {
  const expenses = ref<Expense[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Pobiera wszystkie wydatki dla tripa
  const fetchExpenses = async (tripId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_URL}/expenses/${tripId}`);
      const data = await response.json();

      if (data.success) {
        expenses.value = data.data;
      } else {
        error.value = data.message || 'Failed to fetch expenses';
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching expenses:', err);
    } finally {
      loading.value = false;
    }
  };

  // Tworzy nowy wydatek
  const createExpense = async (expenseData: CreateExpenseData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchExpenses(expenseData.tripId); // Odświeża listę wydatków
        return data.data.id;
      } else {
        error.value = data.message || 'Failed to create expense';
        return null;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error creating expense:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Aktualizuje wydatek
  const updateExpense = async (
    expenseId: string,
    tripId: string,
    expenseData: UpdateExpenseData
  ) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_URL}/expenses/${expenseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchExpenses(tripId); // Odświeża listę wydatków
        return true;
      } else {
        error.value = data.message || 'Failed to update expense';
        return false;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error updating expense:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Usuwa wydatek
  const deleteExpense = async (expenseId: string, tripId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_URL}/expenses/${expenseId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await fetchExpenses(tripId);
        return true;
      } else {
        error.value = data.message || 'Failed to delete expense';
        return false;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error deleting expense:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
  };
}
