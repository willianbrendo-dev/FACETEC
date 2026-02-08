import { Router } from 'express';
import {
    getClasses, createClass,
    createEnrollment, getEnrollments,
    createSession, getSessions,
    markAttendance, getAttendance,
    createGrade, getGrades
} from '../controllers/classController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/classes', getClasses);
router.post('/classes', authenticateToken, createClass);

router.post('/enrollments', authenticateToken, createEnrollment);
router.get('/enrollments', getEnrollments);

router.post('/sessions', createSession);
router.get('/sessions', getSessions);

router.post('/attendance', markAttendance);
router.get('/attendance', getAttendance);

router.post('/grades', createGrade);
router.get('/grades', getGrades);

export default router;
