import express from 'express';
import { tripController } from '../controllers/tripController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

// Wszystkie endpointy trip wymagają autoryzacji
router.use(verifyToken);

/**
 * @openapi
 * /api/trips:
 *   get:
 *     tags:
 *       - Trips
 *     summary: Pobierz wszystkie podróże użytkownika
 *     description: Zwraca listę wszystkich podróży, w których użytkownik jest właścicielem lub uczestnikiem
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista podróży użytkownika
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 trips:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trip'
 *             example:
 *               success: true
 *               trips:
 *                 - id: "trip123"
 *                   name: "Wakacje w Grecji"
 *                   budget: 5000
 *                   ownerId: "user123"
 *                   participants:
 *                     - userId: "user123"
 *                       email: "jan.kowalski@example.com"
 *                       firstName: "Jan"
 *                       lastName: "Kowalski"
 *                   createdAt: "2026-01-15T10:00:00.000Z"
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
router.get('/', tripController.getUserTrips);

/**
 * @openapi
 * /api/trips/{id}:
 *   get:
 *     tags:
 *       - Trips
 *     summary: Pobierz szczegóły podróży
 *     description: Zwraca szczegółowe informacje o konkretnej podróży
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID podróży
 *     responses:
 *       200:
 *         description: Szczegóły podróży
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 trip:
 *                   $ref: '#/components/schemas/Trip'
 *             example:
 *               success: true
 *               trip:
 *                 id: "trip123"
 *                 name: "Wakacje w Grecji"
 *                 budget: 5000
 *                 ownerId: "user123"
 *                 participants:
 *                   - userId: "user123"
 *                     email: "jan.kowalski@example.com"
 *                     firstName: "Jan"
 *                     lastName: "Kowalski"
 *                 createdAt: "2026-01-15T10:00:00.000Z"
 *       401:
 *         description: Brak autoryzacji
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Brak dostępu do tej podróży
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Podróż nie została znaleziona
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
router.get('/:id', tripController.getTripById);

/**
 * @openapi
 * /api/trips:
 *   post:
 *     tags:
 *       - Trips
 *     summary: Utwórz nową podróż
 *     description: Tworzy nową podróż dla zalogowanego użytkownika
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTripData'
 *           example:
 *             name: "Wakacje w Grecji"
 *             budget: 5000
 *     responses:
 *       201:
 *         description: Podróż została utworzona
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 trip:
 *                   $ref: '#/components/schemas/Trip'
 *             example:
 *               success: true
 *               message: "Podróż została utworzona"
 *               trip:
 *                 id: "trip123"
 *                 name: "Wakacje w Grecji"
 *                 budget: 5000
 *                 ownerId: "user123"
 *                 participants:
 *                   - userId: "user123"
 *                     email: "jan.kowalski@example.com"
 *                     firstName: "Jan"
 *                     lastName: "Kowalski"
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
router.post('/', tripController.createTrip);

/**
 * @openapi
 * /api/trips/{id}:
 *   put:
 *     tags:
 *       - Trips
 *     summary: Aktualizuj podróż
 *     description: Aktualizuje dane istniejącej podróży (tylko właściciel)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID podróży
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTripData'
 *           example:
 *             name: "Wakacje w Grecji - zaktualizowane"
 *             budget: 6000
 *             participants:
 *               - userId: "user123"
 *                 email: "jan.kowalski@example.com"
 *                 firstName: "Jan"
 *                 lastName: "Kowalski"
 *               - userId: "user456"
 *                 email: "anna.nowak@example.com"
 *                 firstName: "Anna"
 *                 lastName: "Nowak"
 *     responses:
 *       200:
 *         description: Podróż została zaktualizowana
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 trip:
 *                   $ref: '#/components/schemas/Trip'
 *             example:
 *               success: true
 *               message: "Podróż została zaktualizowana"
 *               trip:
 *                 id: "trip123"
 *                 name: "Wakacje w Grecji - zaktualizowane"
 *                 budget: 6000
 *                 ownerId: "user123"
 *                 participants:
 *                   - userId: "user123"
 *                     email: "jan.kowalski@example.com"
 *                     firstName: "Jan"
 *                     lastName: "Kowalski"
 *                   - userId: "user456"
 *                     email: "anna.nowak@example.com"
 *                     firstName: "Anna"
 *                     lastName: "Nowak"
 *                 createdAt: "2026-01-15T10:00:00.000Z"
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
 *       403:
 *         description: Tylko właściciel może aktualizować podróż
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Podróż nie została znaleziona
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
router.put('/:id', tripController.updateTrip);

/**
 * @openapi
 * /api/trips/{id}:
 *   delete:
 *     tags:
 *       - Trips
 *     summary: Usuń podróż
 *     description: Usuwa podróż wraz ze wszystkimi powiązanymi danymi (tylko właściciel)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID podróży
 *     responses:
 *       200:
 *         description: Podróż została usunięta
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
 *               message: "Podróż została usunięta"
 *       401:
 *         description: Brak autoryzacji
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Tylko właściciel może usunąć podróż
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Podróż nie została znaleziona
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
router.delete('/:id', tripController.deleteTrip);

export default router;
