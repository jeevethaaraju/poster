import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch"; // required for AI Horde API calls

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// --------- AI Horde /generate route ---------
app.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt required" });

  try {
    // 1) Submit job to AI Horde
    const jobRes = await fetch("https://aihorde.net/api/v2/generate/async", {
      method: "POST",
      headers: {
        "apikey": "0000000000", // public free key
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt,
        steps: 30,    // quality
        width: 512,   // image width
        height: 512   // image height
      })
    });

    const jobData = await jobRes.json();
    if (!jobData.id) return res.status(500).json({ error: "No job ID returned" });

    const jobId = jobData.id;

    // 2) Poll job status until done
    let result;
    while (!result) {
      await new Promise(r => setTimeout(r, 2000)); // wait 2s
      const statusRes = await fetch(`https://aihorde.net/api/v2/status/${jobId}`);
      const statusData = await statusRes.json();

      if (statusData.status === "done" && statusData.output?.length) {
        result = statusData.output[0]; // image URL
      } else if (statusData.status === "failed") {
        return res.status(500).json({ error: "Generation failed" });
      }
    }

    res.json({ imageUrl: result });

  } catch (err) {
    console.error("AI Horde error:", err);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

// Serve frontend index
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
