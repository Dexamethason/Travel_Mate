import { Router } from 'express';
import { planController } from '../controllers/planController';

const router = Router();

/**
 * @route   POST /api/plans/generate
 * @desc    generuje plan przy uzyciu AI
 */
router.post('/generate', planController.generatePlan);

/**
 * @route   GET /api/plans
 * @desc    pobiera wszystkie plany użytkownika
 */
router.get('/', planController.getUserPlans);

/**
 * @route   GET /api/plans/:id
 * @desc    pobiera pojedynczy plan po ID
 */
router.get('/:id', planController.getPlanById);

/**
 * @route   PUT /api/plans/:id
 * @desc    aktualizuje plan
 */
router.put('/:id', planController.updatePlan);

/**
 * @route   DELETE /api/plans/:id
 * @desc    usuwa plan
 */
router.delete('/:id', planController.deletePlan);

export default router;

