import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@college.edu';
    const password = 'admin';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: { password: hashedPassword },
        create: {
            name: 'Administrador',
            email,
            role: 'admin',
            password: hashedPassword,
            avatar: 'https://github.com/shadcn.png'
        }
    });

    console.log(`✅ Admin updated!`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
