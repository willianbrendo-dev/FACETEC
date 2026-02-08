import { Router } from 'express';
import { getCourses, createCourse, createSubject, getSubjects } from '../controllers/courseController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/courses', getCourses); // Public?
router.get('/subjects', getSubjects);

router.post('/courses', authenticateToken, createCourse);
router.post('/subjects', authenticateToken, createSubject);

export default router;
