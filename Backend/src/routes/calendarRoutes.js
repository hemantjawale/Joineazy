import { Router } from "express";
import { getStudentCalendar } from "../controllers/calendarController.js";
import authenticate from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";

const router = Router();

router.use(authenticate);
router.use(authorize("student"));

router.get("/", getStudentCalendar);

export default router;
