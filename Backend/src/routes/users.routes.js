import express from 'express';
import { getProfile, updateProfile, listUsers } from '../controllers/users.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// todas protegidas
router.use(authMiddleware);

router.get('/me', getProfile);
router.put('/me', updateProfile);
router.get('/', listUsers); // solo admin/leader

export default router;
