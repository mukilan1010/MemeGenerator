import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import signupRoute from './routes/signup.js';
import loginRoute from './routes/login.js';
import memesRouter from './routes/memes.js';
import userRouter from  './routes/user.js'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGO_URI;

app.use((req, res, next) => {
  const origin = req.headers.origin;
  // You can validate origin here if you want or allow all:
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});
app.use(cors());
app.use(express.json({ limit: '10mb' }));  // Increase limit to 10 megabytes or as needed
app.use(express.urlencoded({ limit: '10mb', extended: true }));


mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use('/api/signup', signupRoute);
app.use('/api/login', loginRoute);
app.use('/api/memes', memesRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
