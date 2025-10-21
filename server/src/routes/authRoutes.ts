import express from 'express';
import { authController } from '../controllers/authController';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
// DEV: list users
router.get('/users', authController.getUsers);

export default router;
