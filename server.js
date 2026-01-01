import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend files from frontend folder
app.use(express.static(path.join(__dirname, "../frontend")));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint for generating image
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const response = await client.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    const imageBase64 = response.data[0].b64_json;
    const imageUrl = `data:image/png;base64,${imageBase64}`;
    res.json({ imageUrl });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

// Serve index.html for the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
