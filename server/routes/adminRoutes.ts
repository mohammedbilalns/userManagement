import { Router } from "express";
import {
  adminLogin,
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from "../controllers/adminController";

const router = Router();

router.post("/login", adminLogin);
router.get("/logout", (req, res) => {
  res.json({
    endpoint: "/admin/logout",
  });
});

router.get("/users", getAllUsers);

router.post("/users", createUser);

router.delete("/users/:userId", deleteUser);

router.put("/users/:userId", updateUser);

export default router;
