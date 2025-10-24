import express from 'express';
import { expenseController } from '../controllers/expenseController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

// Wszystkie endpointy expense wymagają autoryzacji
router.use(verifyToken);

// GET /api/expenses/:tripId - Wydatki dla tripa
router.get('/:tripId', expenseController.getExpensesByTripId);

// POST /api/expenses - Tworzy nowy wydatek
router.post('/', expenseController.createExpense);

// PUT /api/expenses/:id - Aktualizuje dany wydatek
router.put('/:id', expenseController.updateExpense);

// DELETE /api/expenses/:id - Usuwa wydatek
router.delete('/:id', expenseController.deleteExpense);

export default router;
