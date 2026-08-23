import { Router } from "express";
import { body } from "express-validator";
import { getMessages, sendMessage } from "../controllers/chatController.js";
import authenticate from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import validate from "../middleware/validate.js";

const router = Router();

router.use(authenticate);
router.use(authorize("student"));

router.get("/:groupId/messages", getMessages);

router.post(
  "/",
  [
    body("groupId").isUUID().withMessage("Valid group ID required"),
    body("content").trim().notEmpty().withMessage("Message content required"),
  ],
  validate,
  sendMessage
);

export default router;
