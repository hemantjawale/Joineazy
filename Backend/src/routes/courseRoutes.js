import { Router } from "express";
import {
  createCourse,
  getCourses,
  joinCourse,
  getEnrolledStudents,
} from "../controllers/courseController.js";
import authenticate from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import validate from "../middleware/validate.js";
import { body } from "express-validator";

const router = Router();

router.use(authenticate);

router.get("/", getCourses);

router.post(
  "/",
  authorize("professor"),
  [body("name").notEmpty().withMessage("Course name is required")],
  validate,
  createCourse
);

router.post(
  "/join",
  authorize("student"),
  [body("joinCode").notEmpty().withMessage("Join code is required")],
  validate,
  joinCourse
);

router.get("/:id/students", authorize("professor"), getEnrolledStudents);

export default router;
