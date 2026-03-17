import { Router } from "express";
import { stream, sync, getHistory, getReview, deleteReview, getModes, reviewSchema } from "../controllers/review.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate }    from "../middleware/validate.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/modes",   getModes);
router.get("/",        getHistory);
router.get("/:id",     getReview);
router.delete("/:id",  deleteReview);
router.post("/stream", validate(reviewSchema), stream);
router.post("/sync",   validate(reviewSchema), sync);

export default router;
