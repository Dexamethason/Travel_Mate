import express from 'express';
import { register, login, forgotPassword } from '../controllers/authController';

const router = express.Router();

/**
 * POST /api/auth/register
 * Rejestracja nowego użytkownika
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Logowanie użytkownika
 */
router.post('/login', login);

/**
 * POST /api/auth/forgot-password
 * Wysyłanie emaila z linkiem do resetowania hasła
 */
router.post('/forgot-password', forgotPassword);

/**
 * Do logoutu nie ma endpointu
 * frontend wylogowuje się poprzez czyszczenie localStorage :D
 */

export default router;

