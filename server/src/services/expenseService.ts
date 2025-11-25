import { db } from '../config/firebase';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore/lite';

export interface SplitParticipant {
  participantId: string;
  amount: number;
}

export interface Expense {
  id?: string;
  tripId: string;
  createdBy: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  splitWith: SplitParticipant[];
  createdAt: Date | Timestamp;
}

const COLLECTION_NAME = 'expenses';

export const expenseService = {
  // Pobiera wszystkie wydatki dla tripa
  async getExpensesByTripId(tripId: string): Promise<Expense[]> {
    try {
      const expensesCol = collection(db, COLLECTION_NAME);
      const q = query(expensesCol, where('tripId', '==', tripId));
      const expenseSnapshot = await getDocs(q);

      return expenseSnapshot.docs.map(
        doc =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Expense
      );
    } catch (error) {
      console.error('Error getting expenses:', error);
      throw error;
    }
  },

  // Pobiera pojedynczy wydatek
  async getExpenseById(expenseId: string): Promise<Expense | null> {
    try {
      const expenseDoc = doc(db, COLLECTION_NAME, expenseId);
      const expenseSnapshot = await getDoc(expenseDoc);

      if (expenseSnapshot.exists()) {
        return {
          id: expenseSnapshot.id,
          ...expenseSnapshot.data(),
        } as Expense;
      }
      return null;
    } catch (error) {
      console.error('Error getting expense:', error);
      throw error;
    }
  },

  // Tworzy nowy wydatek
  async createExpense(
    expenseData: Omit<Expense, 'id' | 'createdAt' | 'createdBy'>,
    createdBy: string
  ): Promise<string> {
    try {
      const newExpense = {
        ...expenseData,
        createdBy,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), newExpense);
      return docRef.id;
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  },

  // Aktualizuje wydatek (tylko twórca może edytować)
  async updateExpense(
    expenseId: string,
    userId: string,
    expenseData: Partial<Omit<Expense, 'id' | 'createdAt' | 'createdBy'>>
  ): Promise<void> {
    try {
      // Pobierz wydatek i sprawdź uprawnienia
      const expense = await this.getExpenseById(expenseId);
      
      if (!expense) {
        throw new Error('Wydatek nie został znaleziony');
      }
      
      if (expense.createdBy !== userId) {
        throw new Error('Tylko twórca może edytować ten wydatek');
      }

      const expenseDoc = doc(db, COLLECTION_NAME, expenseId);
      await updateDoc(expenseDoc, expenseData);
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  },

  // Usuwa wydatek (tylko twórca może usunąć)
  async deleteExpense(expenseId: string, userId: string): Promise<void> {
    try {
      // Pobierz wydatek i sprawdź uprawnienia
      const expense = await this.getExpenseById(expenseId);
      
      if (!expense) {
        throw new Error('Wydatek nie został znaleziony');
      }
      
      if (expense.createdBy !== userId) {
        throw new Error('Tylko twórca może usunąć ten wydatek');
      }

      const expenseDoc = doc(db, COLLECTION_NAME, expenseId);
      await deleteDoc(expenseDoc);
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  },
};
