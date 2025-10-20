import { db } from '../config/firebase';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore/lite';

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Trip {
  id?: string;
  name: string;
  budget: number;
  participants: Participant[];
  createdAt: Date | Timestamp;
}

const COLLECTION_NAME = 'trips';

export const tripService = {
  // Pobiera wszystkie tripy
  async getAllTrips(): Promise<Trip[]> {
    try {
      const tripsCol = collection(db, COLLECTION_NAME);
      const tripSnapshot = await getDocs(tripsCol);
      return tripSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Trip));
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
          ...tripSnapshot.data()
        } as Trip;
      }
      return null;
    } catch (error) {
      console.error('Error getting trip:', error);
      throw error;
    }
  },

  // Tworzy nowy trip
  async createTrip(tripData: Omit<Trip, 'id' | 'createdAt'>): Promise<string> {
    try {
      const newTrip = {
        ...tripData,
        createdAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, COLLECTION_NAME), newTrip);
      return docRef.id;
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  },

  // Aktualizuje trip
  async updateTrip(tripId: string, tripData: Partial<Omit<Trip, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const tripDoc = doc(db, COLLECTION_NAME, tripId);
      await updateDoc(tripDoc, tripData);
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  },

  // Usuwa trip
  async deleteTrip(tripId: string): Promise<void> {
    try {
      const tripDoc = doc(db, COLLECTION_NAME, tripId);
      await deleteDoc(tripDoc);
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  }
};

