import { Router } from "express";
import {
  getAllGroupsForProfessor,
  getGroupDetailForProfessor,
  getAllStudentsForProfessor,
} from "../controllers/professorViewController.js";
import authenticate from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";

const router = Router();

router.use(authenticate);
router.use(authorize("professor"));

router.get("/groups", getAllGroupsForProfessor);
router.get("/groups/:id", getGroupDetailForProfessor);
router.get("/students", getAllStudentsForProfessor);

export default router;
