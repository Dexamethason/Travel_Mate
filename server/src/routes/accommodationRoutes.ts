import express from 'express';
import { getAccommodations } from '../controllers/accommodationController';

const router = express.Router();

// GET /api/accommodations/search
router.get('/search', getAccommodations);

export default router;

