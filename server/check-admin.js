const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    try {
        const email = 'admin@college.edu';
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.log('User not found');
            return;
        }

        console.log('User found:', {
            id: user.id,
            email: user.email,
            role: user.role,
            passwordHash: user.password,
        });

        const testPassword = 'admin';
        const isMatch = await bcrypt.compare(testPassword, user.password);
        console.log('Password match check for "admin":', isMatch);

    } catch (e) {
        console.error('Error checking user:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
