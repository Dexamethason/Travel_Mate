import { ref } from 'vue';
import type { Invitation, CreateInvitationData } from '../types/invitation';
import { useAuth } from './useAuth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function useInvitations() {
  const invitations = ref<Invitation[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  const { getAuthHeaders } = useAuth();

  // Pobiera zaproszenia dla zalogowanego użytkownika
  const fetchInvitations = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_URL}/invitations`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();

      if (data.success) {
        invitations.value = data.data;
      } else {
        error.value = data.message || 'Failed to fetch invitations';
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching invitations:', err);
    } finally {
      loading.value = false;
    }
  };

  // Pobiera zaproszenia dla danego tripa
  const fetchTripInvitations = async (tripId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_URL}/invitations/trip/${tripId}`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();

      if (data.success) {
        return data.data as Invitation[];
      } else {
        error.value = data.message || 'Failed to fetch trip invitations';
        return [];
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching trip invitations:', err);
      return [];
    } finally {
      loading.value = false;
    }
  };

  // Wysyła zaproszenie do tripa
  const sendInvitation = async (invitationData: CreateInvitationData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_URL}/invitations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(invitationData),
      });

      const data = await response.json();

      if (data.success) {
        return data.data.id;
      } else {
        error.value = data.message || 'Failed to send invitation';
        return null;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error sending invitation:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Akceptuje zaproszenie
  const acceptInvitation = async (invitationId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_URL}/invitations/${invitationId}/accept`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (data.success) {
        await fetchInvitations(); // Odśwież listę zaproszeń
        return true;
      } else {
        error.value = data.message || 'Failed to accept invitation';
        return false;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error accepting invitation:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Odrzuca zaproszenie
  const rejectInvitation = async (invitationId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_URL}/invitations/${invitationId}/reject`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (data.success) {
        await fetchInvitations(); // Odśwież listę zaproszeń
        return true;
      } else {
        error.value = data.message || 'Failed to reject invitation';
        return false;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error rejecting invitation:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Wyszukuje użytkownika po emailu
  const searchUserByEmail = async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/users/search?email=${encodeURIComponent(email)}`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        return null;
      }
    } catch (err) {
      console.error('Error searching user:', err);
      return null;
    }
  };

  return {
    invitations,
    loading,
    error,
    fetchInvitations,
    fetchTripInvitations,
    sendInvitation,
    acceptInvitation,
    rejectInvitation,
    searchUserByEmail,
  };
}

