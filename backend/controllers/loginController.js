import express from "express";
import bcrypt from "bcrypt";
import Voter from "../models/voter.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { voter_id, password } = req.body;

  
    if (!voter_id || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    
    const user = await Voter.findOne({ voter_identification: voter_id });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing!");
      return res.status(500).json({ message: "Server misconfiguration" });
    }


    const token = jwt.sign(
      { id: user._id.toString() },       
      process.env.JWT_SECRET.trim(),   
      { expiresIn: "1h" }
    );
     console.log("Generated token 👉", token);
    
    if (user.status === "loggedin") {
      return res.status(200).json({
        message: "You are already logged in",
        redirect: "/dashboard", 
         token : token,
        voter: {
          id: user._id,
          voter_id: user.voter_identification,
          status: user.status,
        },
      });
    }

  
    user.status = "loggedin";
    await user.save();

    return res.status(200).json({
      message: "Login successful",
      redirect: "/dashboard",
       token : token,
      voter: {
        id: user._id,
        voter_id: user.voter_identification,
        status: user.status,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;  