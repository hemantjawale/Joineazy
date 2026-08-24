import { Router } from "express";
import { body } from "express-validator";
import {
  confirmSubmission,
  getAssignmentSubmissions,
  getGroupSubmissions,
  getMySubmissions,
  gradeSubmission,
} from "../controllers/submissionController.js";
import authenticate from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import validate from "../middleware/validate.js";

const router = Router();

router.use(authenticate);

router.post(
  "/confirm",
  authorize("student"),
  [body("assignmentId").isUUID().withMessage("Valid assignment ID required")],
  validate,
  confirmSubmission
);

router.post("/grade/:id", authorize("professor"), gradeSubmission);

router.get("/mine", authorize("student"), getMySubmissions);
router.get("/assignment/:id", authorize("professor"), getAssignmentSubmissions);
router.get("/group/:groupId", authorize("student"), getGroupSubmissions);

export default router;
