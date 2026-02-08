"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';
const register = async (req, res) => {
    try {
        const { name, email, password, role, avatar } = req.body;
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Usuário já existe' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                avatar
            }
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1d' });
        res.json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
            token
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        // Check if password matches (handle potential legacy plain text or default placeholder if needed)
        // For security, we assume strict bcrypt check.
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        console.log(isValid);
        if (!isValid) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1d' });
        res.json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
            token
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro ao realizar login' });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map