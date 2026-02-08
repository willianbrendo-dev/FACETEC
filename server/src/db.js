"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = require("path");
const dbPath = (0, path_1.resolve)(__dirname, '../dev.db');
const db = new sqlite3_1.default.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    }
    else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});
function initDb() {
    db.serialize(() => {
        // Users
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            role TEXT NOT NULL,
            avatar TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
        )`);
        // Courses
        db.run(`CREATE TABLE IF NOT EXISTS courses (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            code TEXT UNIQUE NOT NULL,
            credits INTEGER NOT NULL,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
        )`);
        // Subjects
        db.run(`CREATE TABLE IF NOT EXISTS subjects (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            code TEXT UNIQUE NOT NULL,
            courseId TEXT NOT NULL,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (courseId) REFERENCES courses (id)
        )`);
        // Classes
        db.run(`CREATE TABLE IF NOT EXISTS classes (
            id TEXT PRIMARY KEY,
            subjectId TEXT NOT NULL,
            professorId TEXT,
            room TEXT NOT NULL,
            schedule TEXT NOT NULL,
            term TEXT NOT NULL,
            status TEXT NOT NULL,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (subjectId) REFERENCES subjects (id),
            FOREIGN KEY (professorId) REFERENCES users (id)
        )`);
        // Enrollments
        db.run(`CREATE TABLE IF NOT EXISTS enrollments (
            id TEXT PRIMARY KEY,
            studentId TEXT NOT NULL,
            classId TEXT NOT NULL,
            enrolledAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (studentId) REFERENCES users (id),
            FOREIGN KEY (classId) REFERENCES classes (id),
            UNIQUE(studentId, classId)
        )`);
        // Sessions
        db.run(`CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            classId TEXT NOT NULL,
            date TEXT NOT NULL,
            topic TEXT NOT NULL,
            description TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (classId) REFERENCES classes (id)
        )`);
        // Attendance
        db.run(`CREATE TABLE IF NOT EXISTS attendance (
            id TEXT PRIMARY KEY,
            sessionId TEXT NOT NULL,
            studentId TEXT NOT NULL,
            present BOOLEAN NOT NULL,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sessionId) REFERENCES sessions (id),
            FOREIGN KEY (studentId) REFERENCES users (id),
            UNIQUE(sessionId, studentId)
        )`);
        // Grades
        db.run(`CREATE TABLE IF NOT EXISTS grades (
            id TEXT PRIMARY KEY,
            studentId TEXT NOT NULL,
            assessmentId TEXT NOT NULL,
            value REAL NOT NULL,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (studentId) REFERENCES users (id),
            UNIQUE(studentId, assessmentId)
        )`);
    });
}
exports.default = db;
//# sourceMappingURL=db.js.map