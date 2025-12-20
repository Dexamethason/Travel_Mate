<template>
  <div class="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
    <div class="mx-auto max-w-7xl">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Plan podróży</h1>
          <p class="text-gray-500 dark:text-gray-400">
            Wygeneruj szczegółowy plan podróży przy pomocy AI
          </p>
        </div>

        <div v-if="currentView && savedPlans.length > 0" class="flex gap-2 rounded-lg bg-white p-1 shadow dark:bg-gray-800">
          <button
            :class="[
              'cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2',
              currentView === 'create'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700',
            ]"
            @click="currentView = 'create'"
          >
            <PlusIcon class="h-4 w-4" />
            Nowy plan
          </button>
          <button
            :class="[
              'cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2',
              currentView === 'list'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700',
            ]"
            @click="currentView = 'list'"
          >
            <ClipboardDocumentListIcon class="h-4 w-4" />
            Zapisane plany ({{ savedPlans.length }})
          </button>
        </div>
      </div>

      <!-- komunikaty błędów -->
      <div v-if="error || Object.keys(validationErrors).length > 0" class="mb-6 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
        <div class="flex items-start gap-3">
          <ExclamationTriangleIcon class="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div class="flex-1">
            <h3 class="font-semibold text-red-800 dark:text-red-200">Wystąpił błąd</h3>
            <p v-if="error" class="text-sm text-red-700 dark:text-red-300">{{ error }}</p>
            <div v-else-if="Object.keys(validationErrors).length > 0" class="space-y-1">
              <p v-for="(validationError, key) in validationErrors" :key="key" class="text-sm text-red-700 dark:text-red-300">
                {{ validationError }}
              </p>
            </div>
          </div>
          <button
            class="cursor-pointer text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
            @click="clearError(); clearAllErrors()"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- tworzenie nowego planu -->
      <div v-if="currentView === 'create'" class="space-y-6">
        <!-- formularz -->
        <PlannerForm :generating="generating" @generate="handleGeneratePlan" />

        <!-- wygenerowany plan -->
        <div v-if="currentPlan">
          <div class="mb-4 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <div class="flex items-center gap-2 text-green-800 dark:text-green-200">
              <CheckCircleIcon class="h-6 w-6" />
              <span class="font-semibold">Plan został pomyślnie wygenerowany!</span>
            </div>
          </div>
          <PlanDisplay :plan="currentPlan" :show-actions="false" />
        </div>
      </div>

      <!-- lista zapisanych planów -->
      <div v-if="currentView === 'list'" class="space-y-6">
        <!-- loader -->
        <div v-if="loading" class="flex items-center justify-center py-16">
          <div class="flex flex-col items-center gap-4">
            <div class="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p class="text-gray-600 dark:text-gray-400">Ładowanie planów...</p>
          </div>
        </div>

        <!-- lista planów -->
        <div v-else-if="savedPlans.length > 0" class="space-y-4">
          <div
            v-for="plan in savedPlans"
            :key="plan.id"
            class="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            @click="viewPlanDetails(plan)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                  {{ plan.destination }}
                </h3>
                <div class="mb-3 flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span class="flex items-center gap-1">
                    <CalendarDaysIcon class="h-4 w-4" />
                    {{ formatDateShort(plan.start_date) }} - {{ formatDateShort(plan.end_date) }}
                  </span>
                  <span class="flex items-center gap-1">
                    <CalendarDaysIcon class="h-4 w-4" />
                    {{ plan.days.length }} dni
                  </span>
                  <span>{{ plan.total_estimated_cost.toLocaleString('pl-PL') }} PLN</span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-500">
                  Utworzono: {{ formatDateTime(plan.created_at) }}
                </p>
              </div>
            <button
              class="cursor-pointer rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              @click.stop="deletePlanConfirm(plan)"
            >
              <TrashIcon class="h-5 w-5" />
            </button>
            </div>
          </div>
        </div>

        <!-- brak planów -->
        <div v-else class="py-16 text-center">
          <InboxIcon class="mx-auto mb-4 h-16 w-16 text-gray-400 dark:text-gray-500" />
          <p class="mb-4 text-xl text-gray-600 dark:text-gray-400">Brak zapisanych planów</p>
          <button
            class="cursor-pointer rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 flex items-center gap-2 mx-auto"
            @click="currentView = 'create'"
          >
            <PlusIcon class="h-5 w-5" />
            Stwórz pierwszy plan
          </button>
        </div>
      </div>

      <div
        v-if="selectedPlan"
        class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
        @click.self="selectedPlan = null"
      >
        <div class="my-8 w-full max-w-5xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Szczegóły planu</h2>
            <button
              class="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              @click="selectedPlan = null"
            >
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>
          <PlanDisplay
            :plan="selectedPlan"
            :show-actions="false"
          />
        </div>
      </div>

      <!-- Modal potwierdzenia usunięcia -->
      <ConfirmModal
        :show="showDeleteConfirm"
        type="danger"
        title="Usuń plan podróży"
        :message="planToDelete ? `Czy na pewno chcesz usunąć plan podróży do: ${planToDelete.destination}? Tej operacji nie można cofnąć.` : ''"
        confirm-text="Usuń"
        cancel-text="Anuluj"
        :loading="loading"
        loading-text="Usuwanie..."
        @close="closeDeleteConfirm"
        @confirm="handleDeleteConfirm"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useAuth } from '../composables/useAuth';
import { usePlans } from '../composables/usePlans';
import { usePlanValidation } from '../composables/usePlanValidation';
import PlannerForm from '../components/PlannerForm.vue';
import PlanDisplay from '../components/PlanDisplay.vue';
import ConfirmModal from '../components/ConfirmModal.vue';
import type { PlannerInput, TravelPlan } from '../types/plan';
import {
  PlusIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  CalendarDaysIcon,
  TrashIcon,
  InboxIcon,
} from '@heroicons/vue/24/outline';

// Composables
const { currentUser } = useAuth();
const {
  plans: savedPlans,
  currentPlan,
  loading,
  error,
  generating,
  fetchPlans,
  generatePlan,
  deletePlan,
  clearError,
} = usePlans();
const {
  validationErrors,
  validateDeletePlan,
  clearAllErrors,
} = usePlanValidation();

// stan widoku - początkowo null, ustawimy po załadowaniu planów
const currentView = ref<'create' | 'list' | null>(null);
const selectedPlan = ref<TravelPlan | null>(null);
const showDeleteConfirm = ref(false);
const planToDelete = ref<TravelPlan | null>(null);

const userId = computed(() => currentUser.value?.uid || '');

// inicjalizacja
onMounted(async () => {
  if (userId.value) {
    await fetchPlans(userId.value);
    
    // Ustaw widok na podstawie tego, czy są zapisane plany
    if (savedPlans.value.length > 0) {
      currentView.value = 'list';
    } else {
      currentView.value = 'create';
    }
  } else {
    // Jeśli nie ma użytkownika, pokaż create
    currentView.value = 'create';
  }
});

// Watch na zmianę widoku - czyść currentPlan gdy opuszczamy create
watch(currentView, (newView) => {
  if (newView && newView === 'list' && currentPlan.value) {
    // Wyczyść wygenerowany plan gdy przechodzimy do listy
    currentPlan.value = null;
  }
});

// generowanie planu
const handleGeneratePlan = async (input: PlannerInput) => {
  if (!userId.value) {
    error.value = 'Musisz być zalogowany, aby generować plany';
    return;
  }

  const result = await generatePlan(input, userId.value);
  
  if (result) {
    // Automatycznie przejdź do widoku listy po wygenerowaniu planu
    currentView.value = 'list';
    // Wyczyść currentPlan - plan jest już zapisany w liście
    currentPlan.value = null;
  }
};

const viewPlanDetails = (plan: TravelPlan) => {
  selectedPlan.value = plan;
};

// usuwanie planu - otwórz modal potwierdzenia
const deletePlanConfirm = (plan: TravelPlan) => {
  clearAllErrors();
  
  // Walidacja przed pokazaniem modala
  if (!validateDeletePlan(plan, userId.value)) {
    // Wyświetl pierwszy błąd walidacji
    const firstError = Object.values(validationErrors.value)[0];
    if (firstError) {
      error.value = firstError;
    }
    return;
  }
  
  planToDelete.value = plan;
  showDeleteConfirm.value = true;
};

// Wykonaj usunięcie po potwierdzeniu
const handleDeleteConfirm = async () => {
  if (!planToDelete.value) return;
  
  const success = await deletePlan(planToDelete.value.id!, userId.value);
  if (success) {
    selectedPlan.value = null;
    showDeleteConfirm.value = false;
    planToDelete.value = null;
    clearAllErrors();
    // jak usunie wszystkie plany to przechodzi do widoku create
    if (savedPlans.value.length === 0) {
      currentView.value = 'create';
    }
  }
};

// Zamknij modal
const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false;
  planToDelete.value = null;
  clearAllErrors();
};

const formatDateShort = (dateString: string | Date) => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatDateTime = (date: Date | undefined) => {
  if (!date) return 'Nieznana data';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>
