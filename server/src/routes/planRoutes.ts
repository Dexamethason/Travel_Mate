import { Router } from 'express';
import { planController } from '../controllers/planController';

const router = Router();

/**
 * @openapi
 * /api/plans/generate:
 *   post:
 *     tags:
 *       - Plans
 *     summary: Wygeneruj plan podróży za pomocą AI
 *     description: Generuje szczegółowy plan podróży na podstawie preferencji użytkownika za pomocą Google Gemini AI
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlannerInput'
 *           example:
 *             origin: "Warszawa"
 *             destination: "Ateny"
 *             start_date: "2026-06-15"
 *             end_date: "2026-06-22"
 *             budget: 5000
 *             participants: 2
 *             interests:
 *               - "historia"
 *               - "kultura"
 *               - "plaże"
 *             transport: "samolot"
 *             accommodation: "hotel"
 *             must_visit:
 *               - "Akropol"
 *               - "Partenon"
 *             avoid:
 *               - "miejsca tłumne"
 *             intensity: "moderate"
 *     responses:
 *       201:
 *         description: Plan podróży został wygenerowany
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 plan:
 *                   $ref: '#/components/schemas/TravelPlan'
 *             example:
 *               success: true
 *               plan:
 *                 id: "plan123"
 *                 userId: "user123"
 *                 destination: "Ateny"
 *                 start_date: "2026-06-15"
 *                 end_date: "2026-06-22"
 *                 days:
 *                   - day: 1
 *                     date: "2026-06-15"
 *                     activities:
 *                       - name: "Przylot do Aten"
 *                         type: "transport"
 *                         time: "10:00"
 *                         cost_estimate: 450
 *                         notes: "Lot z Warszawy"
 *                         location: "Lotnisko Ateny"
 *                       - name: "Zameldowanie w hotelu"
 *                         type: "accommodation"
 *                         time: "14:00"
 *                         cost_estimate: 250
 *                         location: "Hotel Grande Bretagne"
 *                     daily_cost: 700
 *                 total_estimated_cost: 4900
 *                 tips:
 *                   - "Zarezerwuj bilety na Akropol online"
 *                   - "Najlepszy czas na zwiedzanie to rano"
 *                 created_at: "2026-01-17T18:00:00.000Z"
 *                 updated_at: "2026-01-17T18:00:00.000Z"
 *       400:
 *         description: Nieprawidłowe dane wejściowe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Błąd serwera lub AI
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/generate', planController.generatePlan);

/**
 * @openapi
 * /api/plans:
 *   get:
 *     tags:
 *       - Plans
 *     summary: Pobierz wszystkie plany użytkownika
 *     description: Zwraca listę wszystkich planów podróży użytkownika
 *     responses:
 *       200:
 *         description: Lista planów użytkownika
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 plans:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TravelPlan'
 *             example:
 *               success: true
 *               plans:
 *                 - id: "plan123"
 *                   userId: "user123"
 *                   destination: "Ateny"
 *                   start_date: "2026-06-15"
 *                   end_date: "2026-06-22"
 *                   total_estimated_cost: 4900
 *                   created_at: "2026-01-17T18:00:00.000Z"
 *       500:
 *         description: Błąd serwera
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', planController.getUserPlans);

/**
 * @openapi
 * /api/plans/{id}:
 *   get:
 *     tags:
 *       - Plans
 *     summary: Pobierz szczegóły planu
 *     description: Zwraca szczegółowe informacje o konkretnym planie podróży
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID planu
 *     responses:
 *       200:
 *         description: Szczegóły planu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 plan:
 *                   $ref: '#/components/schemas/TravelPlan'
 *       404:
 *         description: Plan nie został znaleziony
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Błąd serwera
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', planController.getPlanById);

/**
 * @openapi
 * /api/plans/{id}:
 *   put:
 *     tags:
 *       - Plans
 *     summary: Aktualizuj plan
 *     description: Aktualizuje istniejący plan podróży
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID planu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               days:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/PlanDay'
 *               tips:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Plan został zaktualizowany
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 plan:
 *                   $ref: '#/components/schemas/TravelPlan'
 *       404:
 *         description: Plan nie został znaleziony
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Błąd serwera
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', planController.updatePlan);

/**
 * @openapi
 * /api/plans/{id}:
 *   delete:
 *     tags:
 *       - Plans
 *     summary: Usuń plan
 *     description: Usuwa plan podróży
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID planu
 *     responses:
 *       200:
 *         description: Plan został usunięty
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               message: "Plan został usunięty"
 *       404:
 *         description: Plan nie został znaleziony
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Błąd serwera
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', planController.deletePlan);

export default router;

