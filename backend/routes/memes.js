import express from 'express';
import Meme from '../models/Meme.js';
import authenticateToken from './middleware/authenticateToken.js'; // Use your existing auth middleware

const router = express.Router();

// Save a meme (requires authentication)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      imageData,
      topText,
      bottomText,
      topColor,
      bottomColor,
      topFont,
      bottomFont,
      createdAt,
    } = req.body;

    if (!imageData) {
      return res.status(400).json({ message: 'imageData is required' });
    }

    console.log('REQ.USER:', req.user); // 🔍 DEBUG
    console.log('REQ.BODY:', req.body); // 🔍 DEBUG

    const memeData = {
      userId: req.user.userId, // Make sure this is not undefined!
      imageData,
      topText,
      bottomText,
      topColor,
      bottomColor,
      topFont,
      bottomFont,
      createdAt: createdAt || new Date(),
    };

    const newMeme = new Meme(memeData);
    const savedMeme = await newMeme.save();

    res.status(201).json(savedMeme);
  } catch (error) {
    console.error('❌ Error saving meme:', error); // 🔥 Check this in your terminal
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Get all memes of the logged-in user
router.get('/my-memes', authenticateToken, async (req, res) => {
  try {
    // Use the same property that you use when saving memes
    const userId = req.user.userId || req.user.id || req.user._id;
    
    console.log('Fetching memes for userId:', userId); // Debug log
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID not found in token' });
    }
    
    const memes = await Meme.find({ userId }).sort({ createdAt: -1 });
    
    console.log('Found memes:', memes.length); // Debug log
    
    // Return in the format expected by your Dashboard component
    res.json({ memes });
  } catch (error) {
    console.error('Error fetching memes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



export default router;
