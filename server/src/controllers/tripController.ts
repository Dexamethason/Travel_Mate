
import { Request, Response } from 'express';
import { tripService } from '../services/tripService';
import { authService } from '../services/authService';

export const tripController = {
  // GET /api/trips - Pobiera tripy dla zalogowanego użytkownika
  async getUserTrips(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - user not authenticated',
        });
      }

      const trips = await tripService.getTripsByUserId(userId);
      res.json({
        success: true,
        data: trips,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch trips',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // GET /api/trips/:id - Pobiera trip po ID
  async getTripById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const trip = await tripService.getTripById(id);

      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found',
        });
      }

      res.json({
        success: true,
        data: trip,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch trip',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // POST /api/trips - Tworzy nowy trip
  async createTrip(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - user not authenticated',
        });
      }

      const { name, budget } = req.body;

      // Walidacja
      if (!name || budget === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: name, budget',
        });
      }

      // Pobierz dane użytkownika
      const user = await authService.getUserByUid(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      const tripId = await tripService.createTrip(
        {
          name,
          budget,
          ownerId: userId,
          participants: [],
        },
        {
          userId: user.uid,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      );

      res.status(201).json({
        success: true,
        message: 'Trip created successfully',
        data: { id: tripId },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create trip',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // PUT /api/trips/:id - Aktualizuje trip
  async updateTrip(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - user not authenticated',
        });
      }

      const { id } = req.params;
      const updateData = req.body;

      await tripService.updateTrip(id, userId, updateData);

      res.json({
        success: true,
        message: 'Trip updated successfully',
      });
    } catch (error) {
      const statusCode = error instanceof Error && 
        (error.message.includes('właściciel') || error.message.includes('owner'))
        ? 403
        : 500;

      res.status(statusCode).json({
        success: false,
        message: 'Failed to update trip',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // DELETE /api/trips/:id - Usuwa trip
  async deleteTrip(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - user not authenticated',
        });
      }

      const { id } = req.params;
      await tripService.deleteTrip(id, userId);

      res.json({
        success: true,
        message: 'Trip deleted successfully',
      });
    } catch (error) {
      const statusCode = error instanceof Error && 
        (error.message.includes('właściciel') || error.message.includes('owner'))
        ? 403
        : 500;

      res.status(statusCode).json({
        success: false,
        message: 'Failed to delete trip',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
};