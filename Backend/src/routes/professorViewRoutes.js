import { Router } from "express";
import {
  getAllGroupsForProfessor,
  getGroupDetailForProfessor,
  getAllStudentsForProfessor,
  getDashboardAttention,
  getStudentReportCard,
} from "../controllers/professorViewController.js";
import authenticate from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";

const router = Router();

router.use(authenticate);
router.use(authorize("professor"));

router.get("/dashboard/attention", getDashboardAttention);
router.get("/groups", getAllGroupsForProfessor);
router.get("/groups/:id", getGroupDetailForProfessor);
router.get("/students", getAllStudentsForProfessor);
router.get("/students/:id/report", getStudentReportCard);

export default router;
