import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  updateUserProfile,
} from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

router.put("/update-profile", authMiddleware.protect, updateUserProfile);

export default router;
