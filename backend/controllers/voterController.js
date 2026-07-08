import express from "express";
import bcrypt from "bcrypt";
import Voter from "../models/voter.js";
import People from "../models/people.js";
import { getNextSequence } from "../utils/getNextSequence.js";

const router = express.Router();


export const registerVoter = async (req, res) => {
  try {
    const { fin, password, confirmPassword } = req.body;

    
    if (!fin || !password || !confirmPassword) {
      return res.status(400).json({ message: "FIN and passwords are required" });
    }

    
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    
    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
      return res.status(400).json({ message: "Password must contain letters and numbers" });
    }

    
    const person = await People.findOne({ fin });
    if (!person) {
      return res.status(404).json({ message: "FIN not found in People collection" });
    }

    
    const existingVoter = await Voter.findOne({ fin });
    if (existingVoter) {
      return res.status(409).json({ message: "Voter already registered with this FIN" });
    }

    
    const seq = await getNextSequence("voter_id");
    const voterId = "V" + seq;

    
    const hashedPassword = await bcrypt.hash(password, 10);

  
    const voter = await Voter.create({
      voter_id: seq,
      voter_identification: voterId,
      password: hashedPassword,
      fin
    });

    res.status(201).json({
      message: "Voter registered successfully",
      voter_id: voterId
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

router.post("/api/voters/register", registerVoter);

export default router;
