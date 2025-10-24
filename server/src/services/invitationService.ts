import { db } from '../config/firebase';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore/lite';
import { authService } from './authService';
import { tripService } from './tripService';

export interface Invitation {
  id?: string;
  tripId: string;
  tripName: string;
  invitedEmail: string;
  invitedUserId: string;
  invitedBy: string;
  invitedByName: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date | Timestamp;
}

const COLLECTION_NAME = 'invitations';

export const invitationService = {
  // Tworzy zaproszenie do tripa
  async createInvitation(
    tripId: string,
    email: string,
    invitedBy: string
  ): Promise<string> {
    try {
      // 1. Sprawdź czy trip istnieje
      const trip = await tripService.getTripById(tripId);
      if (!trip) {
        throw new Error('Trip nie został znaleziony');
      }

      // 2. Sprawdź czy użytkownik zapraszający jest ownerem
      if (trip.ownerId !== invitedBy) {
        throw new Error('Tylko właściciel może zapraszać użytkowników');
      }

      // 3. Sprawdź czy użytkownik o podanym emailu istnieje
      const invitedUser = await authService.getUserByEmail(email);
      if (!invitedUser) {
        throw new Error('Użytkownik z podanym adresem email nie istnieje');
      }

      // 4. Sprawdź czy użytkownik nie jest już uczestnikiem
      const isAlreadyParticipant = trip.participants.some(
        p => p.userId === invitedUser.uid
      );
      if (isAlreadyParticipant) {
        throw new Error('Użytkownik jest już uczestnikiem tego tripa');
      }

      // 5. Sprawdź czy nie ma już oczekującego zaproszenia
      const existingInvitations = await this.getInvitationsByTripAndUser(
        tripId,
        invitedUser.uid
      );
      const hasPendingInvitation = existingInvitations.some(
        inv => inv.status === 'pending'
      );
      if (hasPendingInvitation) {
        throw new Error('Użytkownik ma już oczekujące zaproszenie do tego tripa');
      }

      // 6. Pobierz dane użytkownika zapraszającego
      const inviter = await authService.getUserByUid(invitedBy);
      if (!inviter) {
        throw new Error('Nie znaleziono danych użytkownika zapraszającego');
      }

      // 7. Utwórz zaproszenie
      const newInvitation: Omit<Invitation, 'id'> = {
        tripId,
        tripName: trip.name,
        invitedEmail: email,
        invitedUserId: invitedUser.uid,
        invitedBy,
        invitedByName: `${inviter.firstName} ${inviter.lastName}`,
        status: 'pending',
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), newInvitation);
      return docRef.id;
    } catch (error) {
      console.error('Error creating invitation:', error);
      throw error;
    }
  },

  // Pobiera zaproszenia dla użytkownika
  async getInvitationsByUserId(userId: string): Promise<Invitation[]> {
    try {
      const invitationsCol = collection(db, COLLECTION_NAME);
      const q = query(invitationsCol, where('invitedUserId', '==', userId));
      const invitationSnapshot = await getDocs(q);

      return invitationSnapshot.docs.map(
        doc =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Invitation
      );
    } catch (error) {
      console.error('Error getting invitations:', error);
      throw error;
    }
  },

  // Pobiera zaproszenia dla tripa i użytkownika
  async getInvitationsByTripAndUser(
    tripId: string,
    userId: string
  ): Promise<Invitation[]> {
    try {
      const invitationsCol = collection(db, COLLECTION_NAME);
      const q = query(
        invitationsCol,
        where('tripId', '==', tripId),
        where('invitedUserId', '==', userId)
      );
      const invitationSnapshot = await getDocs(q);

      return invitationSnapshot.docs.map(
        doc =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Invitation
      );
    } catch (error) {
      console.error('Error getting invitations:', error);
      throw error;
    }
  },

  // Pobiera pojedyncze zaproszenie
  async getInvitationById(invitationId: string): Promise<Invitation | null> {
    try {
      const invitationDoc = doc(db, COLLECTION_NAME, invitationId);
      const invitationSnapshot = await getDoc(invitationDoc);

      if (invitationSnapshot.exists()) {
        return {
          id: invitationSnapshot.id,
          ...invitationSnapshot.data(),
        } as Invitation;
      }
      return null;
    } catch (error) {
      console.error('Error getting invitation:', error);
      throw error;
    }
  },

  // Akceptuje zaproszenie
  async acceptInvitation(invitationId: string, userId: string): Promise<void> {
    try {
      // 1. Pobierz zaproszenie
      const invitation = await this.getInvitationById(invitationId);
      if (!invitation) {
        throw new Error('Zaproszenie nie zostało znalezione');
      }

      // 2. Sprawdź czy użytkownik ma prawo zaakceptować zaproszenie
      if (invitation.invitedUserId !== userId) {
        throw new Error('Nie masz uprawnień do zaakceptowania tego zaproszenia');
      }

      // 3. Sprawdź czy zaproszenie jest w statusie pending
      if (invitation.status !== 'pending') {
        throw new Error('To zaproszenie zostało już obsłużone');
      }

      // 4. Pobierz dane użytkownika
      const user = await authService.getUserByUid(userId);
      if (!user) {
        throw new Error('Nie znaleziono danych użytkownika');
      }

      // 5. Dodaj użytkownika do tripa
      await tripService.addParticipantToTrip(invitation.tripId, {
        userId: user.uid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });

      // 6. Zaktualizuj status zaproszenia
      const invitationDoc = doc(db, COLLECTION_NAME, invitationId);
      await updateDoc(invitationDoc, { status: 'accepted' });
    } catch (error) {
      console.error('Error accepting invitation:', error);
      throw error;
    }
  },

  // Odrzuca zaproszenie
  async rejectInvitation(invitationId: string, userId: string): Promise<void> {
    try {
      // 1. Pobierz zaproszenie
      const invitation = await this.getInvitationById(invitationId);
      if (!invitation) {
        throw new Error('Zaproszenie nie zostało znalezione');
      }

      // 2. Sprawdź czy użytkownik ma prawo odrzucić zaproszenie
      if (invitation.invitedUserId !== userId) {
        throw new Error('Nie masz uprawnień do odrzucenia tego zaproszenia');
      }

      // 3. Sprawdź czy zaproszenie jest w statusie pending
      if (invitation.status !== 'pending') {
        throw new Error('To zaproszenie zostało już obsłużone');
      }

      // 4. Zaktualizuj status zaproszenia
      const invitationDoc = doc(db, COLLECTION_NAME, invitationId);
      await updateDoc(invitationDoc, { status: 'rejected' });
    } catch (error) {
      console.error('Error rejecting invitation:', error);
      throw error;
    }
  },

  // Pobiera zaproszenia dla tripa (wszystkie)
  async getInvitationsByTripId(tripId: string): Promise<Invitation[]> {
    try {
      const invitationsCol = collection(db, COLLECTION_NAME);
      const q = query(invitationsCol, where('tripId', '==', tripId));
      const invitationSnapshot = await getDocs(q);

      return invitationSnapshot.docs.map(
        doc =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Invitation
      );
    } catch (error) {
      console.error('Error getting invitations for trip:', error);
      throw error;
    }
  },
};

