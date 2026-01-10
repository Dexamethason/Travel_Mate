<template>
  <!-- Brak planu -->
  <div v-if="!plan" class="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
    <InboxIcon class="mx-auto mb-4 h-16 w-16 text-gray-400 dark:text-gray-500" />
    <p class="text-lg text-gray-600 dark:text-gray-400">Brak danych planu</p>
  </div>

  <!-- Plan -->
  <div v-else class="space-y-6">
    <!-- Nagłówek planu -->
    <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div class="flex items-start justify-between">
        <div>
          <h2 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">{{ plan.destination }}</h2>
          <div class="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span class="flex items-center gap-1">
              <CalendarDaysIcon class="h-4 w-4" />
              {{ formatDate(plan.start_date) }} - {{ formatDate(plan.end_date) }}
            </span>
            <span class="flex items-center gap-1">
              <CalendarDaysIcon class="h-4 w-4" />
              {{ plan.days.length }} dni
            </span>
            <span class="flex items-center gap-1">
              <CurrencyDollarIcon class="h-4 w-4" />
              {{ plan.total_estimated_cost.toLocaleString('pl-PL') }} PLN
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- wskazówki -->
    <div v-if="plan.tips && plan.tips.length > 0" class="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
      <h3 class="mb-3 flex items-center gap-2 text-lg font-semibold text-yellow-800 dark:text-yellow-200">
        <LightBulbIcon class="h-5 w-5" />
        Praktyczne wskazówki
      </h3>
      <ul class="space-y-2">
        <li
          v-for="(tip, index) in plan.tips"
          :key="index"
          class="flex items-start gap-2 text-sm text-yellow-700 dark:text-yellow-300"
        >
          <span class="mt-0.5">•</span>
          <span>{{ tip }}</span>
        </li>
      </ul>
    </div>

    <!-- plan -->
    <div class="space-y-4">
      <h3 class="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
        <CalendarDaysIcon class="h-6 w-6" />
        Plan dzień po dniu
      </h3>
      
      <div class="space-y-4">
        <div
          v-for="day in plan.days"
          :key="day.day"
          class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <!-- Nagłówek dnia -->
          <div class="mb-4 flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
            <div>
              <h4 class="text-lg font-bold text-gray-900 dark:text-white">
                Dzień {{ day.day }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ formatDate(day.date) }}
              </p>
            </div>
            <div v-if="day.daily_cost" class="text-right">
              <p class="text-xs text-gray-500 dark:text-gray-400">Koszt dzienny</p>
              <p class="text-lg font-bold text-blue-600 dark:text-blue-400">
                {{ day.daily_cost.toLocaleString('pl-PL') }} PLN
              </p>
            </div>
          </div>

          <!-- Aktywności -->
          <div class="space-y-3">
            <div
              v-for="(activity, actIndex) in day.activities"
              :key="actIndex"
              class="flex gap-4 rounded-lg border border-gray-100 p-4 transition-all hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
            >
              <div class="flex-shrink-0">
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-full"
                  :class="getActivityColorClass(activity.type)"
                >
                  <component :is="getActivityIcon(activity.type)" class="h-6 w-6" :class="getActivityIconColor(activity.type)" />
                </div>
              </div>

              <div class="flex-1">
                <div class="mb-1 flex items-start justify-between">
                  <h5 class="font-semibold text-gray-900 dark:text-white">
                    {{ activity.name }}
                  </h5>
                  <span
                    class="ml-2 rounded-full px-3 py-1 text-xs font-medium"
                    :class="getActivityBadgeClass(activity.type)"
                  >
                    {{ getActivityTypeLabel(activity.type) }}
                  </span>
                </div>
                
                <div class="mb-2 flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span class="flex items-center gap-1">
                    <ClockIcon class="h-4 w-4" />
                    {{ activity.time }}
                  </span>
                  <span class="flex items-center gap-1">
                    <CurrencyDollarIcon class="h-4 w-4" />
                    {{ activity.cost_estimate.toLocaleString('pl-PL') }} PLN
                  </span>
                  <span v-if="activity.location" class="flex items-center gap-1">
                    <MapPinIcon class="h-4 w-4" />
                    {{ activity.location }}
                  </span>
                </div>

                <p v-if="activity.notes" class="text-sm text-gray-700 dark:text-gray-300">
                  {{ activity.notes }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800">
      <h3 class="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
        <CurrencyDollarIcon class="h-5 w-5" />
        Podsumowanie kosztów
      </h3>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="rounded-lg bg-white p-4 dark:bg-gray-700">
          <p class="text-sm text-gray-600 dark:text-gray-400">Całkowity koszt</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ plan.total_estimated_cost.toLocaleString('pl-PL') }} PLN
          </p>
        </div>
        <div class="rounded-lg bg-white p-4 dark:bg-gray-700">
          <p class="text-sm text-gray-600 dark:text-gray-400">Średni koszt dzienny</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ averageDailyCost.toLocaleString('pl-PL') }} PLN
          </p>
        </div>
        <div class="rounded-lg bg-white p-4 dark:bg-gray-700">
          <p class="text-sm text-gray-600 dark:text-gray-400">Liczba aktywności</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ totalActivities }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import type { TravelPlan } from '../types/plan';
import {
  CalendarDaysIcon,
  CurrencyDollarIcon,
  LightBulbIcon,
  ClockIcon,
  MapPinIcon,
  BuildingLibraryIcon,
  UserIcon,
  SparklesIcon,
  CakeIcon,
  TruckIcon,
  BuildingOffice2Icon,
  MapIcon,
  InboxIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps<{
  plan: TravelPlan | null;
  showActions?: boolean;
}>();

// Walidacja planu - tylko loguje ostrzeżenia w konsoli, nie blokuje wyświetlania
const validatePlan = (plan: TravelPlan | null): void => {
  if (!plan) {
    return;
  }
  
  // Tylko loguj ostrzeżenia w konsoli, nie blokuj wyświetlania
  if (!plan.destination) {
    console.warn('PlanDisplay: Plan nie ma przypisanego celu podróży');
  }
  
  if (!plan.days || plan.days.length === 0) {
    console.warn('PlanDisplay: Plan nie zawiera żadnych dni');
  }
  
  if (!plan.start_date || !plan.end_date) {
    console.warn('PlanDisplay: Plan nie ma przypisanych dat');
  }
};

// Walidacja przy zmianie planu - tylko logowanie
watch(
  () => props.plan,
  (newPlan) => {
    if (newPlan) {
      validatePlan(newPlan);
    }
  },
  { immediate: true }
);

// formatowanie daty
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// statystyki
const averageDailyCost = computed(() => {
  if (!props.plan || props.plan.days.length === 0) return 0;
  return Math.round(props.plan.total_estimated_cost / props.plan.days.length);
});

const totalActivities = computed(() => {
  if (!props.plan) return 0;
  return props.plan.days.reduce((sum, day) => sum + day.activities.length, 0);
});

const getActivityIcon = (type: string) => {
  const iconMap: Record<string, any> = {
    museum: BuildingLibraryIcon,
    restaurant: CakeIcon,
    walk: UserIcon,
    attraction: SparklesIcon,
    transport: TruckIcon,
    accommodation: BuildingOffice2Icon,
    other: MapIcon,
  };
  return iconMap[type] || MapIcon;
};

const getActivityIconColor = (type: string) => {
  const colorMap: Record<string, string> = {
    museum: 'text-blue-600 dark:text-blue-400',
    restaurant: 'text-orange-600 dark:text-orange-400',
    walk: 'text-green-600 dark:text-green-400',
    attraction: 'text-purple-600 dark:text-purple-400',
    transport: 'text-gray-600 dark:text-gray-400',
    accommodation: 'text-indigo-600 dark:text-indigo-400',
    other: 'text-slate-600 dark:text-slate-400',
  };
  return colorMap[type] || 'text-gray-600 dark:text-gray-400';
};

const getActivityTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    museum: 'Muzeum',
    restaurant: 'Restauracja',
    walk: 'Spacer',
    attraction: 'Atrakcja',
    transport: 'Transport',
    accommodation: 'Nocleg',
    other: 'Inne',
  };
  return labelMap[type] || 'Inne';
};

const getActivityColorClass = (type: string) => {
  const colorMap: Record<string, string> = {
    museum: 'bg-blue-100 dark:bg-blue-900/30',
    restaurant: 'bg-orange-100 dark:bg-orange-900/30',
    walk: 'bg-green-100 dark:bg-green-900/30',
    attraction: 'bg-purple-100 dark:bg-purple-900/30',
    transport: 'bg-gray-100 dark:bg-gray-700',
    accommodation: 'bg-indigo-100 dark:bg-indigo-900/30',
    other: 'bg-slate-100 dark:bg-slate-700',
  };
  return colorMap[type] || 'bg-gray-100 dark:bg-gray-700';
};

const getActivityBadgeClass = (type: string) => {
  const badgeMap: Record<string, string> = {
    museum: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    restaurant: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    walk: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    attraction: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    transport: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    accommodation: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    other: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
  };
  return badgeMap[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};
</script>

