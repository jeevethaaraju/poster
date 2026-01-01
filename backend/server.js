import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Replicate from "replicate";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN // your Replicate token
});

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const output = await replicate.run(
      "stability-ai/stable-diffusion", // model name
      {
        input: {
          prompt,
          width: 1024,
          height: 1024
        }
      }
    );

    // output is an array of image URLs
    res.json({ imageUrl: output[0] });

  } catch (error) {
    console.error("Replicate error:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
