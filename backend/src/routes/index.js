import { Router }   from "express";
import authRoutes   from "./auth.routes.js";
import reviewRoutes from "./review.routes.js";

const router = Router();

router.use("/auth",   authRoutes);
router.use("/review", reviewRoutes);

export default router;
