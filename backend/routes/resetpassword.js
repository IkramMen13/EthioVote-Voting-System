import express from 'express';
import Voter from '../models/voter.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { voterId, password } = req.body;

    if (!voterId || !password) {
      return res.status(400).json({ success: false, message: 'Voter ID and password are required' });
    }

    const voter = await Voter.findOne({ voter_identification: voterId });
    if (!voter) {
      return res.status(200).json({ success: false, message: 'Voter not found' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    voter.password = hashedPassword;
    await voter.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
