import { Request, Response } from 'express';
import { planService } from '../services/planService';
import { PlannerInput } from '../types/plan';

export const planController = {
  /**
   * POST /api/plans/generate
   * generuje nowy plan podróży przy użyciu AI
   */
  async generatePlan(req: Request, res: Response) {
    try {
      const userId = req.body.userId;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId jest wymagany',
        });
      }

      const input: PlannerInput = {
        destination: req.body.destination,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        budget: req.body.budget,
        participants: req.body.participants,
        interests: req.body.interests || [],
        transport: req.body.transport,
        accommodation: req.body.accommodation,
        must_visit: req.body.must_visit,
        avoid: req.body.avoid,
        intensity: req.body.intensity,
      };

      // Walidacja podstawowych pól
      if (!input.destination || !input.start_date || !input.end_date || !input.budget) {
        return res.status(400).json({
          success: false,
          error: 'Brakuje wymaganych pól: destination, start_date, end_date, budget',
        });
      }

      const plan = await planService.generatePlan(input, userId);

      res.status(201).json({
        success: true,
        data: plan,
      });
    } catch (error: any) {
      console.error('Błąd w generatePlan:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Nie udało się wygenerować planu',
      });
    }
  },

  /**
   * GET /api/plans
   * pobiera wszystkie plany danego usera
   */
  async getUserPlans(req: Request, res: Response) {
    try {
      const userId = req.query.userId as string;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId jest wymagany',
        });
      }

      const plans = await planService.getUserPlans(userId);

      res.status(200).json({
        success: true,
        data: plans,
      });
    } catch (error: any) {
      console.error('Błąd w getUserPlans:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Nie udało się pobrać planów',
      });
    }
  },

  /**
   * GET /api/plans/:id
   * pobiera pojedynczy plan po ID
   */
  async getPlanById(req: Request, res: Response) {
    try {
      const planId = req.params.id;
      const userId = req.query.userId as string;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId jest wymagany',
        });
      }

      const plan = await planService.getPlanById(planId, userId);

      if (!plan) {
        return res.status(404).json({
          success: false,
          error: 'Plan nie został znaleziony',
        });
      }

      res.status(200).json({
        success: true,
        data: plan,
      });
    } catch (error: any) {
      console.error('Błąd w getPlanById:', error);
      
      if (error.message === 'Brak dostępu do tego planu') {
        return res.status(403).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: error.message || 'Nie udało się pobrać planu',
      });
    }
  },

  /**
   * PUT /api/plans/:id
   * aktualizuje
   */
  async updatePlan(req: Request, res: Response) {
    try {
      const planId = req.params.id;
      const userId = req.body.userId;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId jest wymagany',
        });
      }

      const updates = req.body.updates;

      if (!updates) {
        return res.status(400).json({
          success: false,
          error: 'Brakuje danych do aktualizacji',
        });
      }

      const updatedPlan = await planService.updatePlan(planId, userId, updates);

      res.status(200).json({
        success: true,
        data: updatedPlan,
      });
    } catch (error: any) {
      console.error('Błąd w updatePlan:', error);
      
      if (error.message === 'Plan nie istnieje') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message === 'Brak dostępu do tego planu') {
        return res.status(403).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: error.message || 'Nie udało się zaktualizować planu',
      });
    }
  },

  /**
   * DELETE /api/plans/:id
   * Usuwa plan
   */
  async deletePlan(req: Request, res: Response) {
    try {
      const planId = req.params.id;
      const userId = req.body.userId || req.query.userId as string;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId jest wymagany',
        });
      }

      await planService.deletePlan(planId, userId);

      res.status(200).json({
        success: true,
        message: 'Plan został usunięty',
      });
    } catch (error: any) {
      console.error('Błąd w deletePlan:', error);
      
      if (error.message === 'Plan nie istnieje') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message === 'Brak dostępu do tego planu') {
        return res.status(403).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: error.message || 'Nie udało się usunąć planu',
      });
    }
  },
};

