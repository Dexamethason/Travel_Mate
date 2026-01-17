import express from 'express';
import { register, login, forgotPassword } from '../controllers/authController';

const router = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Rejestracja nowego użytkownika
 *     description: Tworzy nowe konto użytkownika w Firebase Authentication i zapisuje dane w Firestore
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           example:
 *             email: "jan.kowalski@example.com"
 *             password: "SecurePass123!"
 *             firstName: "Jan"
 *             lastName: "Kowalski"
 *     responses:
 *       201:
 *         description: Użytkownik został pomyślnie zarejestrowany
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               success: true
 *               message: "Użytkownik zarejestrowany pomyślnie"
 *               user:
 *                 uid: "abc123xyz"
 *                 email: "jan.kowalski@example.com"
 *                 firstName: "Jan"
 *                 lastName: "Kowalski"
 *                 createdAt: "2026-01-17T18:00:00.000Z"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Nieprawidłowe dane wejściowe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Wszystkie pola są wymagane"
 *       409:
 *         description: Użytkownik z tym emailem już istnieje
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Użytkownik z tym emailem już istnieje"
 *       500:
 *         description: Błąd serwera
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logowanie użytkownika
 *     description: Uwierzytelnia użytkownika za pomocą Firebase Authentication i zwraca JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "jan.kowalski@example.com"
 *             password: "SecurePass123!"
 *     responses:
 *       200:
 *         description: Użytkownik został pomyślnie zalogowany
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               success: true
 *               message: "Zalogowano pomyślnie"
 *               user:
 *                 uid: "abc123xyz"
 *                 email: "jan.kowalski@example.com"
 *                 firstName: "Jan"
 *                 lastName: "Kowalski"
 *                 createdAt: "2026-01-17T18:00:00.000Z"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Nieprawidłowe dane wejściowe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Email i hasło są wymagane"
 *       401:
 *         description: Nieprawidłowe dane logowania
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Nieprawidłowy email lub hasło"
 *       500:
 *         description: Błąd serwera
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', login);

/**
 * @openapi
 * /api/auth/forgot-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Resetowanie hasła
 *     description: Wysyła email z linkiem do resetowania hasła za pomocą Firebase Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *           example:
 *             email: "jan.kowalski@example.com"
 *     responses:
 *       200:
 *         description: Email z linkiem do resetowania hasła został wysłany
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Email z linkiem do resetowania hasła został wysłany"
 *       400:
 *         description: Nieprawidłowe dane wejściowe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Email jest wymagany"
 *       404:
 *         description: Użytkownik nie został znaleziony
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Nie znaleziono użytkownika z tym adresem email"
 *       500:
 *         description: Błąd serwera
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/forgot-password', forgotPassword);

/**
 * Do logoutu nie ma endpointu
 * frontend wylogowuje się poprzez czyszczenie localStorage :D
 */

export default router;

