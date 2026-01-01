// script.js

async function generatePosterAI() {
  const keyword = document.getElementById("keyword").value.trim();

  if (!keyword) {
    alert("Please enter a keyword!");
    return;
  }

  // Show loading or reset previous poster
  const posterImg = document.getElementById("posterAI");
  posterImg.src = ""; // reset image
  posterImg.alt = "Generating poster...";

  try {
    const response = await fetch("https://poster-ai-e3tv.onrender.com/generate", { // <== Replace this
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: keyword })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    if (data.imageUrl) {
      posterImg.src = data.imageUrl;
      posterImg.alt = "AI Poster";
    } else {
      posterImg.alt = "Failed to generate poster";
      alert("No image returned from server.");
    }

  } catch (error) {
    console.error(error);
    posterImg.alt = "Error connecting to server";
    alert("Error connecting to server. Please try again later.");
  }
}

// Download function
function downloadAI() {
  const posterImg = document.getElementById("posterAI");
  if (!posterImg.src) {
    alert("No poster to download!");
    return;
  }

  const link = document.createElement("a");
  link.href = posterImg.src;
  link.download = "AI_Poster.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
