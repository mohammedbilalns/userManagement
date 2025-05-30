import jwt from "jsonwebtoken";
import { Types } from "mongoose";

interface PayloadType {
  id: Types.ObjectId | string;
  name: string;
  email: string;
  role?: string;
  profileImage?: string;
}

const generateToken = (payload: PayloadType) => {
    if(!process.env.JWT_SECRET){
        throw new Error("JWT_SECRET is not defined in .env");
    }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export default generateToken