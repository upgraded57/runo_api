import express, { Express, Request, Response, Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/users.js";
import postRoute from "./routes/posts.js";
import path from "path";

// Initialize app
const app: Application = express();

// environment variables configuration
dotenv.config();

// Express body parser
app.use(express.json());

// cors
app.use(cors());

// Image upload directory
app.use("/images", express.static(path.join(__dirname, "/images")));

// Mongo DB connection
mongoose
  .connect(process.env.MONGO_URL!)
  .then(() => {
    // Listen for API connection access if db connection is successful
    app.listen("8000", () => {
      console.log("Backend service running on port 8000.");
    });
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/posts", postRoute);
