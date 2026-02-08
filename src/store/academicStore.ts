import { create } from 'zustand';
import type { User, Course, Subject, Class, Enrollment, ClassSession, AttendanceRecord, Assessment, Grade } from '../types';

interface AcademicState {
    users: User[];
    courses: Course[];
    subjects: Subject[];
    classes: Class[];
    enrollments: Enrollment[];
    sessions: ClassSession[];
    attendance: AttendanceRecord[];
    assessments: Assessment[];
    grades: Grade[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchData: () => Promise<void>;
    addUser: (user: User) => Promise<void>;
    addCourse: (course: Course) => Promise<void>;
    addSubject: (subject: Subject) => Promise<void>;
    addClass: (cls: Class) => Promise<void>;
    enrollStudent: (studentId: string, classId: string) => Promise<void>;
    addSession: (session: ClassSession) => Promise<void>;
    markAttendance: (classId: string, sessionId: string, updates: { studentId: string; present: boolean }[]) => Promise<void>;
    addAssessment: (assessment: Assessment) => Promise<void>;
    gradeStudent: (grade: Grade) => Promise<void>;

    // Helpers
    getStudentClasses: (studentId: string) => Class[];
    getProfessorClasses: (professorId: string) => Class[];
    getClassDetails: (classId: string) => {
        subject: Subject | undefined;
        course: Course | undefined;
        professor: User | undefined;
        students: User[];
    };
}

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api';

const getAuthHeaders = () => {
    const state = localStorage.getItem('auth-storage');
    const token = state ? JSON.parse(state).state.token : null;
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const useAcademicStore = create<AcademicState>((set, get) => ({
    users: [],
    courses: [],
    subjects: [],
    classes: [],
    enrollments: [],
    sessions: [],
    attendance: [],
    assessments: [],
    grades: [],
    isLoading: false,
    error: null,

    fetchData: async () => {
        set({ isLoading: true, error: null });
        const headers = getAuthHeaders();
        try {
            const [users, courses, classes] = await Promise.all([
                fetch(`${API_URL}/users`, { headers }).then(r => r.json()),
                fetch(`${API_URL}/courses`, { headers }).then(r => r.json()),
                fetch(`${API_URL}/classes`, { headers }).then(r => r.json())
            ]);

            const subjects = await fetch(`${API_URL}/subjects`, { headers }).then(r => r.ok ? r.json() : []).catch(() => []);
            const enrollments = await fetch(`${API_URL}/enrollments`, { headers }).then(r => r.ok ? r.json() : []).catch(() => []);
            const sessions = await fetch(`${API_URL}/sessions`, { headers }).then(r => r.ok ? r.json() : []).catch(() => []);
            const attendance = await fetch(`${API_URL}/attendance`, { headers }).then(r => r.ok ? r.json() : []).catch(() => []);
            const grades = await fetch(`${API_URL}/grades`, { headers }).then(r => r.ok ? r.json() : []).catch(() => []);

            set({
                users,
                courses,
                classes,
                subjects,
                enrollments,
                sessions,
                attendance,
                grades,
                isLoading: false
            });
        } catch (error) {
            console.error('Failed to fetch data', error);
            set({ isLoading: false, error: 'Failed to fetch data' });
        }
    },

    addUser: async (user) => {
        const res = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(user)
        });
        if (res.ok) {
            const newUser = await res.json();
            set((state) => ({ users: [...state.users, newUser] }));
        }
    },

    addCourse: async (course) => {
        const res = await fetch(`${API_URL}/courses`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(course)
        });
        if (res.ok) {
            const newCourse = await res.json();
            set((state) => ({ courses: [...state.courses, newCourse] }));
        }
    },

    addSubject: async (subject) => {
        const res = await fetch(`${API_URL}/subjects`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(subject)
        });
        if (res.ok) {
            const newSubject = await res.json();
            set((state) => ({ subjects: [...state.subjects, newSubject] }));
        }
    },

    addClass: async (cls) => {
        const res = await fetch(`${API_URL}/classes`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(cls)
        });
        if (res.ok) {
            const newClass = await res.json();
            set((state) => ({ classes: [...state.classes, newClass] }));
        }
    },

    enrollStudent: async (studentId, classId) => {
        const res = await fetch(`${API_URL}/enrollments`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ studentId, classId })
        });
        if (res.ok) {
            const newEnrollment = await res.json();
            set((state) => ({ enrollments: [...state.enrollments, { ...newEnrollment, status: 'active', enrolledAt: new Date().toISOString() }] }));
        }
    },

    addSession: async (session) => {
        const res = await fetch(`${API_URL}/sessions`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(session)
        });
        if (res.ok) {
            const newSession = await res.json();
            set((state) => ({ sessions: [...state.sessions, newSession] }));
        }
    },

    markAttendance: async (classId, sessionId, updates) => {
        const headers = getAuthHeaders();
        await Promise.all(updates.map(u =>
            fetch(`${API_URL}/attendance`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ sessionId, studentId: u.studentId, present: u.present })
            })
        ));
        set((state) => {
            const otherRecords = state.attendance.filter(r => r.sessionId !== sessionId);
            const newRecords = updates.map(u => ({
                id: crypto.randomUUID(),
                sessionId,
                studentId: u.studentId,
                present: u.present
            }));
            return { attendance: [...otherRecords, ...newRecords] };
        });
    },

    addAssessment: async (assessment) => {
        // Mock
        set((state) => ({ assessments: [...state.assessments, assessment] }));
    },

    gradeStudent: async (grade) => {
        const res = await fetch(`${API_URL}/grades`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(grade)
        });
        if (res.ok) {
            const newGrade = await res.json();
            set((state) => {
                const existingIndex = state.grades.findIndex(g => g.studentId === newGrade.studentId && g.assessmentId === newGrade.assessmentId);
                if (existingIndex >= 0) {
                    const newGrades = [...state.grades];
                    newGrades[existingIndex] = newGrade;
                    return { grades: newGrades };
                }
                return { grades: [...state.grades, newGrade] };
            });
        }
    },

    getStudentClasses: (studentId) => {
        const state = get();
        const enrollmentClassIds = state.enrollments
            .filter(e => e.studentId === studentId && (e.status === 'active' || e.status === undefined))
            .map(e => e.classId);
        return state.classes.filter(c => enrollmentClassIds.includes(c.id));
    },

    getProfessorClasses: (professorId) => {
        return get().classes.filter(c => c.professorId === professorId);
    },

    getClassDetails: (classId) => {
        const state = get();
        const cls = state.classes.find(c => c.id === classId);
        if (!cls) return { subject: undefined, course: undefined, professor: undefined, students: [] };

        const subject = state.subjects.find(s => s.id === cls.subjectId) || (cls as any).subject;
        const course = subject ? state.courses.find(c => c.id === subject.courseId) : undefined;
        const professor = state.users.find(u => u.id === cls.professorId) || (cls as any).professor;

        const enrolledStudentIds = state.enrollments
            .filter(e => e.classId === classId && (e.status === 'active' || e.status === undefined))
            .map(e => e.studentId);

        const students = state.users.filter(u => enrolledStudentIds.includes(u.id));

        return { subject, course, professor, students };
    }
}));
