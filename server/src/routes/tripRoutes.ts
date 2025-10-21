import express from 'express';
import { tripController } from '../controllers/tripController';

const router = express.Router();

// GET /api/trips - Lista wszystkich tripów
router.get('/', tripController.getAllTrips);

// GET /api/trips/:id - Szczegóły tripa
router.get('/:id', tripController.getTripById);

// POST /api/trips - Tworzy nowy trip
router.post('/', tripController.createTrip);

// PUT /api/trips/:id - Aktualizuje dany trip
router.put('/:id', tripController.updateTrip);

// DELETE /api/trips/:id - Usuwa dany trip
router.delete('/:id', tripController.deleteTrip);

export default router;

