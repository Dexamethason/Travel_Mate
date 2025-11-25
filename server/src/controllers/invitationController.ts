import { Request, Response } from 'express';
import { invitationService } from '../services/invitationService';

export const invitationController = {
  // POST /api/invitations - Wysyła zaproszenie do tripa
  async createInvitation(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - user not authenticated',
        });
      }

      const { tripId, email } = req.body;

      // Walidacja
      if (!tripId || !email) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: tripId, email',
        });
      }

      const invitationId = await invitationService.createInvitation(
        tripId,
        email,
        userId
      );

      res.status(201).json({
        success: true,
        message: 'Invitation sent successfully',
        data: { id: invitationId },
      });
    } catch (error) {
      const statusCode = error instanceof Error && 
        (error.message.includes('właściciel') || 
         error.message.includes('nie istnieje') ||
         error.message.includes('uczestnikiem') ||
         error.message.includes('oczekujące'))
        ? 400
        : 500;

      res.status(statusCode).json({
        success: false,
        message: 'Failed to send invitation',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // GET /api/invitations - Pobiera zaproszenia dla zalogowanego użytkownika
  async getUserInvitations(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - user not authenticated',
        });
      }

      const invitations = await invitationService.getInvitationsByUserId(userId);

      res.json({
        success: true,
        data: invitations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch invitations',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // GET /api/invitations/trip/:tripId - Pobiera zaproszenia dla tripa
  async getTripInvitations(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - user not authenticated',
        });
      }

      const { tripId } = req.params;

      const invitations = await invitationService.getInvitationsByTripId(tripId);

      res.json({
        success: true,
        data: invitations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch trip invitations',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // POST /api/invitations/:id/accept - Akceptuje zaproszenie
  async acceptInvitation(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - user not authenticated',
        });
      }

      const { id } = req.params;

      await invitationService.acceptInvitation(id, userId);

      res.json({
        success: true,
        message: 'Invitation accepted successfully',
      });
    } catch (error) {
      const statusCode = error instanceof Error && 
        error.message.includes('uprawnień')
        ? 403
        : 500;

      res.status(statusCode).json({
        success: false,
        message: 'Failed to accept invitation',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // POST /api/invitations/:id/reject - Odrzuca zaproszenie
  async rejectInvitation(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - user not authenticated',
        });
      }

      const { id } = req.params;

      await invitationService.rejectInvitation(id, userId);

      res.json({
        success: true,
        message: 'Invitation rejected successfully',
      });
    } catch (error) {
      const statusCode = error instanceof Error && 
        error.message.includes('uprawnień')
        ? 403
        : 500;

      res.status(statusCode).json({
        success: false,
        message: 'Failed to reject invitation',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
};

