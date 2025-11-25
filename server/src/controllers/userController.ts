import { Request, Response } from 'express';
import { authService } from '../services/authService';

export const userController = {
  // GET /api/users/search?email=... - Wyszukuje użytkownika po emailu
  async searchByEmail(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - user not authenticated',
        });
      }

      const { email } = req.query;

      if (!email || typeof email !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Email parameter is required',
        });
      }

      const user = await authService.getUserByEmail(email);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Zwróć tylko podstawowe dane użytkownika (bez wrażliwych informacji)
      res.json({
        success: true,
        data: {
          uid: user.uid,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to search for user',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // GET /api/users/me - Pobiera dane zalogowanego użytkownika
  async getCurrentUser(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - user not authenticated',
        });
      }

      const user = await authService.getUserByUid(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user data',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
};

