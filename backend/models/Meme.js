import mongoose from 'mongoose';

const memeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference user id
    required: true,
    ref: 'User',
  },
  imageData: {
    type: String, // Store base64 image data URL
    required: true,
  },
  topText: String,
  bottomText: String,
  topColor: String,
  bottomColor: String,
  topFont: String,
  bottomFont: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Meme = mongoose.model('Meme', memeSchema);

export default Meme;
