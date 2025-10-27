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

        <div v-if="savedPlans.length > 0" class="flex gap-2 rounded-lg bg-white p-1 shadow dark:bg-gray-800">
          <button
            :class="[
              'rounded-md px-4 py-2 text-sm font-medium transition-colors',
              currentView === 'create'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700',
            ]"
            @click="currentView = 'create'"
          >
            ➕ Nowy plan
          </button>
          <button
            :class="[
              'rounded-md px-4 py-2 text-sm font-medium transition-colors',
              currentView === 'list'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700',
            ]"
            @click="currentView = 'list'"
          >
            📋 Zapisane plany ({{ savedPlans.length }})
          </button>
        </div>
      </div>

      <!-- komunikaty -->
      <div v-if="error" class="mb-6 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
        <div class="flex items-start gap-3">
          <span class="text-2xl">⚠️</span>
          <div class="flex-1">
            <h3 class="font-semibold text-red-800 dark:text-red-200">Wystąpił błąd</h3>
            <p class="text-sm text-red-700 dark:text-red-300">{{ error }}</p>
          </div>
          <button
            class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
            @click="clearError"
          >
            ✕
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
              <span class="text-2xl">✅</span>
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
                  <span>📅 {{ formatDateShort(plan.start_date) }} - {{ formatDateShort(plan.end_date) }}</span>
                  <span>🗓️ {{ plan.days.length }} dni</span>
                  <span>💰 {{ plan.total_estimated_cost.toLocaleString('pl-PL') }} PLN</span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-500">
                  Utworzono: {{ formatDateTime(plan.created_at) }}
                </p>
              </div>
              <button
                class="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                @click.stop="deletePlanConfirm(plan)"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        <!-- brak planów -->
        <div v-else class="py-16 text-center">
          <div class="mb-4 text-6xl">📭</div>
          <p class="mb-4 text-xl text-gray-600 dark:text-gray-400">Brak zapisanych planów</p>
          <button
            class="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            @click="currentView = 'create'"
          >
            ➕ Stwórz pierwszy plan
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
              class="text-3xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              @click="selectedPlan = null"
            >
              ×
            </button>
          </div>
          <PlanDisplay
            :plan="selectedPlan"
            :show-actions="true"
            @edit="editPlan(selectedPlan)"
            @delete="deletePlanConfirm(selectedPlan)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuth } from '../composables/useAuth';
import { usePlans } from '../composables/usePlans';
import PlannerForm from '../components/PlannerForm.vue';
import PlanDisplay from '../components/PlanDisplay.vue';
import type { PlannerInput, TravelPlan } from '../types/plan';

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

// stan widoku
const currentView = ref<'create' | 'list'>('create');
const selectedPlan = ref<TravelPlan | null>(null);

const userId = computed(() => currentUser.value?.uid || '');

// inicjalizacja
onMounted(async () => {
  if (userId.value) {
    await fetchPlans(userId.value);
    
    // Jeśli są zapisane plany, pokaż listę
    if (savedPlans.value.length > 0) {
      currentView.value = 'list';
    }
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
    // automatyczny scroll do planu jaki wygeneruje
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);
  }
};

const viewPlanDetails = (plan: TravelPlan) => {
  selectedPlan.value = plan;
};

// TODO: implementacja edycji planu (Bartek)
const editPlan = (plan: TravelPlan) => {
  console.log('Edycja planu:', plan.id);
  // TODO: Implementacja edycji
  alert('Funkcja edycji zostanie dodana wkrótce!');
};

// usuwanie planu
const deletePlanConfirm = async (plan: TravelPlan) => {
  if (!plan.id || !userId.value) return;
  
  const confirmed = confirm(
    `Czy na pewno chcesz usunąć plan podróży do: ${plan.destination}?`
  );
  
  if (confirmed) {
    const success = await deletePlan(plan.id, userId.value);
    if (success) {
      selectedPlan.value = null;
      // jak usunie wszystkie plany to przechodzi do widoku create
      if (savedPlans.value.length === 0) {
        currentView.value = 'create';
      }
    }
  }
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
