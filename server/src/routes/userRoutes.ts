import express from 'express';
import { userController } from '../controllers/userController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

// Wszystkie endpointy user wymagają autoryzacji
router.use(verifyToken);

/**
 * @openapi
 * /api/users/search:
 *   get:
 *     tags:
 *       - Users
 *     summary: Wyszukaj użytkownika po emailu
 *     description: Wyszukuje użytkownika w systemie po adresie email (używane do wysyłania zaproszeń)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Adres email użytkownika
 *         example: "anna.nowak@example.com"
 *     responses:
 *       200:
 *         description: Użytkownik został znaleziony
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               user:
 *                 uid: "user456"
 *                 email: "anna.nowak@example.com"
 *                 firstName: "Anna"
 *                 lastName: "Nowak"
 *                 createdAt: "2026-01-10T12:00:00.000Z"
 *       400:
 *         description: Brak parametru email
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
 *         description: Użytkownik nie został znaleziony
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
router.get('/search', userController.searchByEmail);

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Pobierz dane zalogowanego użytkownika
 *     description: Zwraca profil aktualnie zalogowanego użytkownika
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dane użytkownika
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               user:
 *                 uid: "user123"
 *                 email: "jan.kowalski@example.com"
 *                 firstName: "Jan"
 *                 lastName: "Kowalski"
 *                 createdAt: "2026-01-17T18:00:00.000Z"
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
router.get('/me', userController.getCurrentUser);

export default router;

