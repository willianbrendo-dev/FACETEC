import { Router } from 'express';
import { getUsers, createUser } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Protect these routes? For now, let's keep GET public or protected based on requirements.
// The task asked to implement Real Auth but didn't specify strict RBAC for everything yet.
// However, creating users (admin) should probably be protected or public for initial setup.
// Let's leave them open for now to match old behavior, or add auth if verified.
// Old behavior: Open.
// Refactor goal: Real Auth.
// I will add authenticateToken to GET /users as a demo of protection.

router.get('/', authenticateToken, getUsers);
router.post('/', createUser); // Public registration for now? Or Admin only? 
// The old routes had "auth/login" but also "POST /users".
// Let's keep POST /users as public registration mostly, or use /auth/register.
// I implemented /auth/register in authController. 
// So POST /users might be redundant or for admin creating users.
// Let's keep it for compatibility.

export default router;
