import express from "express";
import { registerVoter } from "../controllers/voterController.js";
//import { generateOtp } from "../controllers/otpController.js";

const router = express.Router();

router.post("/register", registerVoter);


export default router;
