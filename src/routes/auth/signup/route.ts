import { Router } from "express";
import { signUp } from "../../../lib/auth";

const router = Router();

// POST /api/auth/signup
router.post("/", signUp);

export default router;
