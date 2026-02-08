"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubject = exports.createCourse = exports.getCourses = void 0;
const prisma_1 = require("../lib/prisma");
// Courses
const getCourses = async (req, res) => {
    try {
        const courses = await prisma_1.prisma.course.findMany({
            include: {
                subjects: true
            }
        });
        res.json(courses);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching courses' });
    }
};
exports.getCourses = getCourses;
const createCourse = async (req, res) => {
    try {
        const { name, code, credits } = req.body;
        const course = await prisma_1.prisma.course.create({
            data: { name, code, credits }
        });
        res.json(course);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating course' });
    }
};
exports.createCourse = createCourse;
// Subjects
const createSubject = async (req, res) => {
    try {
        const { name, code, courseId } = req.body;
        const subject = await prisma_1.prisma.subject.create({
            data: { name, code, courseId }
        });
        res.json(subject);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating subject' });
    }
};
exports.createSubject = createSubject;
//# sourceMappingURL=courseController.js.map