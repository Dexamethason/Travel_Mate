import { ref } from 'vue';
import type { Trip, CreateTripData, UpdateTripData } from '../types/trip';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function useTrips() {
  const trips = ref<Trip[]>([]);
  const currentTrip = ref<Trip | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Pobierz wszystkie tripy
  const fetchTrips = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_URL}/trips`);
      const data = await response.json();
      
      if (data.success) {
        trips.value = data.data;
      } else {
        error.value = data.message || 'Failed to fetch trips';
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching trips:', err);
    } finally {
      loading.value = false;
    }
  };

  // Pobierz pojedynczy trip
  const fetchTripById = async (tripId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_URL}/trips/${tripId}`);
      const data = await response.json();
      
      if (data.success) {
        currentTrip.value = data.data;
        return data.data;
      } else {
        error.value = data.message || 'Failed to fetch trip';
        return null;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching trip:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Utwórz nowy trip
  const createTrip = async (tripData: CreateTripData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_URL}/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchTrips(); // Odśwież listę tripów
        return data.data.id;
      } else {
        error.value = data.message || 'Failed to create trip';
        return null;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error creating trip:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Aktualizuj trip
  const updateTrip = async (tripId: string, tripData: UpdateTripData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_URL}/trips/${tripId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchTrips(); // Odśwież listę tripów
        if (currentTrip.value?.id === tripId) {
          await fetchTripById(tripId); // Odśwież aktualny trip
        }
        return true;
      } else {
        error.value = data.message || 'Failed to update trip';
        return false;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error updating trip:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Usuń trip
  const deleteTrip = async (tripId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_URL}/trips/${tripId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchTrips(); // Odśwież listę tripów
        if (currentTrip.value?.id === tripId) {
          currentTrip.value = null;
        }
        return true;
      } else {
        error.value = data.message || 'Failed to delete trip';
        return false;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error deleting trip:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    trips,
    currentTrip,
    loading,
    error,
    fetchTrips,
    fetchTripById,
    createTrip,
    updateTrip,
    deleteTrip,
  };
}

