import express from 'express';
import { userController } from '../controllers/userController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

// Wszystkie endpointy user wymagają autoryzacji
router.use(verifyToken);

// GET /api/users/search?email=... - Wyszukuje użytkownika po emailu
router.get('/search', userController.searchByEmail);

// GET /api/users/me - Pobiera dane zalogowanego użytkownika
router.get('/me', userController.getCurrentUser);

export default router;

