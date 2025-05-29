import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

const HF_API_TOKEN = process.env.HF_API_TOKEN;
const HF_API_URL = "https://api-inference.huggingface.co/models/EleutherAI/gpt-j-6B";

router.post('/', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 50,
          temperature: 0.8,
        },
      }),
    });

    const rawText = await response.text();
    console.log("Hugging Face raw response:", rawText);

    if (!response.ok) {
      // If status code is not 2xx
      console.error(`Hugging Face API error: HTTP ${response.status} - ${response.statusText}`);
      return res.status(response.status).json({ error: `Hugging Face API error: ${response.statusText}` });
    }

    let result;
    try {
      result = JSON.parse(rawText);
    } catch (parseError) {
      console.error("Error parsing Hugging Face JSON response:", parseError);
      return res.status(500).json({ error: "Invalid JSON response from Hugging Face" });
    }

    if (result.error) {
      console.error("Hugging Face API error:", result.error);
      return res.status(500).json({ error: `Hugging Face API error: ${result.error}` });
    }

    const generatedText = result[0]?.generated_text || 'No output';
    return res.json({ caption: generatedText });

  } catch (err) {
    console.error("Error calling Hugging Face API:", err);
    return res.status(500).json({ error: "Failed to generate meme caption" });
  }
});


export default router;
