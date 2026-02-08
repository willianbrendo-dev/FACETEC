export type Role = 'admin' | 'professor' | 'student';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar?: string;
}

export interface Course {
    id: string;
    name: string;
    code: string;
    credits: number;
}

export interface Subject {
    id: string;
    name: string;
    code: string;
    courseId: string;
}

export interface Class {
    id: string;
    subjectId: string;
    professorId: string;
    room: string;
    schedule: string;
    term: string;
    status: 'active' | 'closed';
}

export interface Enrollment {
    id: string;
    studentId: string;
    classId: string;
    enrolledAt: string;
    status: 'active' | 'dropped' | 'completed';
}

export interface ClassSession {
    id: string;
    classId: string;
    date: string;
    topic: string;
    description?: string;
}

export interface AttendanceRecord {
    id: string;
    sessionId: string;
    studentId: string;
    present: boolean;
}

export interface Assessment {
    id: string;
    classId: string;
    name: string; // e.g., "N1", "N2"
    weight: number; // e.g., 0.5 for 50%
    date: string;
}

export interface Grade {
    id: string;
    studentId: string;
    assessmentId: string;
    value: number; // 0-10
}
