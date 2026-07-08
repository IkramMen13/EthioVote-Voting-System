import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.get("/dashboard", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Welcome to dashboard",
    voter: {
      id: req.user._id,
      voter_id: req.user.voter_identification
    }
  });
});

export default router;
