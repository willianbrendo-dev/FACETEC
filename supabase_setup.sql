-- Habilita extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tabela Users
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT '$2a$10$NotRealHashPlaceholder',
    "role" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- 2. Tabela Course
CREATE TABLE IF NOT EXISTS "Course" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Course_code_key" ON "Course"("code");

-- 3. Tabela Subject
CREATE TABLE IF NOT EXISTS "Subject" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Subject_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Subject_code_key" ON "Subject"("code");

-- 4. Tabela Class
CREATE TABLE IF NOT EXISTS "Class" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "subjectId" TEXT NOT NULL,
    "professorId" TEXT,
    "room" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Class_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Class_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- 5. Tabela Enrollment
CREATE TABLE IF NOT EXISTS "Enrollment" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Enrollment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Enrollment_studentId_classId_key" ON "Enrollment"("studentId", "classId");

-- 6. Tabela ClassSession
CREATE TABLE IF NOT EXISTS "ClassSession" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "classId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "topic" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassSession_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ClassSession_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 7. Tabela Attendance
CREATE TABLE IF NOT EXISTS "Attendance" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "sessionId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "present" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Attendance_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ClassSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Attendance_sessionId_studentId_key" ON "Attendance"("sessionId", "studentId");

-- 8. Tabela Grade
CREATE TABLE IF NOT EXISTS "Grade" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "studentId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Grade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Grade_studentId_assessmentId_key" ON "Grade"("studentId", "assessmentId");

-- SEED DATA (Popula o banco com Admin e exemplos)
-- Senha '123456' hasheada: $2b$10$8hSBbO.8SVC5HudzMuuHtOQd4AcEb3KSbDoUyBbLacwmwAVFz1miW

-- Users
INSERT INTO "User" ("id", "name", "email", "role", "password", "avatar", "updatedAt")
VALUES 
('admin1', 'Administrador', 'admin@college.edu', 'admin', '$2b$10$8hSBbO.8SVC5HudzMuuHtOQd4AcEb3KSbDoUyBbLacwmwAVFz1miW', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop', NOW()),
('prof1', 'Dr. Roberto Santos', 'prof1@college.edu', 'professor', '$2b$10$8hSBbO.8SVC5HudzMuuHtOQd4AcEb3KSbDoUyBbLacwmwAVFz1miW', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop', NOW()),
('student1', 'Ana Silva', 'student1@college.edu', 'student', '$2b$10$8hSBbO.8SVC5HudzMuuHtOQd4AcEb3KSbDoUyBbLacwmwAVFz1miW', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop', NOW())
ON CONFLICT("email") DO NOTHING;

-- Course
INSERT INTO "Course" ("id", "name", "code", "credits", "updatedAt")
VALUES
('c1', 'Ciência da Computação', 'CC101', 120, NOW())
ON CONFLICT("code") DO NOTHING;

-- Subject
INSERT INTO "Subject" ("id", "name", "code", "courseId", "updatedAt")
VALUES
('s1', 'Algoritmos', 'ALG-01', 'c1', NOW())
ON CONFLICT("code") DO NOTHING;

-- Class
INSERT INTO "Class" ("id", "subjectId", "professorId", "room", "schedule", "term", "status", "updatedAt")
VALUES
('cl1', 's1', 'prof1', 'Lab 3', 'Seg/Qua 10:00', '2024-1', 'active', NOW())
ON CONFLICT("id") DO NOTHING;
