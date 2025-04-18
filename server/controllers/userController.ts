import { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import generateToken from "../config/token";
import { asyncHandler } from "../config/asyncHandler";

const { log } = require("mercedlogger");

const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    try {
      console.log("Request recieved at the server ")

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
      token: generateToken({
        id: user._id,
        name: user.name,
        email: user.email,
      }),
    });
  } else {
    res.status(400).json({
      message: "Invalid credentials",
    });
  }
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Logged out successfully",
  });
});
export { registerUser, loginUser, logoutUser };
