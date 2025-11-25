import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../config/firebase';

// rozszerzenie interfejsu Request o pole user
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
      };
    }
  }
}

/**
 * middleware do weryfikacji tokena JWT
 * sprawdza czy request zawiera poprawny token w headerze Authorization
 * dekoduje token i przypisuje dane użytkownika do req.user
 */
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // pobiera token z headera Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Brak tokena autoryzacji',
      });
      return;
    }

    // wyciąga token (usuwa prefix "Bearer ")
    const token = authHeader.substring(7);

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token jest wymagany',
      });
      return;
    }

    // weryfikuje token używając Firebase Admin SDK
    const decodedToken = await adminAuth.verifyIdToken(token);

    // przypisuje dane użytkownika do request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };

    // kontynuuje do następnego middleware/kontrolera
    next();
  } catch (error) {
    console.error('Błąd weryfikacji tokena:', error);
    
    res.status(401).json({
      success: false,
      message: 'Nieprawidłowy lub wygasły token',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * opcjonalny middleware - dodaje user do req jeśli token jest dostępny,
 * ale nie blokuje requestu jeśli tokena nie ma
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      if (token) {
        const decodedToken = await adminAuth.verifyIdToken(token);
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
        };
      }
    }
    
    next();
  } catch (error) {
    // Jeśli token jest nieprawidłowy, po prostu kontynuuj bez użytkownika
    console.error('Błąd opcjonalnej weryfikacji tokena:', error);
    next();
  }
};

