<template>
  <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Zaproszenia do tripów</h2>

    <!-- loading -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
    </div>

    <!-- empty -->
    <div
      v-else-if="pendingInvitations.length === 0"
      class="rounded-lg bg-gray-50 py-8 text-center dark:bg-gray-700/50"
    >
      <p class="text-gray-600 dark:text-gray-400">
        Nie masz żadnych oczekujących zaproszeń.
      </p>
    </div>

    <!-- zaproszenia-->
    <div v-else class="space-y-3">
      <div
        v-for="invitation in pendingInvitations"
        :key="invitation.id"
        class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700/50"
      >
        <div class="flex-1">
          <h3 class="font-semibold text-gray-900 dark:text-white">
            {{ invitation.tripName }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Zaproszenie od: {{ invitation.invitedByName }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-500">
            {{ formatDate(invitation.createdAt) }}
          </p>
        </div>

        <div class="flex gap-2">
          <button
            class="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            @click="handleAccept(invitation.id!)"
            :disabled="actionLoading"
          >
            Akceptuj
          </button>
          <button
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
            @click="handleReject(invitation.id!)"
            :disabled="actionLoading"
          >
            Odrzuć
          </button>
        </div>
      </div>
    </div>

    <!-- zaakceptowane zaproszenia -->
    <div v-if="acceptedInvitations.length > 0" class="mt-6">
      <h3 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Zaakceptowane zaproszenia
      </h3>
      <div class="space-y-2">
        <div
          v-for="invitation in acceptedInvitations"
          :key="invitation.id"
          class="flex items-center justify-between rounded-lg bg-green-50 p-3 dark:bg-green-900/20"
        >
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ invitation.tripName }}
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              Zaakceptowano {{ formatDate(invitation.createdAt) }}
            </p>
          </div>
          <span
            class="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200"
          >
            Zaakceptowano
          </span>
        </div>
      </div>
    </div>

    <div v-if="error" class="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
      {{ error }}
    </div>

    <div v-if="successMessage" class="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-200">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useInvitations } from '../composables/useInvitations';

const { invitations, loading, error: invitationsError, fetchInvitations, acceptInvitation, rejectInvitation } = useInvitations();

const actionLoading = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const pendingInvitations = computed(() => {
  return invitations.value.filter(inv => inv.status === 'pending');
});

const acceptedInvitations = computed(() => {
  return invitations.value.filter(inv => inv.status === 'accepted');
});

const formatDate = (date: any) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date.toDate ? date.toDate() : new Date();
  return d.toLocaleDateString('pl-PL', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

const handleAccept = async (invitationId: string) => {
  actionLoading.value = true;
  error.value = null;
  successMessage.value = null;

  const success = await acceptInvitation(invitationId);

  actionLoading.value = false;

  if (success) {
    successMessage.value = 'Zaproszenie zaakceptowane! Możesz teraz zobaczyć trip w swoich podróżach.';
    setTimeout(() => {
      successMessage.value = null;
    }, 5000);
  } else {
    error.value = invitationsError.value || 'Nie udało się zaakceptować zaproszenia';
  }
};

const handleReject = async (invitationId: string) => {
  if (!confirm('Czy na pewno chcesz odrzucić to zaproszenie?')) {
    return;
  }

  actionLoading.value = true;
  error.value = null;
  successMessage.value = null;

  const success = await rejectInvitation(invitationId);

  actionLoading.value = false;

  if (success) {
    successMessage.value = 'Zaproszenie odrzucone.';
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
  } else {
    error.value = invitationsError.value || 'Nie udało się odrzucić zaproszenia';
  }
};

onMounted(async () => {
  await fetchInvitations();
});
</script>

<script lang="ts">
export default {
  name: 'InvitationsPanel',
};
</script>

