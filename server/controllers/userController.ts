import { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import generateToken from "../config/token";
import { asyncHandler } from "../config/asyncHandler";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

const { log } = require("mercedlogger");

// handles user registration 
const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    try {
      console.log("Request recieved at the server ");

      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: "Fill all the required fields",
        });
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      if (user) {
        return res.status(201).json({
          id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken({
            id: user._id,
            name: user.name,
            email: user.email,
          }),
        });
      } else {
        return res.status(400).json({
          message: "Invalid user data",
        });
      }
    } catch (error) {
      log.red("SIGNUP ERROR", error);
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
);


// handles user login 
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      message: "User not found",
    });
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      token: generateToken({
        id: user._id,
        name: user.name,
        profileImage: user.profileImage,
        email: user.email,
      }),
    });
  } else {
    res.status(400).json({
      message: "Invalid credentials",
    });
  }
});

const updateUserProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { name, profileImage } = req.body;
    const userId = req.user?.id;

    console.log("Update request received:", { userId, name, profileImage });

    if (!userId) {
      return res.status(403).json({
        message: "Not authorized to update this profile",
      });
    }

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Update user fields
      if (name) user.name = name;
      if (profileImage) user.profileImage = profileImage;

      const updatedUser = await user.save();
      console.log("User updated successfully:", updatedUser);

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
        message: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({
        message: "Error updating profile",
      });
    }
  }
);

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Logged out successfully",
  });
});

export const verifyUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ message: "User verified" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export { registerUser, loginUser, logoutUser, updateUserProfile };
