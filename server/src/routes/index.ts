import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import courseRoutes from './courseRoutes';
import classRoutes from './classRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/', courseRoutes); // /courses, /subjects
router.use('/', classRoutes); // /classes, /enrollments, etc.

export default router;
