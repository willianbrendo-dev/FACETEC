const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');

    const passwordHash = await bcrypt.hash('123456', 10);

    // 1. Users
    const admin = await prisma.user.upsert({
        where: { email: 'admin@college.edu' },
        update: {},
        create: {
            id: 'admin1',
            name: 'Administrador',
            email: 'admin@college.edu',
            role: 'admin',
            password: passwordHash,
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop'
        }
    });

    const professor = await prisma.user.upsert({
        where: { email: 'prof1@college.edu' },
        update: {},
        create: {
            id: 'prof1',
            name: 'Dr. Roberto Santos',
            email: 'prof1@college.edu',
            role: 'professor',
            password: passwordHash,
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop'
        }
    });

    const student = await prisma.user.upsert({
        where: { email: 'student1@college.edu' },
        update: {},
        create: {
            id: 'student1',
            name: 'Ana Silva',
            email: 'student1@college.edu',
            role: 'student',
            password: passwordHash,
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop'
        }
    });

    console.log('Users created/updated.');

    // 2. Course
    const course = await prisma.course.upsert({
        where: { code: 'CC101' },
        update: {},
        create: {
            id: 'c1',
            name: 'Ciência da Computação',
            code: 'CC101',
            credits: 120
        }
    });

    // 3. Subject
    const subject = await prisma.subject.upsert({
        where: { code: 'ALG-01' },
        update: {},
        create: {
            id: 's1',
            name: 'Algoritmos',
            code: 'ALG-01',
            courseId: course.id
        }
    });

    // 4. Class
    // Classes don't have a unique code in schema (only id). 
    // We check existence by ID or specific fields? 
    // Schema: id (uuid), subjectId, professorId, room, schedule, term.
    // Let's use ID 'cl1' if we can force it, or findFirst.
    // For upsert we need a unique constraint. Class id is unique.

    const cls = await prisma.class.upsert({
        where: { id: 'cl1' },
        update: {},
        create: {
            id: 'cl1',
            subjectId: subject.id,
            professorId: professor.id,
            room: 'Lab 3',
            schedule: 'Seg/Qua 10:00',
            term: '2024-1',
            status: 'active'
        }
    });

    console.log('Academic data created/updated.');
    console.log('Seed completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
