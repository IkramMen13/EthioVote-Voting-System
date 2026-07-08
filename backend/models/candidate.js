import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
  candidate_id: { type: Number, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  gender: { type: String, required: true },
  position: { type: String, required: true },
  party_name: { type: String, required: true },
  date_of_birth: { type: Date, required: true },
  vote_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Candidate", candidateSchema);
