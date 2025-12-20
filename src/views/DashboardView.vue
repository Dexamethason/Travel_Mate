<template>
  <div class="min-h-screen bg-gray-50 p-6 dark:bg-gray-900 lg:p-8">
    <div class="mx-auto max-w-7xl">
      <!-- Panel zaproszeń -->
      <div class="mb-6">
        <InvitationsPanel />
      </div>

      <!-- Stan: Brak podróży -->
      <div
        v-if="!loading && trips.length === 0"
        class="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-12 dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="max-w-md text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="mx-auto mb-4 h-24 w-24 text-gray-400 dark:text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Brak podróży</h2>
          <p class="mb-6 text-gray-600 dark:text-gray-400">
            Utwórz swoją pierwszą podróż, aby zacząć planować wakacje.
          </p>
          <button
            class="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            @click="openCreateTripModal"
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
            Utwórz pierwszą podróż
          </button>
        </div>
      </div>

      <!-- Stan: Wybór podróży (jeśli więcej niż jedna) -->
      <div
        v-else-if="!loading && trips.length > 0 && !currentTrip"
        class="space-y-6"
      >
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Twoje podróże</h1>
          <button
            class="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            @click="openCreateTripModal"
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
            Nowa podróż +
          </button>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="trip in trips"
            :key="trip.id"
            class="cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            @click="selectTrip(trip.id!)"
          >
            <h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">{{ trip.name }}</h3>
            <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mr-2 h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                    clip-rule="evenodd"
                  />
                </svg>
                Budżet: {{ formatCurrency(trip.budget) }}
              </div>
              <div class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mr-2 h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
                  />
                </svg>
                Uczestnicy: {{ trip.participants.length }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stan: Widok wybranej podróży -->
      <div v-else-if="!loading && currentTrip" class="space-y-6">
        <!-- Nagłówek z nazwą podróży i datami -->
        <div class="flex items-start justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div class="flex-1">
            <h1 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              {{ currentTrip.name }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              <span v-if="tripDateRange">{{ tripDateRange }}</span>
              <span v-else>Podróż bez określonych dat</span>
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-if="isOwner"
              @click="openEditTripModal"
              class="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              title="Edytuj podróż"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                />
              </svg>
            </button>
            <button
              v-if="isOwner"
              @click="handleDeleteTrip"
              class="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
              title="Usuń podróż"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Sekcja Podsumowanie podróży -->
        <div>
          <h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Podsumowanie podróży</h2>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
            <!-- Karta Loty -->
            <div
              class="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
              @click="router.push('/flights')"
            >
              <div
                class="h-40 bg-cover bg-center"
                style="background-image: url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80');"
              ></div>
              <div class="p-5">
                <h3 class="mb-2 text-lg font-bold text-gray-900 dark:text-white">Loty</h3>
                <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  {{ flightsSummary || 'Brak zarezerwowanych lotów' }}
                </p>
                <button
                  class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  @click.stop="router.push('/flights')"
                >
                  <span>Zobacz szczegóły</span>
                  <ArrowRightIcon class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- Karta Noclegi -->
            <div
              class="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
              @click="router.push('/accommodations')"
            >
              <div
                class="h-40 bg-cover bg-center"
                style="background-image: url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80');"
              ></div>
              <div class="p-5">
                <h3 class="mb-2 text-lg font-bold text-gray-900 dark:text-white">Noclegi</h3>
                <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  {{ accommodationsSummary || 'Brak zarezerwowanych noclegów' }}
                </p>
                <button
                  class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  @click.stop="router.push('/accommodations')"
                >
                  <span>Zobacz szczegóły</span>
                  <ArrowRightIcon class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- Karta Atrakcje -->
            <div
              class="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
              @click="router.push('/activities')"
            >
              <div
                class="h-40 bg-cover bg-center"
                style="background-image: url('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80');"
              ></div>
              <div class="p-5">
                <h3 class="mb-2 text-lg font-bold text-gray-900 dark:text-white">Atrakcje</h3>
                <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  {{ activitiesSummary || 'Brak zaplanowanych atrakcji' }}
                </p>
                <button
                  class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  @click.stop="router.push('/activities')"
                >
                  <span>Zobacz szczegóły</span>
                  <ArrowRightIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sekcja Budżet -->
        <div>
          <h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Budżet</h2>
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div class="mb-4 flex items-baseline justify-between">
              <span class="text-lg font-semibold text-gray-900 dark:text-white">Całkowity budżet</span>
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ budgetPercentage }}%
              </span>
            </div>
            <div class="mb-3 h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                class="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                :style="{ width: `${Math.min(budgetPercentage, 100)}%` }"
              ></div>
            </div>
            <div class="mb-4 flex items-center justify-between">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Wydano: <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(totalSpent) }}</span>
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Pozostało: <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(remainingBudget) }}</span>
              </p>
            </div>
            <button
              @click="router.push(`/budget/${currentTrip.id}`)"
              class="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Zarządzaj budżetem
            </button>
          </div>
        </div>

        <!-- Sekcja Uczestnicy -->
        <div>
          <h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Uczestnicy</h2>
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div class="mb-4 flex items-center justify-between">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ currentTrip.participants.length }} {{ currentTrip.participants.length === 1 ? 'uczestnik' : 'uczestników' }}
              </p>
              <button
                v-if="isOwner"
                @click="showParticipantsModal = true"
                class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Edytuj uczestników
              </button>
            </div>
            <div class="flex -space-x-3">
              <div
                v-for="participant in currentTrip.participants"
                :key="participant.userId"
                class="relative"
                :title="`${participant.firstName} ${participant.lastName}`"
              >
                <div
                  class="h-12 w-12 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-semibold dark:border-gray-800"
                >
                  {{ participant.firstName[0] }}{{ participant.lastName[0] }}
                </div>
                <span
                  v-if="participant.userId === currentTrip.ownerId"
                  class="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white"
                  title="Właściciel"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sekcja Plan podróży -->
        <div>
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Plan podróży</h2>
            <button
              @click="router.push('/itinerary')"
              class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Zobacz plan
            </button>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div v-if="plansLoading" class="flex items-center justify-center py-8">
              <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
            </div>
            <div v-else-if="travelPlanDays.length === 0" class="py-8 text-center">
              <p class="text-gray-600 dark:text-gray-400">Brak zaplanowanych dni. Kliknij "Zobacz plan", aby zaplanować podróż!</p>
            </div>
            <div v-else class="flow-root max-h-96 overflow-y-auto pr-2">
              <ul class="-mb-8">
                <li v-for="(day, index) in travelPlanDays" :key="index">
                  <div class="relative" :class="{ 'pb-8': index !== travelPlanDays.length - 1 }">
                    <span
                      v-if="index !== travelPlanDays.length - 1"
                      aria-hidden="true"
                      class="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                    ></span>
                    <div class="relative flex items-start space-x-3">
                      <div>
                        <div class="relative px-1">
                          <div
                            class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 ring-8 ring-white dark:bg-blue-900 dark:text-blue-300 dark:ring-gray-800"
                          >
                            <svg
                              fill="currentColor"
                              height="20"
                              viewBox="0 0 256 256"
                              width="20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path :d="day.icon"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div class="min-w-0 flex-1 py-1.5">
                        <div class="text-md font-semibold text-gray-900 dark:text-white">
                          {{ day.title }}
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ day.date }}</p>
                        <p v-if="day.description" class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {{ day.description }}
                        </p>
                        <div v-if="day.activities && day.activities.length > 0" class="mt-2 space-y-1">
                          <div
                            v-for="(activity, actIndex) in day.activities.slice(0, 2)"
                            :key="actIndex"
                            class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
                          >
                            <span class="text-base">{{ ACTIVITY_TYPES[activity.type]?.icon || '📍' }}</span>
                            <span>{{ activity.name }}</span>
                            <span v-if="activity.time" class="text-gray-400">• {{ activity.time }}</span>
                          </div>
                          <p v-if="day.activities.length > 2" class="text-xs text-gray-400">
                            +{{ day.activities.length - 2 }} więcej aktywności
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Ładowanie -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
    </div>

    <!-- Modal tworzenia/edycji podróży -->
    <TripModal
      :show="showTripModal"
      :is-editing="isEditingTrip"
      :current-trip="isEditingTrip && currentTrip ? currentTrip : undefined"
      @close="closeTripModal"
      @submit="handleSaveTrip"
      @delete="handleDeleteTrip"
    />

    <!-- Modal edycji uczestników -->
    <ParticipantsModal
      v-if="currentTrip"
      :show="showParticipantsModal"
      :trip="currentTrip"
      @close="showParticipantsModal = false"
      @updated="handleParticipantsUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowRightIcon } from '@heroicons/vue/24/outline';
import { useTrips } from '../composables/useTrips';
import { useExpenses } from '../composables/useExpenses';
import { usePlans } from '../composables/usePlans';
import { useAuth } from '../composables/useAuth';
import { useNewTripModal } from '../composables/useNewTripModal';
import type { PlanDay } from '../types/plan';
import { ACTIVITY_TYPES } from '../types/plan';
import InvitationsPanel from '../components/InvitationsPanel.vue';
import TripModal from '../components/TripModal.vue';
import ParticipantsModal from '../components/ParticipantsModal.vue';
const router = useRouter();
const { currentUser } = useAuth();
const { showNewTripModal, closeModal } = useNewTripModal();

const {
  trips,
  currentTrip,
  loading,
  error: tripsError,
  fetchTrips,
  fetchTripById,
  createTrip,
  updateTrip,
  deleteTrip,
} = useTrips();

const { expenses, fetchExpenses } = useExpenses();
const { plans, fetchPlans, loading: plansLoading } = usePlans();

// Modals
const showTripModal = ref(false);
const showParticipantsModal = ref(false);
const isEditingTrip = ref(false);

// Watch for new trip modal trigger from sidebar
watch(
  showNewTripModal,
  (newVal) => {
    if (newVal) {
      openCreateTripModal();
      // Reset flag after opening modal
      nextTick(() => {
        closeModal();
      });
    }
  }
);

// Computed
const isOwner = computed(() => {
  if (!currentTrip.value || !currentUser.value) return false;
  return currentTrip.value.ownerId === currentUser.value.uid;
});

const totalSpent = computed(() => {
  return expenses.value.reduce((sum, expense) => sum + expense.amount, 0);
});

const budgetPercentage = computed(() => {
  if (!currentTrip.value || currentTrip.value.budget === 0) return 0;
  return Math.round((totalSpent.value / currentTrip.value.budget) * 100);
});

const remainingBudget = computed(() => {
  if (!currentTrip.value) return 0;
  return Math.max(0, currentTrip.value.budget - totalSpent.value);
});

const tripDateRange = computed(() => {
  // If trips had dates, we would format them here
  // For now, return null as trips don't have dates in the current structure
  return null;
});

const flightsSummary = computed(() => {
  // This would come from actual flight data
  return 'W dwie strony z Warszawy do Paryża';
});

const accommodationsSummary = computed(() => {
  // This would come from actual accommodation data
  return 'Hotel w pobliżu centrum';
});

const activitiesSummary = computed(() => {
  // This would come from actual activities data
  return 'Zwiedzanie, restauracje i doświadczenia kulturalne';
});

// Znajdź plan dla aktualnej podróży
const tripPlan = computed(() => {
  if (!currentTrip.value || !plans.value.length) return null;
  
  // Spróbuj znaleźć plan pasujący do nazwy podróży (destination może być w nazwie)
  const tripName = currentTrip.value.name.toLowerCase();
  const matchingPlan = plans.value.find(plan => {
    const destination = plan.destination.toLowerCase();
    const firstWord = tripName.split(' ')[0] || '';
    // Sprawdź czy destination jest w nazwie podróży lub odwrotnie
    return tripName.includes(destination) || destination.includes(firstWord);
  });
  
  return matchingPlan || plans.value[0]; // Jeśli nie znajdzie, weź pierwszy plan
});

const travelPlanDays = computed(() => {
  if (!tripPlan.value || !tripPlan.value.days || tripPlan.value.days.length === 0) {
    return [];
  }
  
    // Konwertuj PlanDay na format wyświetlania
    return tripPlan.value.days.map((day: PlanDay) => {
      // Znajdź główną aktywność dnia (pierwsza aktywność lub najważniejsza)
      const mainActivity = day.activities[0];
      const activityType = mainActivity?.type || 'other';
      
      // Utwórz opis z aktywności
      const activitiesList = day.activities
        .slice(0, 3)
        .map(a => a.name)
        .join(', ');
      const moreActivities = day.activities.length > 3 ? ` +${day.activities.length - 3} więcej` : '';
      
      // Formatuj datę
      const dateObj = new Date(day.date);
      const formattedDate = dateObj.toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long',
      });
      
      return {
        title: `Dzień ${day.day}: ${mainActivity?.name || 'Plan dnia'}`,
        date: formattedDate,
        description: `${activitiesList}${moreActivities}`,
        icon: getDayIcon(activityType),
        activities: day.activities,
      };
    });
});

// Funkcja pomocnicza do ikon dni
const getDayIcon = (activityType: string): string => {
  // Użyj ikon SVG podobnych do tych w planie
  const iconMap: Record<string, string> = {
    museum: 'M224,48H32A16,16,0,0,0,16,64V88a16,16,0,0,0,16,16v88a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V104a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM208,192H48V104H208ZM224,88H32V64H224V88ZM96,136a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,136Z',
    restaurant: 'M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM96,176a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v80A8,8,0,0,1,96,176Zm64,0a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v80A8,8,0,0,1,160,176Zm64,0a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v80A8,8,0,0,1,224,176Z',
    attraction: 'M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H72a8,8,0,0,1,0-16H184A8,8,0,0,1,192,128Z',
    transport: 'M235.58,128.84,160,91.06V48a32,32,0,0,0-64,0V91.06L20.42,128.84A8,8,0,0,0,16,136v32a8,8,0,0,0,9.57,7.84L96,161.76v18.93L82.34,194.34A8,8,0,0,0,80,200v32a8,8,0,0,0,11,7.43l37-14.81,37,14.81A8,8,0,0,0,176,232V200a8,8,0,0,0-2.34-5.66L160,180.69V161.76l70.43,14.08A8,8,0,0,0,240,168V136A8,8,0,0,0,235.58,128.84ZM224,158.24l-70.43-14.08A8,8,0,0,0,144,152v32a8,8,0,0,0,2.34,5.66L160,203.31v16.87l-29-11.61a8,8,0,0,0-5.94,0L96,220.18V203.31l13.66-13.65A8,8,0,0,0,112,184V152a8,8,0,0,0-9.57-7.84L32,158.24v-17.3l75.58-37.78A8,8,0,0,0,112,96V48a16,16,0,0,1,32,0V96a8,8,0,0,0,4.42,7.16L224,140.94Z',
  };
  
  const icon = iconMap[activityType];
  return icon ?? iconMap.transport ?? '';
};

// Methods
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(amount);
};

const selectTrip = async (tripId: string) => {
  await fetchTripById(tripId);
  if (currentTrip.value?.id) {
    await fetchExpenses(currentTrip.value.id);
    // Pobierz plany użytkownika, aby znaleźć plan dla tej podróży
    if (currentUser.value?.uid) {
      await fetchPlans(currentUser.value.uid);
    }
  }
};

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

const handleSaveTrip = async (data: { name: string; budget: number }) => {
  try {
    if (isEditingTrip.value && currentTrip.value?.id) {
      const success = await updateTrip(currentTrip.value.id, data);
      if (success) {
        closeTripModal();
        await fetchTripById(currentTrip.value.id);
      } else {
        // Jeśli aktualizacja się nie powiodła, modal pozostaje otwarty
        const errorMsg = tripsError.value || 'Nie udało się zaktualizować podróży';
        console.error(errorMsg);
        alert(errorMsg);
      }
    } else {
      const newTripId = await createTrip(data);
      if (newTripId) {
        closeTripModal();
        await selectTrip(newTripId);
      } else {
        // Jeśli tworzenie się nie powiodło, modal pozostaje otwarty
        const errorMsg = tripsError.value || 'Nie udało się utworzyć podróży';
        console.error(errorMsg);
        
        // Jeśli błąd 401, przekieruj do logowania
        if (errorMsg.includes('401') || errorMsg.includes('autoryzacji') || errorMsg.includes('Sesja wygasła')) {
          alert('Sesja wygasła. Zostaniesz przekierowany do strony logowania.');
          router.push('/login');
        } else {
          alert(errorMsg);
        }
      }
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Błąd podczas zapisywania podróży';
    console.error(errorMsg, err);
    alert(errorMsg);
  }
};

const handleDeleteTrip = async () => {
  if (!currentTrip.value?.id) return;

  if (confirm('Czy na pewno chcesz usunąć tę podróż? Ta operacja jest nieodwracalna.')) {
    const success = await deleteTrip(currentTrip.value.id);
    if (success) {
      closeTripModal();
      currentTrip.value = null;
      await fetchTrips();
    }
  }
};

const handleParticipantsUpdated = async () => {
  if (currentTrip.value?.id) {
    await fetchTripById(currentTrip.value.id);
  }
  showParticipantsModal.value = false;
};

// Lifecycle
onMounted(async () => {
  await fetchTrips();
  // If there's only one trip, select it automatically
  const firstTrip = trips.value[0];
  if (trips.value.length === 1 && firstTrip?.id) {
    await selectTrip(firstTrip.id);
  }
  
  // Pobierz plany użytkownika na wszelki wypadek
  if (currentUser.value?.uid) {
    await fetchPlans(currentUser.value.uid);
  }
});
</script>
