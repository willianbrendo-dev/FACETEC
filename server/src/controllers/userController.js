"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../lib/prisma");
const getUsers = async (req, res) => {
    try {
        const users = await prisma_1.prisma.user.findMany({
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
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};
exports.getUsers = getUsers;
const createUser = async (req, res) => {
    try {
        const { name, email, role, avatar, password } = req.body;
        // If password is not provided (e.g. from simpler frontend form), generate a default one or error?
        // For now, let's allow it or set default if missing, but best to require it or set default.
        // The schema has a default, but we should hash it if provided.
        let hashedPassword = undefined;
        if (password) {
            hashedPassword = await bcryptjs_1.default.hash(password, 10);
        }
        // Note: If no password provided, Prisma will use the default string from schema.
        // But that default string is a placeholder hash.
        const user = await prisma_1.prisma.user.create({
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
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
};
exports.createUser = createUser;
//# sourceMappingURL=userController.js.map