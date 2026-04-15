import express from "express";
const router = express.Router();
import User from "../models/user.js";
import passport from "passport";

router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and password are required",
      });
    }

    //  Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    //  Create new user
    const newUser = new User({ username, email });

    const registeredUser = await User.register(newUser, password);

    // Auto login after register
    req.login(registeredUser, (err) => {
      if (err) return next(err);

      //  Send JSON (NO redirect)
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: registeredUser,
      });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    //  Login failed
    console.log(user);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Login success
    req.login(user, (err) => {
      if (err) return next(err);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user,
      });
    });
  })(req, res, next);
});

// Logout
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  });
});

//  Get current user
router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  }

  return res.status(401).json({
    success: false,
    message: "Not authenticated",
  });
});

export default router;