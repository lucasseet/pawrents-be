"use strict";

// =====================================
//           Dependencies
// =====================================
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
// import authRoutes from "./routes/auth.js";
// import userRoutes from "./routes/users.js";
// import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
// import { createPost } from "./controllers/posts.js";
// import { verifyToken } from "./middleware/auth.js";

// =====================================
//           Configurations
// =====================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
// to accept json and urlencoded
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// =====================================
//     File Storage - Middleware
// =====================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// =====================================
//              Routes
// =====================================

// Routes with files upload
app.post("/auth/register", upload.single("picture"), register);
// app.post("/posts", vcerifyToken, upload.single("picture"), createPost);

// Routes
// app.use("/auth", authRoutes);
// app.use("/users", userRoutes);
// app.use("/posts", postRoutes);

// =====================================
//         Initialize MongoDB
// =====================================
const PORT = process.env.PORT || 5000;

mongoose.set("strictQuery", false);
mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

// Once DB Connection is successfully established, do something

db.once("open", () => {
  console.log("MongoDB connection successful");

  app.listen(PORT, () => {
    console.log(`Server Port: ${PORT}`);
  });
});

db.on("error", () => {
  console.log("MongoDB connection failed");
});
