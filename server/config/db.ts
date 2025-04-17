import mongoose, { mongo } from "mongoose";
import { config } from "dotenv";
const { log } = require("mercedlogger");

config();

const connectDb = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI is not defined in .env");

    await mongoose.connect(uri, {});

    log.green("DB STATUS", "connected successuflly");
  } catch (err) {
    log.red("DB CONNECTION ERROR", err);
  }
};

export default connectDb;
