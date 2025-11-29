import express from 'express';
import { flightController } from '../controllers/flightController';

const router = express.Router();

// GET /api/flights/search
router.get('/search', flightController.search);


export default router;

