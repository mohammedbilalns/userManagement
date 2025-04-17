import { asyncHandler } from "../config/asyncHandler";
import { Request, Response } from "express";
import generateToken from "../config/token";
import User from "../models/userModel";
import { Types } from "mongoose";


// Admin login 
const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email === adminEmail && password === adminPassword) {
    res.status(200).json({
      role: "admin",
      email: adminEmail,
      token: generateToken({
        id: "admin",
        name: "admin",
        email,
      }),
    });
  } else {
    res.status(401).json({
      message: "Invalid admin credentials",
    });
  }
});


// Delete User 
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  await User.findByIdAndDelete(userId);

  res.status(200).json({
    message: "User deleted  successfully",
  });
});

export { adminLogin, deleteUser };
