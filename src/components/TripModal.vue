<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="$emit('close')"
  >
    <div
      class="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800"
    >
      <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        {{ isEditing ? 'Edytuj trip' : 'Stwórz nowy trip' }}
      </h3>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
            >Nazwa podróży</label
          >
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Np. Wakacje w Paryżu"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
            >Budżet (zł)</label
          >
          <input
            v-model.number="form.budget"
            type="number"
            required
            min="0"
            step="0.01"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="0.00"
          />
        </div>

        <!-- Sekcja uczestników tylko przy edycji -->
        <div v-if="isEditing && currentTrip">
          <label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >Uczestnicy</label
          >
          
          <!-- Lista aktualnych uczestników -->
          <div class="mb-3 space-y-2">
            <div
              v-for="participant in currentTrip.participants"
              :key="participant.userId"
              class="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700"
            >
              <div class="flex-1">
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ participant.firstName }} {{ participant.lastName }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ participant.email }}
                </p>
              </div>
              <span
                v-if="participant.userId === currentTrip.ownerId"
                class="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                Właściciel
              </span>
            </div>
          </div>

          <!-- Zaproszenia oczekujące -->
          <div v-if="pendingInvitations.length > 0" class="mb-3">
            <p class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Zaproszenia oczekujące
            </p>
            <div class="space-y-2">
              <div
                v-for="invitation in pendingInvitations"
                :key="invitation.id"
                class="flex items-center gap-2 rounded-lg border border-yellow-300 bg-yellow-50 p-3 dark:border-yellow-600 dark:bg-yellow-900/20"
              >
                <div class="flex-1">
                  <p class="text-sm text-gray-900 dark:text-white">
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
          <div class="space-y-2">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                type="button"
                class="rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
                @click="handleSendInvitation"
                :disabled="!inviteEmail || inviteLoading"
              >
                {{ inviteLoading ? 'Wysyłanie...' : 'Wyślij' }}
              </button>
            </div>
            <p v-if="inviteError" class="text-sm text-red-600 dark:text-red-400">
              {{ inviteError }}
            </p>
            <p v-if="inviteSuccess" class="text-sm text-green-600 dark:text-green-400">
              Zaproszenie wysłane pomyślnie!
            </p>
          </div>
        </div>

        <div class="flex gap-3 pt-4">
          <button
            type="button"
            class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            @click="$emit('close')"
          >
            Anuluj
          </button>
          <button
            v-if="isEditing && isOwner"
            type="button"
            class="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
            @click="$emit('delete')"
          >
            Usuń trip
          </button>
          <button
            v-if="!isEditing || isOwner"
            type="submit"
            class="flex-1 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-600"
          >
            {{ isEditing ? 'Zapisz zmiany' : 'Utwórz trip' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Trip } from '../types/trip';
import type { Invitation } from '../types/invitation';
import { useAuth } from '../composables/useAuth';
import { useInvitations } from '../composables/useInvitations';

interface TripForm {
  name: string;
  budget: number;
}

interface Props {
  show: boolean;
  isEditing: boolean;
  currentTrip?: Trip;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  submit: [data: TripForm];
  delete: [];
}>();

const { currentUser } = useAuth();
const { sendInvitation, fetchTripInvitations } = useInvitations();

const form = ref<TripForm>({
  name: '',
  budget: 0,
});

const inviteEmail = ref('');
const inviteLoading = ref(false);
const inviteError = ref<string | null>(null);
const inviteSuccess = ref(false);
const pendingInvitations = ref<Invitation[]>([]);

const isOwner = ref(false);

const handleSubmit = () => {
  emit('submit', { ...form.value });
};

const handleSendInvitation = async () => {
  if (!inviteEmail.value || !props.currentTrip?.id) return;
  
  inviteLoading.value = true;
  inviteError.value = null;
  inviteSuccess.value = false;

  const result = await sendInvitation({
    tripId: props.currentTrip.id,
    email: inviteEmail.value,
  });

  inviteLoading.value = false;

  if (result) {
    inviteSuccess.value = true;
    inviteEmail.value = '';
    // Odśwież listę zaproszeń
    await loadInvitations();
    setTimeout(() => {
      inviteSuccess.value = false;
    }, 3000);
  } else {
    inviteError.value = 'Nie udało się wysłać zaproszenia';
  }
};

const loadInvitations = async () => {
  if (props.currentTrip?.id) {
    const invitations = await fetchTripInvitations(props.currentTrip.id);
    pendingInvitations.value = invitations.filter(inv => inv.status === 'pending');
  }
};

// Reset formularza kiedy modal jest otwarty/zamknięty lub dane początkowe się zmienia
watch(
  [() => props.show, () => props.currentTrip],
  async () => {
    if (props.show) {
      if (props.currentTrip) {
        form.value = {
          name: props.currentTrip.name,
          budget: props.currentTrip.budget,
        };
        
        // Sprawdź czy aktualny użytkownik jest właścicielem
        isOwner.value = currentUser.value?.uid === props.currentTrip.ownerId;
        
        // Załaduj zaproszenia dla tego tripa
        await loadInvitations();
      } else {
        form.value = {
          name: '',
          budget: 0,
        };
        isOwner.value = false;
        pendingInvitations.value = [];
      }
      
      // Reset stanu zaproszenia
      inviteEmail.value = '';
      inviteError.value = null;
      inviteSuccess.value = false;
    }
  },
  { immediate: true }
);
</script>

<script lang="ts">
export default {
  name: 'TripModal',
};
</script>
