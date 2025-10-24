import { Request, Response } from 'express';
import { authService } from '../services/authService';
import {
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  AuthResponse,
} from '../types/user';

// kontroler rejestracji
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName }: RegisterRequest = req.body;

    // walidacja danych na wejściu
    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({
        success: false,
        message: 'Wszystkie pola są wymagane',
        error: 'MISSING_FIELDS',
      } as AuthResponse);
      return;
    }

    // walidacja emaila
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: 'Nieprawidłowy adres e-mail',
        error: 'INVALID_EMAIL',
      } as AuthResponse);
      return;
    }

    // walidacja hasła
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Hasło musi mieć co najmniej 6 znaków',
        error: 'WEAK_PASSWORD',
      } as AuthResponse);
      return;
    }

    // rejestracja (wysyła email weryfikacyjny)
    const { user, emailSent } = await authService.registerUser(
      email,
      password,
      firstName,
      lastName
    );

    res.status(201).json({
      success: true,
      message: 'Konto zostało utworzone! Sprawdź swoją skrzynkę email i potwierdź adres, aby się zalogować.',
      user,
      emailSent,
      // NIE zwracamy tokena - user musi potwierdzić email!
    } as AuthResponse);
  } catch (error) {
    const err = error as Error;
    console.error('Błąd w kontrolerze register:', error);

    res.status(400).json({
      success: false,
      message: err.message || 'Nie udało się zarejestrować użytkownika',
      error: 'REGISTRATION_FAILED',
    } as AuthResponse);
  }
};

// kontroler logowania
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    // walidacja danych na wejściu
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email i hasło są wymagane',
        error: 'MISSING_FIELDS',
      } as AuthResponse);
      return;
    }

    // logowanie
    const { user, token } = await authService.loginUser(email, password);

    res.status(200).json({
      success: true,
      message: 'Zalogowano pomyślnie',
      user,
      token,
    } as AuthResponse);
  } catch (error) {
    const err = error as Error;
    console.error('Błąd w kontrolerze login:', err.message);

    res.status(401).json({
      success: false,
      message: err.message || 'Nieprawidłowy email lub hasło',
      error: 'LOGIN_FAILED',
    } as AuthResponse);
  }
};

// kontroler resetowania hasła
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email }: ForgotPasswordRequest = req.body;

    // walidacja danych na wejściu
    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email jest wymagany',
        error: 'MISSING_EMAIL',
      } as AuthResponse);
      return;
    }

    // walidacja emaila
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: 'Nieprawidłowy adres e-mail',
        error: 'INVALID_EMAIL',
      } as AuthResponse);
      return;
    }

    // wysłanie emaila resetującego hasło
    await authService.sendPasswordResetEmail(email);

    // zawsze zwraca sukces (z bezpieczeństwa)
    res.status(200).json({
      success: true,
      message:
        'Jeśli podany adres email istnieje w systemie, wysłaliśmy link do resetowania hasła',
    } as AuthResponse);
  } catch (error) {
    const err = error as Error;
    console.error('Błąd w kontrolerze forgotPassword:', err.message);

    res.status(200).json({
      success: true,
      message:
        'Jeśli podany adres email istnieje w systemie, wysłaliśmy link do resetowania hasła',
    } as AuthResponse);
  }
};

