async function generateImage() {
  const prompt = document.getElementById("prompt").value.trim();
  if (!prompt) {
    alert("Please enter a prompt!");
    return;
  }

  const img = document.getElementById("result");
  img.src = ""; // clear previous image
  img.alt = "Generating...";

  try {
    const res = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    if (data.imageUrl) {
      img.src = data.imageUrl;
      img.alt = "Generated Image";
    } else {
      alert(data.error || "Failed to generate image");
      img.alt = "Failed";
    }
  } catch (err) {
    console.error(err);
    alert("Error generating image");
    img.alt = "Error";
  }
}
