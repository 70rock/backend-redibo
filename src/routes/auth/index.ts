import { Router } from "express";
import { signIn, signUp, signOut, getSession } from "../../lib/auth";

const router = Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/signout", signOut);
router.get('/session', getSession);

export default router; 