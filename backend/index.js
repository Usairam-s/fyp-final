import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import tagRoutes from "./routes/tag.route.js";
import venueRoutes from "./routes/venue.route.js";
import staffRoutes from "./routes/staff.route.js";
import lostitemRoutes from "./routes/lostitem.route.js";
import requestRoutes from "./routes/request.route.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

mongoose
  .connect("mongodb+srv://fyplostfound:coder123@cluster0.vb2giqy.mongodb.net")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log(`Error ${error.message}`);
  });

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

app.use("/api/", requestRoutes);
app.use("/api/", staffRoutes);
app.use("/api/", tagRoutes);
app.use("/api/", venueRoutes);
app.use("/api/", lostitemRoutes);
