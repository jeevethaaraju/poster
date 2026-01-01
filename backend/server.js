import fetch from "node-fetch";

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt required" });

  try {
    const jobRes = await fetch("https://aihorde.net/api/v2/generate/async", {
      method: "POST",
      headers: {
        "apikey": "0000000000",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt, steps: 30, width: 512, height: 512 })
    });

    const jobData = await jobRes.json();
    const jobId = jobData.id;

    let result;
    while (!result) {
      await new Promise(r => setTimeout(r, 2000));
      const statusRes = await fetch(`https://aihorde.net/api/v2/status/${jobId}`);
      const statusData = await statusRes.json();
      if (statusData.status === "done" && statusData.output?.length) result = statusData.output[0];
      else if (statusData.status === "failed") return res.status(500).json({ error: "Generation failed" });
    }

    res.json({ imageUrl: result });
  } catch (err) {
    console.error("AI Horde error:", err);
    res.status(500).json({ error: "Failed to generate image" });
  }
});
