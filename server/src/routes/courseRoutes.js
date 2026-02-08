"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courseController_1 = require("../controllers/courseController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get('/courses', courseController_1.getCourses); // Public?
router.post('/courses', authMiddleware_1.authenticateToken, courseController_1.createCourse);
router.post('/subjects', authMiddleware_1.authenticateToken, courseController_1.createSubject);
exports.default = router;
//# sourceMappingURL=courseRoutes.js.map