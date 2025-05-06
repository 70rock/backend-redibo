import { Router } from 'express';
import { getSession } from '../../../lib/auth';

const router = Router();

// GET, POST, etc. para /api/auth/session
router.get('/', getSession);

export default router;
