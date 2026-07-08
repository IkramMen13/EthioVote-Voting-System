import express from "express";
import People from "../models/people.js";
import Voter from "../models/voter.js";
import Otp from "../models/otp.js";
import { getNextSequence } from "../utils/getNextSequence.js";
import { sendEmail } from "../utils/email.js";

const router = express.Router();

router.post("/forgetpassword", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    
    const person = await People.findOne({ email: email.trim() });
    if (!person) {
      return res.status(404).json({ message: "Email not found" });
    }

    
    const voter = await Voter.findOne({ fin: person.fin });
    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
    }

    
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const otpId = await getNextSequence("otp_id");

    const expiry = new Date(Date.now() + 120 * 1000); // 2 minute

    await Otp.create({
      otp_id: otpId,
      otp_code: otpCode,
      voter_identification: voter.voter_identification,
      expire_date_and_time: expiry,
      status: "not expired"
    });

    
    const htmlBody = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif;">
  <h1>🇪🇹 Ethiopian Voting System</h1>
  <h2>OTP Verification Code</h2>
  <p>Your OTP is:</p>
  <div style="font-size:32px;font-weight:bold;letter-spacing:8px;">
    ${otpCode}
  </div>
  <p style="color:red"><b>This OTP is valid for 2 minute only</b></p>
  <p>Do not share this code with anyone.</p>
</body>
</html>
`;

    const textBody = `
ETHIOPIAN VOTING SYSTEM

Your OTP: ${otpCode}

This OTP is valid for 2 minute.
Do not share this code.
`;

    
    const emailResult = await sendEmail({
      to: email,
      subject: "Your OTP Verification Code - Ethiopian Voting System",
      html: htmlBody,
      text: textBody
    });

    if (!emailResult.success) {
      console.error("Elastic Email error:", emailResult);
      throw new Error("Failed to send email");
    }

    return res.json({
      status: "success",
      message: "OTP sent successfully"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
});

export default router;
