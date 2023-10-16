import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
} from "../controller/chatController.js";

const router = express.Router();

router.route("/").post(protect, accessChat).get(protect, fetchChat);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroupChat);
router.route("/groupadd").put(protect, addToGroup);
router.route("/groupremove").put(protect, removeFromGroup);

export default router;
