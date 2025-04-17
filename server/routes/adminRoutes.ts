import { Router } from "express";
import { adminLogin, deleteUser } from "../controllers/adminController";

const router = Router();

router.post("/login", adminLogin);

router.get("/users", (req, res) => {
  res.json({
    endpoint: "/admin/users",
  });
});

router.post("/users", (req, res) => {
  res.json({
    endpoint: "/admin/users",
  });
});

router.delete("/users/:userId", deleteUser);

router.put("/users/:userId", (req, res) => {
  res.json({
    endpoint: "/admin/updateuser",
  });
});

export default router;
