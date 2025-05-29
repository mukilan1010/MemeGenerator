// In your backend (Express) - create a route file user.js or similar
import express from 'express';
import User from '../models/User.js';
import authMiddleware from './middleware/authenticateToken.js' // you need to create this to verify JWT/session

const router = express.Router();

router.get('/me', authMiddleware, async (req, res) => {
  try {
    console.log('REQ.USER:', req.user); // Debug log
    const userId = req.user.userId || req.user.id || req.user._id;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error in /me route:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;
