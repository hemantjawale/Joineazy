import { Router } from "express";
import { body } from "express-validator";
import {
  createAssignment,
  getAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
} from "../controllers/assignmentController.js";
import authenticate from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import validate from "../middleware/validate.js";

const router = Router();

router.use(authenticate);

router.get("/", getAssignments);
router.get("/:id", getAssignment);

router.post(
  "/",
  authorize("professor"),
  [
    body("title").trim().notEmpty().withMessage("Title required"),
    body("dueDate").isISO8601().withMessage("Valid due date required"),
    body("oneDriveLink").trim().isURL().withMessage("Valid OneDrive URL required"),
  ],
  validate,
  createAssignment
);

router.put("/:id", authorize("professor"), updateAssignment);
router.delete("/:id", authorize("professor"), deleteAssignment);

export default router;
