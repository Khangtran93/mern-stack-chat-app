import express from "express";
import {
  registerUser,
  authUser,
  allUsers,
} from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.route("/login").post(authUser);

export default router;
