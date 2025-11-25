import express from 'express';
import { invitationController } from '../controllers/invitationController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

// Wszystkie endpointy invitation wymagają autoryzacji
router.use(verifyToken);

// POST /api/invitations - Wysyła zaproszenie do tripa
router.post('/', invitationController.createInvitation);

// GET /api/invitations - Pobiera zaproszenia dla zalogowanego użytkownika
router.get('/', invitationController.getUserInvitations);

// GET /api/invitations/trip/:tripId - Pobiera zaproszenia dla tripa
router.get('/trip/:tripId', invitationController.getTripInvitations);

// POST /api/invitations/:id/accept - Akceptuje zaproszenie
router.post('/:id/accept', invitationController.acceptInvitation);

// POST /api/invitations/:id/reject - Odrzuca zaproszenie
router.post('/:id/reject', invitationController.rejectInvitation);

export default router;

