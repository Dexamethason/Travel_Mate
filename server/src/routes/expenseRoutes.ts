import express from 'express';
import { expenseController } from '../controllers/expenseController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

// Wszystkie endpointy expense wymagają autoryzacji
router.use(verifyToken);

/**
 * @openapi
 * /api/expenses/{tripId}:
 *   get:
 *     tags:
 *       - Expenses
 *     summary: Pobierz wydatki dla podróży
 *     description: Zwraca listę wszystkich wydatków dla konkretnej podróży
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID podróży
 *     responses:
 *       200:
 *         description: Lista wydatków dla podróży
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 expenses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Expense'
 *             example:
 *               success: true
 *               expenses:
 *                 - id: "exp123"
 *                   tripId: "trip123"
 *                   createdBy: "user123"
 *                   date: "2026-06-15"
 *                   category: "transport"
 *                   description: "Lot do Aten"
 *                   amount: 450
 *                   splitWith:
 *                     - participantId: "user123"
 *                       amount: 225
 *                     - participantId: "user456"
 *                       amount: 225
 *                   createdAt: "2026-01-17T18:00:00.000Z"
 *       401:
 *         description: Brak autoryzacji
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Brak dostępu do wydatków tej podróży
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Błąd serwera
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:tripId', expenseController.getExpensesByTripId);

/**
 * @openapi
 * /api/expenses:
 *   post:
 *     tags:
 *       - Expenses
 *     summary: Utwórz nowy wydatek
 *     description: Dodaje nowy wydatek do podróży
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateExpenseData'
 *           example:
 *             tripId: "trip123"
 *             date: "2026-06-15"
 *             category: "food"
 *             description: "Kolacja w restauracji"
 *             amount: 120
 *             splitWith:
 *               - participantId: "user123"
 *                 amount: 60
 *               - participantId: "user456"
 *                 amount: 60
 *     responses:
 *       201:
 *         description: Wydatek został utworzony
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 expense:
 *                   $ref: '#/components/schemas/Expense'
 *             example:
 *               success: true
 *               message: "Wydatek został utworzony"
 *               expense:
 *                 id: "exp124"
 *                 tripId: "trip123"
 *                 createdBy: "user123"
 *                 date: "2026-06-15"
 *                 category: "food"
 *                 description: "Kolacja w restauracji"
 *                 amount: 120
 *                 splitWith:
 *                   - participantId: "user123"
 *                     amount: 60
 *                   - participantId: "user456"
 *                     amount: 60
 *                 createdAt: "2026-01-17T18:00:00.000Z"
 *       400:
 *         description: Nieprawidłowe dane wejściowe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Brak autoryzacji
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Błąd serwera
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', expenseController.createExpense);

/**
 * @openapi
 * /api/expenses/{id}:
 *   put:
 *     tags:
 *       - Expenses
 *     summary: Aktualizuj wydatek
 *     description: Aktualizuje istniejący wydatek
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID wydatku
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *               splitWith:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/SplitParticipant'
 *           example:
 *             date: "2026-06-15"
 *             category: "food"
 *             description: "Kolacja w restauracji - zaktualizowane"
 *             amount: 150
 *             splitWith:
 *               - participantId: "user123"
 *                 amount: 75
 *               - participantId: "user456"
 *                 amount: 75
 *     responses:
 *       200:
 *         description: Wydatek został zaktualizowany
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 expense:
 *                   $ref: '#/components/schemas/Expense'
 *       400:
 *         description: Nieprawidłowe dane wejściowe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Brak autoryzacji
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Wydatek nie został znaleziony
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Błąd serwera
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', expenseController.updateExpense);

/**
 * @openapi
 * /api/expenses/{id}:
 *   delete:
 *     tags:
 *       - Expenses
 *     summary: Usuń wydatek
 *     description: Usuwa wydatek z podróży
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID wydatku
 *     responses:
 *       200:
 *         description: Wydatek został usunięty
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               message: "Wydatek został usunięty"
 *       401:
 *         description: Brak autoryzacji
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Wydatek nie został znaleziony
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Błąd serwera
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', expenseController.deleteExpense);

export default router;
