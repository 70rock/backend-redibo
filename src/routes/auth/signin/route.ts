import { Router } from "express";
import { signIn } from "../../../lib/auth";

const router = Router();

// POST /api/auth/signin
router.post("/", signIn);

export default router;
