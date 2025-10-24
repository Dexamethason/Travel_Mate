import { Request, Response } from 'express';
import { expenseService } from '../services/expenseService';

export const expenseController = {
  // GET /api/expenses/:tripId - Pobiera wszystkie wydatki dla tripa
  async getExpensesByTripId(req: Request, res: Response) {
    try {
      const { tripId } = req.params;
      const expenses = await expenseService.getExpensesByTripId(tripId);

      res.json({
        success: true,
        data: expenses,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch expenses',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // POST /api/expenses - Tworzy nowy wydatek
  async createExpense(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - user not authenticated',
        });
      }

      const { tripId, date, category, description, amount, splitWith } = req.body;

      // Walidacja
      if (!tripId || !date || !category || !description || amount === undefined || !splitWith) {
        return res.status(400).json({
          success: false,
          message:
            'Missing required fields: tripId, date, category, description, amount, splitWith',
        });
      }

      const expenseId = await expenseService.createExpense(
        {
          tripId,
          date,
          category,
          description,
          amount,
          splitWith,
        },
        userId
      );

      res.status(201).json({
        success: true,
        message: 'Expense created successfully',
        data: { id: expenseId },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create expense',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // PUT /api/expenses/:id - Aktualizuje wydatek
  async updateExpense(req: Request, res: Response) {
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

      await expenseService.updateExpense(id, userId, updateData);

      res.json({
        success: true,
        message: 'Expense updated successfully',
      });
    } catch (error) {
      const statusCode = error instanceof Error && 
        error.message.includes('twórca')
        ? 403
        : 500;

      res.status(statusCode).json({
        success: false,
        message: 'Failed to update expense',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // DELETE /api/expenses/:id - Usuwa wydatek
  async deleteExpense(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - user not authenticated',
        });
      }

      const { id } = req.params;
      await expenseService.deleteExpense(id, userId);

      res.json({
        success: true,
        message: 'Expense deleted successfully',
      });
    } catch (error) {
      const statusCode = error instanceof Error && 
        error.message.includes('twórca')
        ? 403
        : 500;

      res.status(statusCode).json({
        success: false,
        message: 'Failed to delete expense',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
};
