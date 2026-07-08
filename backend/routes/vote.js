import express from "express";
import authMiddleware from "../middlewares/auth.js";
import Voter from "../models/voter.js";
import Candidate from "../models/candidate.js";

const router = express.Router();


router.post("/", authMiddleware, async (req, res) => {
  try {
    const voter = req.user; 
    const { candidateId } = req.body; 

    
    if (voter.voting_status === "voted") {
      return res.status(400).json({ message: "You have already voted!" });
    }

    
    const candidate = await Candidate.findOne({ candidate_id: candidateId });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    
    candidate.vote_count += 1;
    await candidate.save();

    
    voter.voting_status = "voted";
    await voter.save();

    return res.status(200).json({
      message: `Your vote for ${candidate.first_name} ${candidate.last_name} has been cast!`
    });

  } catch (err) {
    console.error("Vote backend error:", err.message);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

export default router;
