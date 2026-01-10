import express from 'express';
import { activityController } from '../controllers/activityController';

const router = express.Router();

/**
 * @route   GET /api/activities/attractions/search
 * @desc    wyszukiwanie atrakcji turystycznych
 * @query   location (required) - lokalizacja wyszukiwania
 * @query   query (optional) - dodatkowe słowa kluczowe
 * @query   type (optional) - typ miejsca
 * @query   hl (optional) - język (domyślnie: pl)
 * @query   gl (optional) - kraj (domyślnie: pl)
 */
router.get('/attractions/search', activityController.searchAttractions);

/**
 * @route   GET /api/activities/restaurants/search
 * @desc    wyszukiwanie restauracji
 * @query   location (required) - lokalizacja wyszukiwania
 * @query   query (optional) - dodatkowe słowa kluczowe
 * @query   type (optional) - typ miejsca
 * @query   hl (optional) - język (domyślnie: pl)
 * @query   gl (optional) - kraj (domyślnie: pl)
 */
router.get('/restaurants/search', activityController.searchRestaurants);

export default router;

