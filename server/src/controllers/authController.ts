import { Request, Response } from 'express';
import { authService } from '../services/authService';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, password } = req.body;
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const user = await authService.registerUser({ firstName, lastName, email, password });
      res.status(201).json({ success: true, data: { id: user.id } });
    } catch (err: any) {
      if (err.code === 'USER_EXISTS') return res.status(409).json({ message: 'User already exists' });
      res.status(500).json({ message: err.message || 'Registration failed' });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: 'Brak wymaganych pól' });
      const result = await authService.loginUser(email, password);
      res.json({ success: true, token: result.token });
    } catch (err: any) {
      if (err.code === 'INVALID_CREDENTIALS') return res.status(401).json({ message: 'Nieprawidłowy email lub hasło' });
      res.status(500).json({ message: err.message || 'Błąd logowania' });
    }
  },

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: 'Missing email' });
      await authService.forgotPassword(email);
      res.json({ success: true, message: 'Reset email sent' });
    } catch (err: any) {
      if (err.code === 'NOT_FOUND') return res.status(404).json({ message: 'User not found' });
      res.status(500).json({ message: err.message || 'Failed to send reset' });
    }
  }
  ,
  // DEV: list users
  async getUsers(req: Request, res: Response) {
    try {
      const users = await (await import('../services/authService')).authService.getAllUsers();
      res.json({ success: true, data: users });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Failed to fetch users' });
    }
  }
};
