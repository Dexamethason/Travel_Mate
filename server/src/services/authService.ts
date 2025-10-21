import { db } from '../config/firebase';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore/lite';

const USERS_COLLECTION = 'users';

export const authService = {
  async findUserByEmail(email: string) {
    const usersCol = collection(db, USERS_COLLECTION);
    const q = query(usersCol, where('email', '==', email));
    const snapshot = await getDocs(q);
    if (snapshot.docs.length === 0) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  },

  async registerUser(payload: { firstName: string; lastName: string; email: string; password: string; }) {
    const exists = await this.findUserByEmail(payload.email);
    if (exists) {
      const err: any = new Error('User already exists');
      err.code = 'USER_EXISTS';
      throw err;
    }

    const user = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: payload.password, // NOTE: storing plain password for dev only
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, USERS_COLLECTION), user);
    return { id: docRef.id, ...user };
  },

  async loginUser(email: string, password: string) {
    const user: any = await this.findUserByEmail(email);
    if (!user) {
      const err: any = new Error('Invalid credentials');
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }
    if ((user as any).password !== password) {
      const err: any = new Error('Invalid credentials');
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }

    // For dev: return a simple token (user id). In production, use JWT.
    return { id: user.id, token: user.id };
  },

  async forgotPassword(email: string) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      const err: any = new Error('User not found');
      err.code = 'NOT_FOUND';
      throw err;
    }
    // In a real app, send an email. Here we just simulate success.
    return { message: 'Reset email sent' };
  },

  // DEV: list all users (for testing only)
  async getAllUsers() {
    const usersCol = collection(db, USERS_COLLECTION);
    const snapshot = await getDocs(usersCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};
