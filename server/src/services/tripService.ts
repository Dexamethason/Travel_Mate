
import { db } from '../config/firebase';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore/lite';

export interface Participant {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Trip {
  id?: string;
  name: string;
  budget: number;
  ownerId: string;
  participants: Participant[];
  createdAt: Date | Timestamp;
}

const COLLECTION_NAME = 'trips';

export const tripService = {
  // Pobiera tripy dla danego użytkownika (jako owner lub uczestnik)
  async getTripsByUserId(userId: string): Promise<Trip[]> {
    try {
      const tripsCol = collection(db, COLLECTION_NAME);
      const tripSnapshot = await getDocs(tripsCol);
      
      // Filtruj tripy gdzie user jest ownerem lub uczestnikiem
      const trips = tripSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }) as Trip)
        .filter(trip => {
          // Sprawdź czy user jest ownerem
          if (trip.ownerId === userId) {
            return true;
          }
          // Sprawdź czy user jest uczestnikiem
          return trip.participants.some(p => p.userId === userId);
        });
      
      return trips;
    } catch (error) {
      console.error('Error getting trips:', error);
      throw error;
    }
  },

  // Pobiera pojedynczy trip
  async getTripById(tripId: string): Promise<Trip | null> {
    try {
      const tripDoc = doc(db, COLLECTION_NAME, tripId);
      const tripSnapshot = await getDoc(tripDoc);

      if (tripSnapshot.exists()) {
        return {
          id: tripSnapshot.id,
          ...tripSnapshot.data(),
        } as Trip;
      }
      return null;
    } catch (error) {
      console.error('Error getting trip:', error);
      throw error;
    }
  },

  // Tworzy nowy trip
  async createTrip(
    tripData: Omit<Trip, 'id' | 'createdAt'>,
    ownerData: { userId: string; email: string; firstName: string; lastName: string }
  ): Promise<string> {
    try {
      // Automatycznie dodaj ownera jako pierwszego uczestnika
      const participants = tripData.participants || [];
      
      // Sprawdź czy owner już nie jest w liście uczestników
      const ownerInParticipants = participants.some(p => p.userId === ownerData.userId);
      
      if (!ownerInParticipants) {
        participants.unshift({
          userId: ownerData.userId,
          email: ownerData.email,
          firstName: ownerData.firstName,
          lastName: ownerData.lastName,
        });
      }

      const newTrip = {
        ...tripData,
        participants,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), newTrip);
      return docRef.id;
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  },

  // Aktualizuje trip (tylko owner może edytować)
  async updateTrip(
    tripId: string,
    userId: string,
    tripData: Partial<Omit<Trip, 'id' | 'createdAt' | 'ownerId'>>
  ): Promise<void> {
    try {
      // Pobierz trip i sprawdź uprawnienia
      const trip = await this.getTripById(tripId);
      
      if (!trip) {
        throw new Error('Trip nie został znaleziony');
      }
      
      if (trip.ownerId !== userId) {
        throw new Error('Tylko właściciel może edytować ten trip');
      }

      const tripDoc = doc(db, COLLECTION_NAME, tripId);
      await updateDoc(tripDoc, tripData);
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  },

  // Usuwa trip (tylko owner może usunąć)
  async deleteTrip(tripId: string, userId: string): Promise<void> {
    try {
      // Pobierz trip i sprawdź uprawnienia
      const trip = await this.getTripById(tripId);
      
      if (!trip) {
        throw new Error('Trip nie został znaleziony');
      }
      
      if (trip.ownerId !== userId) {
        throw new Error('Tylko właściciel może usunąć ten trip');
      }

      const tripDoc = doc(db, COLLECTION_NAME, tripId);
      await deleteDoc(tripDoc);
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  },

  // Dodaje uczestnika do tripa
  async addParticipantToTrip(
    tripId: string,
    participant: Participant
  ): Promise<void> {
    try {
      const trip = await this.getTripById(tripId);
      
      if (!trip) {
        throw new Error('Trip nie został znaleziony');
      }

      // Sprawdź czy uczestnik już nie jest w tripie
      const alreadyInTrip = trip.participants.some(
        p => p.userId === participant.userId
      );

      if (alreadyInTrip) {
        throw new Error('Użytkownik już jest uczestnikiem tego tripa');
      }

      // Dodaj uczestnika
      const updatedParticipants = [...trip.participants, participant];
      
      const tripDoc = doc(db, COLLECTION_NAME, tripId);
      await updateDoc(tripDoc, { participants: updatedParticipants });
    } catch (error) {
      console.error('Error adding participant to trip:', error);
      throw error;
    }
  },
};