import express from "express";
import Candidate from "../models/candidate.js";

const router = express.Router();


router.get("/results", async (req, res) => {
  try {
    const results = await Candidate.find()
      .select("first_name last_name party_name vote_count")
      .sort({ vote_count: -1 }); 

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch results" });
  }
});

export default router;
