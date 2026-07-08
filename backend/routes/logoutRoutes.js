import express from "express";
import { logoutMiddleware } from "../middlewares/logout.js";
import Voter from "../models/voter.js";

const router = express.Router();

router.post("/logout", logoutMiddleware, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    if (user.status === "loggedout") {
      return res.status(200).json({ message: "You are already logged out" });
    }

  
    user.status = "loggedout";
    await user.save();

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
