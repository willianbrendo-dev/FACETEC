"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGrades = exports.createGrade = exports.getAttendance = exports.markAttendance = exports.getSessions = exports.createSession = exports.getEnrollments = exports.createEnrollment = exports.createClass = exports.getClasses = void 0;
const prisma_1 = require("../lib/prisma");
// Classes
const getClasses = async (req, res) => {
    try {
        const classes = await prisma_1.prisma.class.findMany({
            include: {
                subject: true,
                professor: {
                    select: { id: true, name: true, email: true }
                },
                // Include empty arrays for sessions/enrollments to match old API if needed
                // or just let frontend rely on separate fetches. 
                // However, Prisma makes it easy to include them.
                // The old API returned empty arrays.
                // Let's include them but formatted or just rely on standard Prisma return.
                // Frontend academicStore expects:
                // subject: { id, name, code } (Prisma returns this)
                // professor: { id, name, email } (Prisma returns this)
            }
        });
        // Transform to exact shape if necessary, but Prisma's JSON structure is usually compatible.
        // We might need to ensure 'sessions' and 'enrollments' are present if frontend crashes without them.
        const result = classes.map((c) => ({
            ...c,
            sessions: [], // matching old API behavior of returning empty for list
            enrollments: []
        }));
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching classes' });
    }
};
exports.getClasses = getClasses;
const createClass = async (req, res) => {
    try {
        const { subjectId, professorId, room, schedule, term, status } = req.body;
        const cls = await prisma_1.prisma.class.create({
            data: { subjectId, professorId, room, schedule, term, status }
        });
        res.json(cls);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating class' });
    }
};
exports.createClass = createClass;
// Enrollments
const createEnrollment = async (req, res) => {
    try {
        const { studentId, classId } = req.body;
        const enrollment = await prisma_1.prisma.enrollment.create({
            data: { studentId, classId }
        });
        res.json(enrollment);
    }
    catch (error) {
        res.status(500).json({ error: 'Error enrolling student' });
    }
};
exports.createEnrollment = createEnrollment;
const getEnrollments = async (req, res) => {
    try {
        const enrollments = await prisma_1.prisma.enrollment.findMany();
        res.json(enrollments);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching enrollments' });
    }
};
exports.getEnrollments = getEnrollments;
// Sessions
const createSession = async (req, res) => {
    try {
        const { classId, date, topic, description } = req.body;
        // Convert date string to DateTime if necessary, Prisma handles ISO strings automatically
        const session = await prisma_1.prisma.classSession.create({
            data: { classId, date: new Date(date), topic, description }
        });
        res.json(session);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating session' });
    }
};
exports.createSession = createSession;
const getSessions = async (req, res) => {
    try {
        const sessions = await prisma_1.prisma.classSession.findMany();
        res.json(sessions);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching sessions' });
    }
};
exports.getSessions = getSessions;
// Attendance
const markAttendance = async (req, res) => {
    try {
        const { sessionId, studentId, present } = req.body;
        const attendance = await prisma_1.prisma.attendance.create({
            data: { sessionId, studentId, present }
        });
        res.json(attendance);
    }
    catch (error) {
        res.status(500).json({ error: 'Error marking attendance' });
    }
};
exports.markAttendance = markAttendance;
const getAttendance = async (req, res) => {
    try {
        const attendance = await prisma_1.prisma.attendance.findMany();
        res.json(attendance);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching attendance' });
    }
};
exports.getAttendance = getAttendance;
// Grades
const createGrade = async (req, res) => {
    try {
        const { studentId, assessmentId, value } = req.body;
        const grade = await prisma_1.prisma.grade.upsert({
            where: {
                studentId_assessmentId: {
                    studentId,
                    assessmentId
                }
            },
            update: { value },
            create: { studentId, assessmentId, value }
        });
        res.json(grade);
    }
    catch (error) {
        res.status(500).json({ error: 'Error saving grade' });
    }
};
exports.createGrade = createGrade;
const getGrades = async (req, res) => {
    try {
        const grades = await prisma_1.prisma.grade.findMany();
        res.json(grades);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching grades' });
    }
};
exports.getGrades = getGrades;
//# sourceMappingURL=classController.js.map