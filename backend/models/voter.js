import mongoose from "mongoose";

const voterSchema = new mongoose.Schema({
  voter_id: { type: String, unique: true },
  voter_identification: { type: String, unique: true },
  password: String,
  status: { type: String, default: "loggedout" },
  voting_status: { type: String, default: "not voted" },
  fin: { type: String, unique: true }
});

export default mongoose.models.Voter || mongoose.model("Voter", voterSchema);
