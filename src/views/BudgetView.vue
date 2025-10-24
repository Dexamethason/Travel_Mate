<template>
  <div class="min-h-screen flex-1 bg-gray-50 p-6 dark:bg-gray-900">
    <!-- Stan: Lista tripów lub pusty stan -->
    <TripList
      v-if="!tripId"
      :trips="trips"
      :loading="tripsLoading"
      @create-trip="openCreateTripModal"
      @select-trip="selectTrip"
    />

    <!-- Stan: Widok budżetu wybranego tripa -->
    <div v-else>
      <!-- Ładowanie -->
      <div v-if="tripsLoading || expensesLoading" class="flex items-center justify-center py-12">
        <div class="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>

      <!-- Widok tripa -->
      <div v-else-if="currentTrip">
        <!-- Header z przyciskiem powrotu -->
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button
              class="rounded-lg p-2 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              @click="goBackToList"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-gray-900 dark:text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ currentTrip.name }}
              </h1>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Zarządzaj wydatkami podróży i śledź swoje koszty.
              </p>
            </div>
          </div>
          <button
            v-if="isOwner"
            class="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            @click="openEditTripModal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="mr-2 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
              />
            </svg>
            Edytuj trip
          </button>
        </div>

        <!-- Podsumowanie budżetu -->
        <TripSummary :budget="currentTrip.budget" :total-spent="totalSpent" />

        <!-- Tabela wydatków -->
        <ExpenseTable
          :expenses="expenses"
          :participants="currentTrip.participants"
          @edit-expense="openEditExpenseModal"
          @delete-expense="handleDeleteExpense"
        />

        <!-- Przycisk dodawania wydatków -->
        <div class="flex justify-end">
          <button
            class="flex h-10 items-center justify-center rounded-lg bg-blue-500 px-4 text-sm font-bold text-white transition-colors hover:bg-blue-600"
            @click="openAddExpenseModal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="mr-2 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span>Dodaj wydatek</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal tworzenia/edycji tripa -->
    <TripModal
      :show="showTripModal"
      :is-editing="isEditingTrip"
      :current-trip="isEditingTrip && currentTrip ? currentTrip : undefined"
      @close="closeTripModal"
      @submit="handleSaveTrip"
      @delete="handleDeleteTrip"
    />

    <!-- Modal dodawania/edycji wydatku -->
    <ExpenseModal
      :show="showExpenseModal"
      :is-editing="isEditingExpense"
      :participants="currentTrip?.participants || []"
      :initial-data="isEditingExpense && editingExpense ? editingExpense : undefined"
      @close="closeExpenseModal"
      @submit="handleSaveExpense"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTrips } from '../composables/useTrips';
import { useExpenses } from '../composables/useExpenses';
import { useAuth } from '../composables/useAuth';
import type { Expense, SplitParticipant } from '../types/expense';

// Components
import TripList from '@/components/TripList.vue';
import TripSummary from '@/components/TripSummary.vue';
import ExpenseTable from '@/components/ExpenseTable.vue';
import TripModal from '@/components/TripModal.vue';
import ExpenseModal from '@/components/ExpenseModal.vue';

const route = useRoute();
const router = useRouter();

const { currentUser } = useAuth();
const {
  trips,
  currentTrip,
  loading: tripsLoading,
  fetchTrips,
  fetchTripById,
  createTrip,
  updateTrip,
  deleteTrip,
} = useTrips();
const {
  expenses,
  loading: expensesLoading,
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} = useExpenses();

const tripId = computed(() => route.params.tripId as string | undefined);

// Modals
const showTripModal = ref(false);
const showExpenseModal = ref(false);
const isEditingTrip = ref(false);
const isEditingExpense = ref(false);
const editingExpense = ref<Expense | null>(null);

// Computed
const totalSpent = computed(() => {
  return expenses.value.reduce((sum, expense) => sum + expense.amount, 0);
});

// Sprawdź czy użytkownik jest właścicielem aktualnego tripa
const isOwner = computed(() => {
  if (!currentTrip.value || !currentUser.value) return false;
  return currentTrip.value.ownerId === currentUser.value.uid;
});

// Nawigacja
const selectTrip = (id: string) => {
  router.push(`/budget/${id}`);
};

const goBackToList = () => {
  router.push('/budget');
};

// Trip modal
const openCreateTripModal = () => {
  isEditingTrip.value = false;
  showTripModal.value = true;
};

const openEditTripModal = () => {
  if (!currentTrip.value) return;
  isEditingTrip.value = true;
  showTripModal.value = true;
};

const closeTripModal = () => {
  showTripModal.value = false;
};

const handleSaveTrip = async (data: {
  name: string;
  budget: number;
}) => {
  if (isEditingTrip.value && currentTrip.value?.id) {
    const success = await updateTrip(currentTrip.value.id, data);

    if (success) {
      closeTripModal();
      if (tripId.value) {
        await fetchTripById(tripId.value);
      }
    }
  } else {
    const newTripId = await createTrip(data);

    if (newTripId) {
      closeTripModal();
      router.push(`/budget/${newTripId}`);
    }
  }
};

const handleDeleteTrip = async () => {
  if (!currentTrip.value?.id) return;

  if (confirm('Czy na pewno chcesz usunąć ten trip? Ta operacja jest nieodwracalna.')) {
    const success = await deleteTrip(currentTrip.value.id);
    if (success) {
      closeTripModal();
      router.push('/budget');
    }
  }
};

// Expense modal
const openAddExpenseModal = () => {
  isEditingExpense.value = false;
  editingExpense.value = null;
  showExpenseModal.value = true;
};

const openEditExpenseModal = (expense: Expense) => {
  if (!expense.id) return;
  isEditingExpense.value = true;
  editingExpense.value = expense;
  showExpenseModal.value = true;
};

const closeExpenseModal = () => {
  showExpenseModal.value = false;
};

const handleSaveExpense = async (data: {
  date: string;
  category: string;
  description: string;
  amount: number;
  splitWith: SplitParticipant[];
}) => {
  if (!tripId.value) return;

  if (isEditingExpense.value && editingExpense.value?.id) {
    const success = await updateExpense(editingExpense.value.id, tripId.value, data);

    if (success) {
      closeExpenseModal();
    }
  } else {
    const newExpenseId = await createExpense({
      tripId: tripId.value,
      ...data,
    });

    if (newExpenseId) {
      closeExpenseModal();
    }
  }
};

const handleDeleteExpense = async (expenseId: string) => {
  if (!tripId.value) return;

  if (confirm('Czy na pewno chcesz usunąć ten wydatek?')) {
    await deleteExpense(expenseId, tripId.value);
  }
};

// Lifecycle
onMounted(async () => {
  await fetchTrips();

  if (tripId.value) {
    await fetchTripById(tripId.value);
    await fetchExpenses(tripId.value);
  }
});

// Watch for route changes
watch(tripId, async newTripId => {
  if (newTripId) {
    await fetchTripById(newTripId);
    await fetchExpenses(newTripId);
  }
});
</script>
