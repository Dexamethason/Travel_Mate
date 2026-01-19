import express from 'express';
import { activityController } from '../controllers/activityController';

const router = express.Router();

/**
 * @openapi
 * /api/activities/attractions/search:
 *   get:
 *     tags:
 *       - Activities
 *     summary: Wyszukaj atrakcje turystyczne
 *     description: Wyszukuje atrakcje turystyczne za pomocą SerpAPI Google Local
 *     parameters:
 *       - in: query
 *         name: location
 *         required: true
 *         schema:
 *           type: string
 *         description: Lokalizacja wyszukiwania (miasto lub region)
 *         example: "Ateny, Grecja"
 *       - in: query
 *         name: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Dodatkowe słowa kluczowe wyszukiwania
 *         example: "muzeum"
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *         description: Typ miejsca (np. museum, park, monument)
 *         example: "museum"
 *       - in: query
 *         name: hl
 *         required: false
 *         schema:
 *           type: string
 *           default: "pl"
 *         description: Język wyników
 *         example: "pl"
 *       - in: query
 *         name: gl
 *         required: false
 *         schema:
 *           type: string
 *           default: "pl"
 *         description: Kraj wyników
 *         example: "pl"
 *     responses:
 *       200:
 *         description: Lista atrakcji turystycznych
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 attractions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Attraction'
 *             example:
 *               success: true
 *               attractions:
 *                 - id: "attr123"
 *                   name: "Akropol"
 *                   rating: 4.8
 *                   reviews: 45000
 *                   category: "Atrakcja turystyczna"
 *                   type: "monument"
 *                   priceRange: "€€"
 *                   status: "Otwarte"
 *                   openingHours: "08:00 - 20:00"
 *                   description: "Starożytna cytadela na wzgórzu"
 *                   address: "Athens 105 58, Grecja"
 *                   phone: "+30 21 0321 4172"
 *                   website: "https://odysseus.culture.gr"
 *                   photo: "https://example.com/acropolis.jpg"
 *                   geometry:
 *                     latitude: 37.9715
 *                     longitude: 23.7267
 *       400:
 *         description: Nieprawidłowe parametry wyszukiwania
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Parametr location jest wymagany"
 *       500:
 *         description: Błąd serwera lub SerpAPI
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/attractions/search', activityController.searchAttractions);

/**
 * @openapi
 * /api/activities/restaurants/search:
 *   get:
 *     tags:
 *       - Activities
 *     summary: Wyszukaj restauracje
 *     description: Wyszukuje restauracje za pomocą SerpAPI Google Local
 *     parameters:
 *       - in: query
 *         name: location
 *         required: true
 *         schema:
 *           type: string
 *         description: Lokalizacja wyszukiwania (miasto lub region)
 *         example: "Ateny, Grecja"
 *       - in: query
 *         name: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Dodatkowe słowa kluczowe wyszukiwania
 *         example: "grecka kuchnia"
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *         description: Typ kuchni lub restauracji
 *         example: "greek"
 *       - in: query
 *         name: hl
 *         required: false
 *         schema:
 *           type: string
 *           default: "pl"
 *         description: Język wyników
 *         example: "pl"
 *       - in: query
 *         name: gl
 *         required: false
 *         schema:
 *           type: string
 *           default: "pl"
 *         description: Kraj wyników
 *         example: "pl"
 *     responses:
 *       200:
 *         description: Lista restauracji
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 restaurants:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Restaurant'
 *             example:
 *               success: true
 *               restaurants:
 *                 - id: "rest123"
 *                   name: "Taverna Plaka"
 *                   rating: 4.5
 *                   reviews: 1250
 *                   cuisine: "Grecka"
 *                   priceRange: "€€"
 *                   isOpen: true
 *                   openingHours: "12:00 - 23:00"
 *                   description: "Tradycyjna grecka tawerna"
 *                   address: "Plaka, Athens 105 58, Grecja"
 *                   phone: "+30 21 0322 1234"
 *                   website: "https://tavernaplaka.gr"
 *                   photo: "https://example.com/taverna.jpg"
 *                   geometry:
 *                     latitude: 37.9738
 *                     longitude: 23.7275
 *       400:
 *         description: Nieprawidłowe parametry wyszukiwania
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Parametr location jest wymagany"
 *       500:
 *         description: Błąd serwera lub SerpAPI
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/restaurants/search', activityController.searchRestaurants);

export default router;

