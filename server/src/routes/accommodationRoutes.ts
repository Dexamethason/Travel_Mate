import express from 'express';
import { getAccommodations } from '../controllers/accommodationController';

const router = express.Router();

/**
 * @openapi
 * /api/accommodations/search:
 *   get:
 *     tags:
 *       - Accommodations
 *     summary: Wyszukaj noclegi
 *     description: Wyszukuje dostępne noclegi (hotele) za pomocą SerpAPI Google Hotels
 *     parameters:
 *       - in: query
 *         name: location
 *         required: true
 *         schema:
 *           type: string
 *         description: Lokalizacja (miasto lub region)
 *         example: "Ateny, Grecja"
 *       - in: query
 *         name: checkInDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Data zameldowania (YYYY-MM-DD)
 *         example: "2026-06-15"
 *       - in: query
 *         name: checkOutDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Data wymeldowania (YYYY-MM-DD)
 *         example: "2026-06-22"
 *       - in: query
 *         name: adults
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 2
 *         description: Liczba dorosłych
 *         example: 2
 *       - in: query
 *         name: children
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Liczba dzieci
 *         example: 0
 *       - in: query
 *         name: currency
 *         required: false
 *         schema:
 *           type: string
 *           default: "PLN"
 *         description: Waluta cen
 *         example: "PLN"
 *     responses:
 *       200:
 *         description: Lista dostępnych noclegów
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 accommodations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Accommodation'
 *             example:
 *               success: true
 *               accommodations:
 *                 - id: "hotel123"
 *                   name: "Hotel Grande Bretagne"
 *                   description: "Luksusowy hotel w centrum Aten"
 *                   location:
 *                     latitude: 37.9755
 *                     longitude: 23.7348
 *                     address: "Syntagma Square, Athens"
 *                   price:
 *                     amount: 250
 *                     currency: "PLN"
 *                     totalAmount: 1750
 *                   rating: 4.7
 *                   reviews: 1250
 *                   imageUrl: "https://example.com/hotel.jpg"
 *                   amenities:
 *                     - "WiFi"
 *                     - "Basen"
 *                     - "Spa"
 *                   link: "https://booking.com/hotel123"
 *                   hotelClass: 5
 *       400:
 *         description: Nieprawidłowe parametry wyszukiwania
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Parametry location, checkInDate i checkOutDate są wymagane"
 *       500:
 *         description: Błąd serwera lub SerpAPI
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/search', getAccommodations);

export default router;

