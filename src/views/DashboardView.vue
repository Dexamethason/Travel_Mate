<template>
  <div class="min-h-screen bg-gray-50 p-6 dark:bg-gray-900 md:p-8">
    <div class="mx-auto max-w-7xl">
      <!-- Loading state -->
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>

      <!-- Empty state - brak tripów -->
      <div v-else-if="!currentTrip" class="py-16 text-center">
        <div class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <CalendarDaysIcon class="h-12 w-12 text-gray-400 dark:text-gray-500" />
        </div>
        <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Brak aktywnych podróży</h2>
        <p class="mb-6 text-gray-600 dark:text-gray-400">
          Utwórz nową podróż, aby rozpocząć planowanie
        </p>
        <button
          class="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          @click="openCreateTripModal"
        >
          Utwórz podróż
        </button>
      </div>

      <!-- Main dashboard content -->
      <div v-else>
        <!-- Header z nazwą podróży i akcjami -->
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex-1">
            <h1 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              {{ currentTrip.name }}
            </h1>
            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span v-if="tripDateRange" class="flex items-center gap-1.5">
                <CalendarDaysIcon class="h-4 w-4" />
                {{ tripDateRange }}
              </span>
              <span class="flex items-center gap-1.5">
                <CurrencyDollarIcon class="h-4 w-4" />
                Budżet: {{ formatCurrency(currentTrip.budget) }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              @click="openEditTripModal"
              title="Edytuj podróż"
            >
              <PencilIcon class="h-5 w-5" />
            </button>
            <button
              v-if="isOwner"
              class="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-600 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20"
              @click="handleDeleteTrip"
              title="Usuń podróż"
            >
              <TrashIcon class="h-5 w-5" />
            </button>
          </div>
        </div>

        <!-- Panel zaproszeń -->
        <div class="mb-8">
          <InvitationsPanel />
        </div>

        <!-- Podsumowanie podróży - karty -->
        <div class="mb-8">
          <h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Podsumowanie podróży</h2>
          <div class="grid gap-6 md:grid-cols-3">
            <!-- Karta Loty -->
            <div
              class="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              @click="navigateToFlights"
            >
              <div
                class="h-40 bg-cover bg-center"
                style="background-image: url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800');"
              ></div>
              <div class="p-5">
                <h3 class="mb-2 text-lg font-bold text-gray-900 dark:text-white">Loty</h3>
                <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  Wyszukaj i zarezerwuj loty do swojej podróży
                </p>
                <div class="flex gap-2">
                  <button
                    class="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    @click.stop="navigateToFlights"
                  >
                    Zobacz szczegóły
                  </button>
                </div>
              </div>
            </div>

            <!-- Karta Noclegi -->
            <div
              class="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              @click="navigateToAccommodations"
            >
              <div
                class="h-40 bg-cover bg-center"
                style="background-image: url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800');"
              ></div>
              <div class="p-5">
                <h3 class="mb-2 text-lg font-bold text-gray-900 dark:text-white">Noclegi</h3>
                <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  Znajdź idealne miejsce na nocleg
                </p>
                <div class="flex gap-2">
                  <button
                    class="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    @click.stop="navigateToAccommodations"
                  >
                    Zobacz szczegóły
                  </button>
                </div>
              </div>
            </div>

            <!-- Karta Atrakcje -->
            <div
              class="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              @click="navigateToActivities"
            >
              <div
                class="h-40 bg-cover bg-center"
                style="background-image: url('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800');"
              ></div>
              <div class="p-5">
                <h3 class="mb-2 text-lg font-bold text-gray-900 dark:text-white">Atrakcje</h3>
                <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  Odkryj miejsca i doświadczenia w podróży
                </p>
                <div class="flex gap-2">
                  <button
                    class="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    @click.stop="navigateToActivities"
                  >
                    Zobacz szczegóły
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Budżet -->
        <div class="mb-8">
          <h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Budżet</h2>
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div class="mb-4 flex items-baseline justify-between">
              <span class="text-lg font-semibold text-gray-900 dark:text-white">Wydatki</span>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ budgetPercentage }}%
              </span>
            </div>
            <div class="mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                class="h-full rounded-full bg-blue-500 transition-all duration-300"
                :style="{ width: `${budgetPercentage}%` }"
              ></div>
            </div>
            <div class="mb-4 flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">
                Wydano: <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(totalSpent) }}</span>
              </span>
              <span class="text-gray-600 dark:text-gray-400">
                Pozostało: <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(remainingBudget) }}</span>
              </span>
            </div>
            <p class="mb-4 text-right text-sm text-gray-500 dark:text-gray-400">
              Budżet całkowity: {{ formatCurrency(currentTrip.budget) }}
            </p>
            <button
              class="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700"
              @click="navigateToBudget"
            >
              Zarządzaj budżetem
            </button>
          </div>
        </div>

        <!-- Uczestnicy -->
        <div class="mb-8">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Uczestnicy</h2>
            <button
              class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              @click="openParticipantsModal"
            >
              Edytuj uczestników
            </button>
          </div>
          <div class="flex flex-wrap gap-3">
            <div
              v-for="participant in currentTrip.participants"
              :key="participant.userId"
              class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white">
                <span class="text-sm font-semibold">
                  {{ getInitials(participant.firstName, participant.lastName) }}
                </span>
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ participant.firstName }} {{ participant.lastName }}
                  <span
                    v-if="participant.userId === currentTrip.ownerId"
                    class="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    Właściciel
                  </span>
                </p>
                <p class="text-xs text-gray-600 dark:text-gray-400">{{ participant.email }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Plan podróży -->
        <div class="mb-8">
          <h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Plan podróży</h2>
          <div
            v-if="currentPlan && currentPlan.days.length > 0"
            class="max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <ul class="-mb-8">
              <li v-for="(day, index) in currentPlan.days" :key="index">
                <div class="relative" :class="{ 'pb-8': index !== currentPlan.days.length - 1 }">
                  <span
                    v-if="index !== currentPlan.days.length - 1"
                    aria-hidden="true"
                    class="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                  ></span>
                  <div class="relative flex items-start space-x-3">
                    <div>
                      <div class="relative px-1">
                        <div
                          class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 ring-8 ring-white dark:bg-blue-900 dark:text-blue-300 dark:ring-gray-900"
                        >
                          <CalendarDaysIcon class="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1 py-1.5">
                      <div class="text-md font-semibold text-gray-900 dark:text-white">
                        Dzień {{ day.day }}: {{ day.date }}
                      </div>
                      <div class="mt-2 space-y-1">
                        <div
                          v-for="(activity, actIndex) in day.activities.slice(0, 3)"
                          :key="actIndex"
                          class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                          <span class="text-lg">{{ getActivityIcon(activity.type) }}</span>
                          <span>{{ activity.name }}</span>
                          <span v-if="activity.time" class="text-xs text-gray-500">({{ activity.time }})</span>
                        </div>
                        <p
                          v-if="day.activities.length > 3"
                          class="text-xs text-gray-500 dark:text-gray-500"
                        >
                          +{{ day.activities.length - 3 }} więcej aktywności
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div v-else class="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
            <CalendarDaysIcon class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-500" />
            <p class="mb-4 text-gray-600 dark:text-gray-400">Brak planu podróży</p>
            <button
              class="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
              @click="navigateToItinerary"
            >
              Utwórz plan podróży
            </button>
          </div>
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

    <!-- Modal uczestników -->
    <div
      v-if="showParticipantsModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="showParticipantsModal = false"
    >
      <div class="mx-4 w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <div class="mb-6 flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Uczestnicy podróży</h3>
          <button
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            @click="showParticipantsModal = false"
          >
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <div v-if="currentTrip" class="space-y-4">
          <!-- Lista uczestników -->
          <div class="space-y-2">
            <div
              v-for="participant in currentTrip.participants"
              :key="participant.userId"
              class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700"
            >
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white">
                  <span class="text-sm font-semibold">
                    {{ getInitials(participant.firstName, participant.lastName) }}
                  </span>
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ participant.firstName }} {{ participant.lastName }}
                    <span
                      v-if="participant.userId === currentTrip.ownerId"
                      class="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      Właściciel
                    </span>
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ participant.email }}</p>
                </div>
              </div>
              <button
                v-if="participant.userId !== currentTrip.ownerId && isOwner"
                class="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                @click="removeParticipant(participant.userId)"
                title="Usuń uczestnika"
              >
                <XMarkIcon class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Formularz dodawania uczestnika (tylko dla właściciela) -->
          <div v-if="isOwner" class="border-t border-gray-200 pt-4 dark:border-gray-700">
            <p class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Zaproś nowego uczestnika
            </p>
            <div class="flex gap-2">
              <input
                v-model="inviteEmail"
                type="email"
                placeholder="Email użytkownika"
                class="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <button
                class="rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                @click="handleSendInvitation"
                :disabled="!inviteEmail || inviteLoading"
              >
                <PlusIcon v-if="!inviteLoading" class="h-5 w-5" />
                <div v-else class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              </button>
            </div>
            <p v-if="inviteError" class="mt-2 text-sm text-red-600 dark:text-red-400">
              {{ inviteError }}
            </p>
            <p v-if="inviteSuccess" class="mt-2 text-sm text-green-600 dark:text-green-400">
              Zaproszenie wysłane pomyślnie!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useTrips } from '../composables/useTrips';
import { useExpenses } from '../composables/useExpenses';
import { usePlans } from '../composables/usePlans';
import { useAuth } from '../composables/useAuth';
import { useInvitations } from '../composables/useInvitations';
import InvitationsPanel from '../components/InvitationsPanel.vue';
import TripModal from '../components/TripModal.vue';
import {
  CalendarDaysIcon,
  CurrencyDollarIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PlusIcon,
} from '@heroicons/vue/24/outline';

const router = useRouter();
const { currentUser } = useAuth();
const {
  trips,
  currentTrip,
  loading,
  fetchTrips,
  fetchTripById,
  createTrip,
  updateTrip,
  deleteTrip,
} = useTrips();
const { expenses, fetchExpenses } = useExpenses();
const { plans, fetchPlans } = usePlans();
const { sendInvitation } = useInvitations();

// Modals
const showTripModal = ref(false);
const showParticipantsModal = ref(false);
const isEditingTrip = ref(false);

// Invitation
const inviteEmail = ref('');
const inviteLoading = ref(false);
const inviteError = ref<string | null>(null);
const inviteSuccess = ref(false);

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
  return Math.min(100, Math.round((totalSpent.value / currentTrip.value.budget) * 100));
});

const remainingBudget = computed(() => {
  if (!currentTrip.value) return 0;
  return Math.max(0, currentTrip.value.budget - totalSpent.value);
});

const tripDateRange = computed(() => {
  // Trip nie ma dat, więc sprawdzamy plan podróży
  if (currentPlan.value && currentPlan.value.start_date && currentPlan.value.end_date) {
    const start = new Date(currentPlan.value.start_date);
    const end = new Date(currentPlan.value.end_date);
    return `${formatDate(start)} - ${formatDate(end)}`;
  }
  return null;
});

const currentPlan = computed(() => {
  if (!plans.value || plans.value.length === 0) return null;
  // Zwróć pierwszy plan lub plan powiązany z tripem (jeśli będzie taka relacja)
  return plans.value[0];
});

// Methods
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(amount);
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const getActivityIcon = (type: string) => {
  const icons: Record<string, string> = {
    museum: '🏛️',
    restaurant: '🍽️',
    walk: '🚶',
    attraction: '🎡',
    transport: '🚗',
    accommodation: '🏨',
    other: '📍',
  };
  return icons[type] || '📍';
};

// Navigation
const navigateToFlights = () => {
  router.push('/flights');
};

const navigateToAccommodations = () => {
  router.push('/accommodations');
};

const navigateToActivities = () => {
  router.push('/activities');
};

const navigateToBudget = () => {
  if (currentTrip.value?.id) {
    router.push(`/budget/${currentTrip.value.id}`);
  } else {
    router.push('/budget');
  }
};

const navigateToItinerary = () => {
  router.push('/itinerary');
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

const handleSaveTrip = async (data: { name: string; budget: number }) => {
  if (isEditingTrip.value && currentTrip.value?.id) {
    const success = await updateTrip(currentTrip.value.id, data);
    if (success) {
      closeTripModal();
      if (currentTrip.value.id) {
        await fetchTripById(currentTrip.value.id);
        await fetchExpenses(currentTrip.value.id);
      }
    }
  } else {
    const newTripId = await createTrip(data);
    if (newTripId) {
      closeTripModal();
      await fetchTrips();
      if (newTripId) {
        await fetchTripById(newTripId);
        await fetchExpenses(newTripId);
      }
    }
  }
};

const handleDeleteTrip = async () => {
  if (!currentTrip.value?.id) return;
  if (!confirm('Czy na pewno chcesz usunąć tę podróż? Ta operacja jest nieodwracalna.')) {
    return;
  }

  const success = await deleteTrip(currentTrip.value.id);
  if (success) {
    closeTripModal();
    await fetchTrips();
    // Jeśli nie ma więcej tripów, currentTrip będzie null
  }
};

// Participants modal
const openParticipantsModal = () => {
  showParticipantsModal.value = true;
  inviteEmail.value = '';
  inviteError.value = null;
  inviteSuccess.value = false;
};

const removeParticipant = async (userId: string) => {
  if (!currentTrip.value || !isOwner.value) return;
  if (!confirm('Czy na pewno chcesz usunąć tego uczestnika?')) return;

  const updatedParticipants = currentTrip.value.participants.filter((p) => p.userId !== userId);
  const success = await updateTrip(currentTrip.value.id!, {
    participants: updatedParticipants,
  });

  if (success && currentTrip.value.id) {
    await fetchTripById(currentTrip.value.id);
  }
};

const handleSendInvitation = async () => {
  if (!inviteEmail.value || !currentTrip.value?.id) return;

  inviteLoading.value = true;
  inviteError.value = null;
  inviteSuccess.value = false;

  const result = await sendInvitation({
    tripId: currentTrip.value.id,
    email: inviteEmail.value,
  });

  inviteLoading.value = false;

  if (result) {
    inviteSuccess.value = true;
    inviteEmail.value = '';
    setTimeout(() => {
      inviteSuccess.value = false;
    }, 3000);
  } else {
    inviteError.value = 'Nie udało się wysłać zaproszenia';
  }
};

// Lifecycle
onMounted(async () => {
  await fetchTrips();
  if (currentUser.value) {
    await fetchPlans(currentUser.value.uid);
  }

  // Jeśli są tripy, wybierz pierwszy
  if (trips.value.length > 0 && !currentTrip.value) {
    const firstTrip = trips.value[0];
    if (firstTrip?.id) {
      const tripId = firstTrip.id;
      const fetchedTrip = await fetchTripById(tripId);
      if (fetchedTrip?.id) {
        await fetchExpenses(fetchedTrip.id);
      }
    }
  }
});

// Watch na zmianę currentTrip - pobierz wydatki
watch(
  () => currentTrip.value?.id,
  async (tripId: string | undefined) => {
    if (tripId) {
      await fetchExpenses(tripId);
    }
  }
);
</script>
