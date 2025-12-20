<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="$emit('close')"
  >
    <div
      class="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800"
    >
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Edytuj uczestników</h3>
        <button
          @click="$emit('close')"
          class="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <!-- Lista aktualnych uczestników -->
      <div class="mb-6 space-y-3">
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Uczestnicy podróży</h4>
        <div
          v-for="participant in trip.participants"
          :key="participant.userId"
          class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 text-white font-semibold"
            >
              {{ participant.firstName[0] }}{{ participant.lastName[0] }}
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ participant.firstName }} {{ participant.lastName }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ participant.email }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span
              v-if="participant.userId === trip.ownerId"
              class="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              Właściciel
            </span>
            <button
              v-if="participant.userId !== trip.ownerId && isOwner"
              @click="handleRemoveParticipant(participant.userId)"
              class="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
              title="Usuń uczestnika"
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
      </div>

      <!-- Zaproszenia oczekujące -->
      <div v-if="pendingInvitations.length > 0" class="mb-6">
        <h4 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Zaproszenia oczekujące
        </h4>
        <div class="space-y-2">
          <div
            v-for="invitation in pendingInvitations"
            :key="invitation.id"
            class="flex items-center justify-between rounded-lg border border-yellow-300 bg-yellow-50 p-3 dark:border-yellow-600 dark:bg-yellow-900/20"
          >
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ invitation.invitedEmail }}
              </p>
            </div>
            <span
              class="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            >
              Oczekujące
            </span>
          </div>
        </div>
      </div>

      <!-- Formularz zaproszenia nowego uczestnika -->
      <div v-if="isOwner" class="space-y-3 border-t pt-4">
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Zaproś nowego uczestnika
        </h4>
        <div class="flex gap-2">
          <input
            v-model="inviteEmail"
            type="email"
            placeholder="Email użytkownika"
            class="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="button"
            class="rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            @click="handleSendInvitation"
            :disabled="!inviteEmail || inviteLoading"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
        <p v-if="inviteError" class="text-sm text-red-600 dark:text-red-400">
          {{ inviteError }}
        </p>
        <p v-if="inviteSuccess" class="text-sm text-green-600 dark:text-green-400">
          Zaproszenie wysłane pomyślnie!
        </p>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          class="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          @click="$emit('close')"
        >
          Zamknij
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Trip } from '../types/trip';
import type { Invitation } from '../types/invitation';
import { useAuth } from '../composables/useAuth';
import { useInvitations } from '../composables/useInvitations';

interface Props {
  show: boolean;
  trip: Trip;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  updated: [];
}>();

const { currentUser } = useAuth();
const { sendInvitation, fetchTripInvitations } = useInvitations();

const inviteEmail = ref('');
const inviteLoading = ref(false);
const inviteError = ref<string | null>(null);
const inviteSuccess = ref(false);
const pendingInvitations = ref<Invitation[]>([]);

const isOwner = computed(() => {
  if (!props.trip || !currentUser.value) return false;
  return props.trip.ownerId === currentUser.value.uid;
});

const handleSendInvitation = async () => {
  if (!inviteEmail.value || !props.trip.id) return;

  inviteLoading.value = true;
  inviteError.value = null;
  inviteSuccess.value = false;

  const result = await sendInvitation({
    tripId: props.trip.id,
    email: inviteEmail.value,
  });

  inviteLoading.value = false;

  if (result) {
    inviteSuccess.value = true;
    inviteEmail.value = '';
    await loadInvitations();
    setTimeout(() => {
      inviteSuccess.value = false;
    }, 3000);
  } else {
    inviteError.value = 'Nie udało się wysłać zaproszenia';
  }
};

const handleRemoveParticipant = async (userId: string) => {
  if (!confirm('Czy na pewno chcesz usunąć tego uczestnika z podróży?')) {
    return;
  }
  // TODO: Implement remove participant API call
  emit('updated');
};

const loadInvitations = async () => {
  if (props.trip?.id) {
    const invitations = await fetchTripInvitations(props.trip.id);
    pendingInvitations.value = invitations.filter((inv) => inv.status === 'pending');
  }
};

watch(
  () => props.show,
  async (newVal) => {
    if (newVal) {
      await loadInvitations();
      inviteEmail.value = '';
      inviteError.value = null;
      inviteSuccess.value = false;
    }
  }
);
</script>

