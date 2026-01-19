import express from 'express';
import { invitationController } from '../controllers/invitationController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

// Wszystkie endpointy invitation wymagają autoryzacji
router.use(verifyToken);

/**
 * @openapi
 * /api/invitations:
 *   post:
 *     tags:
 *       - Invitations
 *     summary: Wyślij zaproszenie do podróży
 *     description: Wysyła zaproszenie do wspólnej podróży innemu użytkownikowi
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInvitationData'
 *           example:
 *             tripId: "trip123"
 *             email: "anna.nowak@example.com"
 *     responses:
 *       201:
 *         description: Zaproszenie zostało wysłane
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 invitation:
 *                   $ref: '#/components/schemas/Invitation'
 *             example:
 *               success: true
 *               message: "Zaproszenie zostało wysłane"
 *               invitation:
 *                 id: "inv123"
 *                 tripId: "trip123"
 *                 tripName: "Wakacje w Grecji"
 *                 invitedEmail: "anna.nowak@example.com"
 *                 invitedUserId: "user456"
 *                 invitedBy: "user123"
 *                 invitedByName: "Jan Kowalski"
 *                 status: "pending"
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
 *       404:
 *         description: Użytkownik lub podróż nie zostały znalezione
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
router.post('/', invitationController.createInvitation);

/**
 * @openapi
 * /api/invitations:
 *   get:
 *     tags:
 *       - Invitations
 *     summary: Pobierz zaproszenia użytkownika
 *     description: Zwraca listę wszystkich zaproszeń dla zalogowanego użytkownika
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista zaproszeń użytkownika
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 invitations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Invitation'
 *             example:
 *               success: true
 *               invitations:
 *                 - id: "inv123"
 *                   tripId: "trip123"
 *                   tripName: "Wakacje w Grecji"
 *                   invitedEmail: "anna.nowak@example.com"
 *                   invitedUserId: "user456"
 *                   invitedBy: "user123"
 *                   invitedByName: "Jan Kowalski"
 *                   status: "pending"
 *                   createdAt: "2026-01-17T18:00:00.000Z"
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
router.get('/', invitationController.getUserInvitations);

/**
 * @openapi
 * /api/invitations/trip/{tripId}:
 *   get:
 *     tags:
 *       - Invitations
 *     summary: Pobierz zaproszenia dla podróży
 *     description: Zwraca listę wszystkich zaproszeń dla konkretnej podróży
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
 *         description: Lista zaproszeń dla podróży
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 invitations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Invitation'
 *       401:
 *         description: Brak autoryzacji
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Brak dostępu do zaproszeń tej podróży
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
router.get('/trip/:tripId', invitationController.getTripInvitations);

/**
 * @openapi
 * /api/invitations/{id}/accept:
 *   post:
 *     tags:
 *       - Invitations
 *     summary: Zaakceptuj zaproszenie
 *     description: Akceptuje zaproszenie do podróży i dodaje użytkownika jako uczestnika
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID zaproszenia
 *     responses:
 *       200:
 *         description: Zaproszenie zostało zaakceptowane
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
 *               message: "Zaproszenie zostało zaakceptowane"
 *       401:
 *         description: Brak autoryzacji
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Zaproszenie nie zostało znalezione
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
router.post('/:id/accept', invitationController.acceptInvitation);

/**
 * @openapi
 * /api/invitations/{id}/reject:
 *   post:
 *     tags:
 *       - Invitations
 *     summary: Odrzuć zaproszenie
 *     description: Odrzuca zaproszenie do podróży
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID zaproszenia
 *     responses:
 *       200:
 *         description: Zaproszenie zostało odrzucone
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
 *               message: "Zaproszenie zostało odrzucone"
 *       401:
 *         description: Brak autoryzacji
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Zaproszenie nie zostało znalezione
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
router.post('/:id/reject', invitationController.rejectInvitation);

export default router;

