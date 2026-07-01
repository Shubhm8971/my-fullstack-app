import express from 'express';
import authRoutes from './AuthRoutes.js';
import logRoutes from './LogRoutes.js';
import userRoutes from './UserRoutes.js';
import alertRoutes from './AlertRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/logs', logRoutes);
router.use('/users', userRoutes);
router.use('/alerts', alertRoutes);

export default router;
