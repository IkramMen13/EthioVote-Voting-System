import express from "express";
import Feedback from "../models/feedback.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message, } = req.body;

    if (!message ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const feedback = new Feedback({ message,});
    await feedback.save();

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback
    });
  } catch (error) {
    console.error("Feedback error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
