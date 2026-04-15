import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";

import User from "./models/user.js";

const app = express();

// CORS Configuration
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  credentials: true
}));
app.use(express.json());

// Session Config
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "mysupersecretkey",
  resave: false,
  saveUninitialized: false,
};

// Middleware
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

// Passport Config
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
import userRouter from "./routes/user.js"
import noteRouter from "./routes/note.js";

// MongoDB Connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Vibe");
    console.log("Connected to MongoDB database");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

connectDB();

// Demo Route - Only for development
app.get("/demouser", async (req, res) => {
  try {
    let fakeUser = new User({
      email: "bikram@gmail.com",
      username: "bikram",
    });

    let newUser = await User.register(fakeUser, "hellopassword");
    res.json({
      success: true,
      message: "Demo user created",
      user: newUser
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// API Routes
app.use("/api/auth", userRouter);
app.use("/api/notes", noteRouter);

// Root Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to API" });
});

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});