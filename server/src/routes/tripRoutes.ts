import express from 'express';
import { tripController } from '../controllers/tripController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

// Wszystkie endpointy trip wymagają autoryzacji
router.use(verifyToken);

// GET /api/trips - Lista tripów dla zalogowanego użytkownika
router.get('/', tripController.getUserTrips);

// GET /api/trips/:id - Szczegóły tripa
router.get('/:id', tripController.getTripById);

// POST /api/trips - Tworzy nowy trip
router.post('/', tripController.createTrip);

// PUT /api/trips/:id - Aktualizuje dany trip
router.put('/:id', tripController.updateTrip);

// DELETE /api/trips/:id - Usuwa dany trip
router.delete('/:id', tripController.deleteTrip);

export default router;
