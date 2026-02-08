const sqlite3 = require('sqlite3');
const { resolve } = require('path');
const { randomUUID } = require('crypto');

const dbPath = resolve(__dirname, '../dev.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Ensure tables exist (copy of schema)
    db.run(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, role TEXT NOT NULL, avatar TEXT, createdAt TEXT DEFAULT CURRENT_TIMESTAMP, updatedAt TEXT DEFAULT CURRENT_TIMESTAMP)`);
    db.run(`CREATE TABLE IF NOT EXISTS courses (id TEXT PRIMARY KEY, name TEXT NOT NULL, code TEXT UNIQUE NOT NULL, credits INTEGER NOT NULL, createdAt TEXT DEFAULT CURRENT_TIMESTAMP, updatedAt TEXT DEFAULT CURRENT_TIMESTAMP)`);
    db.run(`CREATE TABLE IF NOT EXISTS subjects (id TEXT PRIMARY KEY, name TEXT NOT NULL, code TEXT UNIQUE NOT NULL, courseId TEXT NOT NULL, createdAt TEXT DEFAULT CURRENT_TIMESTAMP, updatedAt TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (courseId) REFERENCES courses (id))`);
    db.run(`CREATE TABLE IF NOT EXISTS classes (id TEXT PRIMARY KEY, subjectId TEXT NOT NULL, professorId TEXT, room TEXT NOT NULL, schedule TEXT NOT NULL, term TEXT NOT NULL, status TEXT NOT NULL, createdAt TEXT DEFAULT CURRENT_TIMESTAMP, updatedAt TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (subjectId) REFERENCES subjects (id), FOREIGN KEY (professorId) REFERENCES users (id))`);
    db.run(`CREATE TABLE IF NOT EXISTS enrollments (id TEXT PRIMARY KEY, studentId TEXT NOT NULL, classId TEXT NOT NULL, enrolledAt TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (studentId) REFERENCES users (id), FOREIGN KEY (classId) REFERENCES classes (id), UNIQUE(studentId, classId))`);
    db.run(`CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, classId TEXT NOT NULL, date TEXT NOT NULL, topic TEXT NOT NULL, description TEXT, createdAt TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (classId) REFERENCES classes (id))`);
    db.run(`CREATE TABLE IF NOT EXISTS attendance (id TEXT PRIMARY KEY, sessionId TEXT NOT NULL, studentId TEXT NOT NULL, present BOOLEAN NOT NULL, createdAt TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (sessionId) REFERENCES sessions (id), FOREIGN KEY (studentId) REFERENCES users (id), UNIQUE(sessionId, studentId))`);
    db.run(`CREATE TABLE IF NOT EXISTS grades (id TEXT PRIMARY KEY, studentId TEXT NOT NULL, assessmentId TEXT NOT NULL, value REAL NOT NULL, createdAt TEXT DEFAULT CURRENT_TIMESTAMP, updatedAt TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (studentId) REFERENCES users (id), UNIQUE(studentId, assessmentId))`);

    console.log('Seeding database...');

    // Check if data exists first? No, we trust unique constraints or just ignore errors

    // Users
    const users = [
        ['admin1', 'Administrador', 'admin@college.edu', 'admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'],
        ['prof1', 'Dr. Roberto Santos', 'prof1@college.edu', 'professor', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'],
        ['student1', 'Ana Silva', 'student1@college.edu', 'student', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'],
        ['student2', 'Carlos Mendes', 'student2@college.edu', 'student', 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80']
    ];

    const stmtUser = db.prepare('INSERT OR IGNORE INTO users (id, name, email, role, avatar) VALUES (?, ?, ?, ?, ?)');
    users.forEach(u => stmtUser.run(u));
    stmtUser.finalize();

    // Courses
    const stmtCourse = db.prepare('INSERT OR IGNORE INTO courses (id, name, code, credits) VALUES (?, ?, ?, ?)');
    stmtCourse.run(['c1', 'Ciência da Computação', 'CC101', 120]);
    stmtCourse.finalize();

    // Subjects
    const stmtSubject = db.prepare('INSERT OR IGNORE INTO subjects (id, name, code, courseId) VALUES (?, ?, ?, ?)');
    stmtSubject.run(['s1', 'Algoritmos', 'ALG-01', 'c1']);
    stmtSubject.run(['s2', 'Banco de Dados', 'BD-01', 'c1']);
    stmtSubject.finalize();

    // Classes
    const stmtClass = db.prepare('INSERT OR IGNORE INTO classes (id, subjectId, professorId, room, schedule, term, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
    stmtClass.run(['cl1', 's1', 'prof1', 'Lab 3', 'Seg/Qua 10:00', '2024-1', 'active']);
    stmtClass.finalize();

    // Enrollments
    const stmtEnroll = db.prepare('INSERT OR IGNORE INTO enrollments (id, studentId, classId) VALUES (?, ?, ?)');
    stmtEnroll.run([randomUUID(), 'student1', 'cl1']);
    stmtEnroll.run([randomUUID(), 'student2', 'cl1']);
    stmtEnroll.finalize();

    console.log('Seeding completed.');
});

db.close();
