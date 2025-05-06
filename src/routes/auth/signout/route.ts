import { Router } from "express";
import { signOut } from "../../../lib/auth";

const router = Router();

// POST /api/auth/signout
router.post("/", signOut);

export default router;
