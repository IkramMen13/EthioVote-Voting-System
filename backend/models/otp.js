import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  otp_id: Number,
  otp_code: String,
  voter_identification: String,
  expire_date_and_time: Date,
  status: { type: String, default: "not expired" }
});

otpSchema.index(
  { expire_date_and_time: 1 },
  { expireAfterSeconds: 0 }
);

export default mongoose.model("Otp", otpSchema);
