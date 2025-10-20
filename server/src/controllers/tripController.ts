import { Request, Response } from 'express';
import { tripService } from '../services/tripService';

export const tripController = {
  // GET /api/trips - Pobiera wszystkie tripy
  async getAllTrips(req: Request, res: Response) {
    try {
      const trips = await tripService.getAllTrips();
      res.json({
        success: true,
        data: trips
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch trips',
        error: error instanceof Error ? error.message : 'Unknown error'
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
          message: 'Trip not found'
        });
      }
      
      res.json({
        success: true,
        data: trip
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch trip',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // POST /api/trips - Tworzy nowy trip
  async createTrip(req: Request, res: Response) {
    try {
      const { name, budget, participants } = req.body;
      
      // Walidacja
      if (!name || budget === undefined || !participants) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: name, budget, participants'
        });
      }
      
      const tripId = await tripService.createTrip({
        name,
        budget,
        participants
      });
      
      res.status(201).json({
        success: true,
        message: 'Trip created successfully',
        data: { id: tripId }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create trip',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // PUT /api/trips/:id - Aktualizuje trip
  async updateTrip(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      await tripService.updateTrip(id, updateData);
      
      res.json({
        success: true,
        message: 'Trip updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update trip',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // DELETE /api/trips/:id - Usuwa trip
  async deleteTrip(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await tripService.deleteTrip(id);
      
      res.json({
        success: true,
        message: 'Trip deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete trip',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};

