import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// Classes
export const getClasses = async (req: Request, res: Response) => {
    try {
        const classes = await prisma.class.findMany({
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
        const result = classes.map((c: any) => ({
            ...c,
            sessions: [], // matching old API behavior of returning empty for list
            enrollments: []
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching classes' });
    }
};

export const createClass = async (req: Request, res: Response) => {
    try {
        const { subjectId, professorId, room, schedule, term, status } = req.body;
        const cls = await prisma.class.create({
            data: { subjectId, professorId, room, schedule, term, status }
        });
        res.json(cls);
    } catch (error) {
        res.status(500).json({ error: 'Error creating class' });
    }
};

// Enrollments
export const createEnrollment = async (req: Request, res: Response) => {
    try {
        const { studentId, classId } = req.body;
        const enrollment = await prisma.enrollment.create({
            data: { studentId, classId }
        });
        res.json(enrollment);
    } catch (error) {
        res.status(500).json({ error: 'Error enrolling student' });
    }
};

export const getEnrollments = async (req: Request, res: Response) => {
    try {
        const enrollments = await prisma.enrollment.findMany();
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching enrollments' });
    }
}


// Sessions
export const createSession = async (req: Request, res: Response) => {
    try {
        const { classId, date, topic, description } = req.body;
        // Convert date string to DateTime if necessary, Prisma handles ISO strings automatically
        const session = await prisma.classSession.create({
            data: { classId, date: new Date(date), topic, description }
        });
        res.json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating session' });
    }
};

export const getSessions = async (req: Request, res: Response) => {
    try {
        const sessions = await prisma.classSession.findMany();
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching sessions' });
    }
}


// Attendance
export const markAttendance = async (req: Request, res: Response) => {
    try {
        const { sessionId, studentId, present } = req.body;
        const attendance = await prisma.attendance.create({
            data: { sessionId, studentId, present }
        });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ error: 'Error marking attendance' });
    }
};

export const getAttendance = async (req: Request, res: Response) => {
    try {
        const attendance = await prisma.attendance.findMany();
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching attendance' });
    }
}

// Grades
export const createGrade = async (req: Request, res: Response) => {
    try {
        const { studentId, assessmentId, value } = req.body;
        const grade = await prisma.grade.upsert({
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
    } catch (error) {
        res.status(500).json({ error: 'Error saving grade' });
    }
};

export const getGrades = async (req: Request, res: Response) => {
    try {
        const grades = await prisma.grade.findMany();
        res.json(grades);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching grades' });
    }
}
