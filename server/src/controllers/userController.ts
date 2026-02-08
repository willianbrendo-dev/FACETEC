import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                // Exclude password
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, role, avatar, password } = req.body;

        // If password is not provided (e.g. from simpler frontend form), generate a default one or error?
        // For now, let's allow it or set default if missing, but best to require it or set default.
        // The schema has a default, but we should hash it if provided.

        let hashedPassword = undefined;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        } else {
            // Default password for users created via Admin UI without password
            hashedPassword = await bcrypt.hash('123456', 10);
        }

        // Note: If no password provided, Prisma will use the default string from schema.
        // But that default string is a placeholder hash.

        const user = await prisma.user.create({
            data: {
                name,
                email,
                role,
                avatar,
                ...(hashedPassword && { password: hashedPassword })
            }
        });

        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
};
