import { asyncHandler } from "../config/asyncHandler";
import { Request, Response } from "express";
import generateToken from "../config/token";
import User from "../models/userModel";
import bcrypt from "bcryptjs";

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
        role: "admin",
      }),
    });
  } else {
    res.status(401).json({
      message: "Invalid admin credentials",
    });
  }
});

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
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

const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }

  // Check if email is valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Please provide a valid email address",
    });
  }

  // Check if password is strong enough
  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long",
    });
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      message: "User with this email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      message: "User created successfully",
    });
  } else {
    res.status(400).json({
      message: "Invalid user data",
    });
  }
});

// Update user
const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // Update fields if provided
  if (name) {
    user.name = name;
  }

  // Save updated user
  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    profileImage: updatedUser.profileImage,
    createdAt: updatedUser.createdAt,
    message: "User updated successfully",
  });
});
export { adminLogin, getAllUsers, deleteUser, createUser, updateUser };
