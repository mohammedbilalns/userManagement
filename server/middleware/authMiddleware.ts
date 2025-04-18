import jwt from "jsonwebtoken";
import { asyncHandler } from "../config/asyncHandler";
import User from "../models/userModel";
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
  id: string;
  email: string;
  role?: string;
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

const protect = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "1921u0030"
      ) as JwtPayload;

      // Check if admin token
      if (decoded.role === "admin") {
        req.user = { id: "admin", email: decoded.email, role: "admin" };
      } else {
        const user = await User.findById(decoded.id).select("-password");
        if (user) {
          req.user = {
            id: user._id.toString(),
            email: user.email,
          };
        }
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({
        message: "Not authorized, token failed",
      });
    }
  }

  if (!token) {
    res.status(401).json({
      message: "Not authorized, no token",
    });
  }
});

// Admin only middleware
const adminOnly = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      message: "Not authorized as an admin",
    });
  }
};

export default { protect, adminOnly };
