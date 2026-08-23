import { Router } from "express";
import { body } from "express-validator";
import {
  createGroup,
  getGroups,
  getGroup,
  addMember,
  removeMember,
  getAllStudents,
} from "../controllers/groupController.js";
import authenticate from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import validate from "../middleware/validate.js";

const router = Router();

router.use(authenticate);
router.use(authorize("student"));

router.get("/students", getAllStudents);
router.get("/", getGroups);
router.get("/:id", getGroup);

router.post(
  "/",
  [body("name").trim().notEmpty().withMessage("Group name required")],
  validate,
  createGroup
);

router.post(
  "/:id/members",
  [body("email").isEmail().withMessage("Valid email required")],
  validate,
  addMember
);

router.delete("/:id/members/:userId", removeMember);

export default router;
