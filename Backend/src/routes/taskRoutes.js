import { Router } from "express";
import { body } from "express-validator";
import {
  createTask,
  getGroupTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import authenticate from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import validate from "../middleware/validate.js";

const router = Router();

router.use(authenticate);
router.use(authorize("student"));

router.get("/group/:groupId", getGroupTasks);

router.post(
  "/",
  [
    body("groupId").isUUID().withMessage("Valid group ID required"),
    body("title").trim().notEmpty().withMessage("Title required"),
    body("assignedToId").isUUID().withMessage("Valid assignee required"),
  ],
  validate,
  createTask
);

router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
