import { Router } from "express";
import { getOverview, getAssignmentAnalytics } from "../controllers/analyticsController.js";
import authenticate from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";

const router = Router();

router.use(authenticate);
router.use(authorize("professor"));

router.get("/overview", getOverview);
router.get("/assignments/:id", getAssignmentAnalytics);

export default router;
