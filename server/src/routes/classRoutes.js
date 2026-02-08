"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const classController_1 = require("../controllers/classController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get('/classes', classController_1.getClasses);
router.post('/classes', authMiddleware_1.authenticateToken, classController_1.createClass);
router.post('/enrollments', authMiddleware_1.authenticateToken, classController_1.createEnrollment);
router.get('/enrollments', classController_1.getEnrollments);
router.post('/sessions', classController_1.createSession);
router.get('/sessions', classController_1.getSessions);
router.post('/attendance', classController_1.markAttendance);
router.get('/attendance', classController_1.getAttendance);
router.post('/grades', classController_1.createGrade);
router.get('/grades', classController_1.getGrades);
exports.default = router;
//# sourceMappingURL=classRoutes.js.map