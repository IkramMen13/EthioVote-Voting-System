import express from 'express';
import People from '../models/people.js';
import Voter from '../models/voter.js';
import Otp from '../models/otp.js';

const router = express.Router();

router.post('/verifyotp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ valid: false, message: "Email and OTP are required" });
    }

    
    const person = await People.findOne({ email: email.trim() });
    if (!person) return res.status(200).json({ valid: false, message: "Email not found" });

    
    const voter = await Voter.findOne({ fin: person.fin });
    if (!voter) return res.status(200).json({ valid: false, message: "Voter not found" });

    
    const otpRecord = await Otp.findOne({
      voter_identification: voter.voter_identification,
      otp_code: otp,
      status: "not expired",
      expire_date_and_time: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(200).json({ valid: false, message: "OTP invalid or expired" });
    }

    
    otpRecord.status = "expired";
    await otpRecord.save();

    
    res.status(200).json({ valid: true, voterId: voter.voter_identification });

  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ valid: false, message: "Server error" });
  }
});

export default router;
