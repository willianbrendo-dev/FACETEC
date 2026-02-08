import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// Courses
export const getCourses = async (req: Request, res: Response) => {
    try {
        const courses = await prisma.course.findMany({
            include: {
                subjects: true
            }
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching courses' });
    }
};

export const createCourse = async (req: Request, res: Response) => {
    try {
        const { name, code, credits } = req.body;
        const course = await prisma.course.create({
            data: { name, code, credits }
        });
        res.json(course);
    } catch (error) {
        res.status(500).json({ error: 'Error creating course' });
    }
};

// Subjects
export const getSubjects = async (req: Request, res: Response) => {
    try {
        const subjects = await prisma.subject.findMany({
            include: {
                course: true
            }
        });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching subjects' });
    }
};

export const createSubject = async (req: Request, res: Response) => {
    try {
        const { name, code, courseId } = req.body;
        const subject = await prisma.subject.create({
            data: { name, code, courseId }
        });
        res.json(subject);
    } catch (error) {
        res.status(500).json({ error: 'Error creating subject' });
    }
};
