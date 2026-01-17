import express from 'express';
import { flightController } from '../controllers/flightController';

const router = express.Router();

/**
 * @openapi
 * /api/flights/search:
 *   get:
 *     tags:
 *       - Flights
 *     summary: Wyszukaj loty
 *     description: Wyszukuje dostępne loty za pomocą Amadeus API. Obsługuje loty w jedną stronę i powrotne.
 *     parameters:
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *         description: Kod IATA lotniska wylotu (np. WAW)
 *         example: WAW
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *         description: Kod IATA lotniska przylotu (np. LHR)
 *         example: LHR
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Data wylotu (YYYY-MM-DD)
 *         example: "2026-06-15"
 *       - in: query
 *         name: returnDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Data powrotu (YYYY-MM-DD) - opcjonalna dla lotów powrotnych
 *         example: "2026-06-22"
 *       - in: query
 *         name: passengers
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Liczba pasażerów
 *         example: 2
 *     responses:
 *       200:
 *         description: Lista dostępnych lotów
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 flights:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Flight'
 *             example:
 *               success: true
 *               flights:
 *                 - id: "1"
 *                   airline: "LOT Polish Airlines"
 *                   stops: "0"
 *                   departureTime: "10:30"
 *                   departureAirport: "WAW"
 *                   arrivalTime: "12:45"
 *                   arrivalAirport: "LHR"
 *                   duration: "2h 15m"
 *                   type: "round-trip"
 *                   price: 450.00
 *                   returnAirline: "LOT Polish Airlines"
 *                   returnStops: "0"
 *                   returnDepartureTime: "14:00"
 *                   returnDepartureAirport: "LHR"
 *                   returnArrivalTime: "18:15"
 *                   returnArrivalAirport: "WAW"
 *                   returnDuration: "2h 15m"
 *       400:
 *         description: Nieprawidłowe parametry wyszukiwania
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Parametry from, to i date są wymagane"
 *       500:
 *         description: Błąd serwera lub Amadeus API
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/search', flightController.search);


export default router;

