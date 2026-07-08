import Otp from "../models/otp.js";
import { getNextSequence } from "../utils/getNextSequence.js";

export const generateOtp = async (req, res) => {
  try {
    const { voter_identification } = req.body;

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpId = await getNextSequence("otp_id");

    await Otp.create({
      otp_id: otpId,
      otp_code: otpCode,
      voter_identification,
      expire_date_and_time: new Date(Date.now() + 5 * 60 * 1000)
    });

    res.json({ message: "OTP generated", otp: otpCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
