import express from "express";
import People from "../models/people.js";
import Voter from "../models/voter.js";
import Otp from "../models/otp.js";
import { getNextSequence } from "../utils/getNextSequence.js";
import { sendEmail } from "../utils/email.js"; // import your email util

const router = express.Router();

router.post("/resendotp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // 1️⃣ Find person
    const person = await People.findOne({ email: email.trim() });
    if (!person) {
      return res.status(404).json({
        success: false,
        message: "Email not found"
      });
    }

    // 2️⃣ Find voter
    const voter = await Voter.findOne({ fin: person.fin });
    if (!voter) {
      return res.status(404).json({
        success: false,
        message: "Voter not found"
      });
    }

    // 3️⃣ Expire previous OTPs
    await Otp.updateMany(
      {
        voter_identification: voter.voter_identification,
        status: "not expired"
      },
      { $set: { status: "expired" } }
    );

    // 4️⃣ Generate new OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const otpId = await getNextSequence("otp_id");
    const expiryDate = new Date(Date.now() + 120 * 1000); // 2 min

    await Otp.create({
      otp_id: otpId,
      otp_code: otpCode,
      voter_identification: voter.voter_identification,
      expire_date_and_time: expiryDate,
      status: "not expired"
    });

    console.log(`Resent OTP for ${email}: ${otpCode}`);

    // 5️⃣ Send OTP email
    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>OTP Verification</title>
</head>
<body style="font-family: Arial, sans-serif;">
  <h1>🇪🇹 Ethiopian Voting System</h1>
  <h2>OTP Verification Code</h2>
  <p>Your OTP is:</p>
  <div style="font-size:32px;font-weight:bold;letter-spacing:8px;">${otpCode}</div>
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

    try {
      const emailResult = await sendEmail({
        to: email,
        subject: "Your OTP Verification Code - Ethiopian Voting System",
        html: htmlBody,
        text: textBody
      });

      if (!emailResult.success) {
        console.error("Elastic Email error:", emailResult);
      } else {
        console.log(`OTP email sent successfully to ${email}`);
      }
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      // Continue without failing the request
    }

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully"
    });

  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      details: error.message
    });
  }
});

export default router;
