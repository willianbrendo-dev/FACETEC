import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // 1. Users
    const admin = await prisma.user.create({
        data: {
            id: 'admin1',
            name: 'Administrador',
            email: 'admin@college.edu',
            role: 'admin',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        }
    });

    const prof = await prisma.user.create({
        data: {
            id: 'prof1',
            name: 'Dr. Roberto Santos',
            email: 'prof1@college.edu',
            role: 'professor',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        }
    });

    const student1 = await prisma.user.create({
        data: {
            id: 'student1',
            name: 'Ana Silva',
            email: 'student1@college.edu',
            role: 'student',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        }
    });

    const student2 = await prisma.user.create({
        data: {
            id: 'student2',
            name: 'Carlos Mendes',
            email: 'student2@college.edu',
            role: 'student',
            avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        }
    });

    // 2. Courses & Subjects
    const compSci = await prisma.course.create({
        data: {
            id: 'c1',
            name: 'Ciência da Computação',
            code: 'CC101',
            credits: 120
        }
    });

    const algo = await prisma.subject.create({
        data: {
            id: 's1',
            name: 'Algoritmos',
            code: 'ALG-01',
            courseId: compSci.id
        }
    });

    const db = await prisma.subject.create({
        data: {
            id: 's2',
            name: 'Banco de Dados',
            code: 'BD-01',
            courseId: compSci.id
        }
    });

    // 3. Classes
    const algoClass = await prisma.class.create({
        data: {
            id: 'cl1',
            subjectId: algo.id,
            professorId: prof.id,
            room: 'Lab 3',
            schedule: 'Seg/Qua 10:00',
            term: '2024-1',
            status: 'active'
        }
    });

    // 4. Enrollments
    await prisma.enrollment.createMany({
        data: [
            { studentId: student1.id, classId: algoClass.id },
            { studentId: student2.id, classId: algoClass.id }
        ]
    });

    // 5. Sessions
    const session1 = await prisma.classSession.create({
        data: {
            id: 'sess1',
            classId: algoClass.id,
            date: new Date('2024-02-01'),
            topic: 'Introdução à Ordenação'
        }
    });

    // 6. Attendance
    await prisma.attendance.createMany({
        data: [
            { sessionId: session1.id, studentId: student1.id, present: true },
            { sessionId: session1.id, studentId: student2.id, present: false }
        ]
    });

    // 7. Grades
    await prisma.grade.createMany({
        data: [
            { studentId: student1.id, assessmentId: `${algoClass.id}_N1`, value: 8.5 },
            { studentId: student1.id, assessmentId: `${algoClass.id}_N2`, value: 9.0 },
            { studentId: student2.id, assessmentId: `${algoClass.id}_N1`, value: 6.0 }
        ]
    });

    console.log('Seed completed!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
