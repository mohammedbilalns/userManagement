import express from "express";
import cors from "cors";
import { config } from "dotenv";

import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import connectDb from "./config/db";
const { log } = require("mercedlogger");

config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 3000;
connectDb();
app.listen(3000, () => {
  log.green("SERVER STATUS", ` running on port ${PORT}`);
});
