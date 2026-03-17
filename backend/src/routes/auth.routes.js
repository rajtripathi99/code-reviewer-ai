import { Router } from "express";
import { register, login, logout, refresh, me, registerSchema, loginSchema } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate }    from "../middleware/validate.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login",    validate(loginSchema),    login);
router.post("/refresh",  refresh);
router.post("/logout",   requireAuth, logout);
router.get("/me",        requireAuth, me);

export default router;
