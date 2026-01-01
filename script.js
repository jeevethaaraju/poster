// Replace this with your Render backend URL when deployed
const API_URL = "https://poster-1wp7.onrender.com";

// Generate AI Poster
async function generatePosterAI() {
  const keyword = document.getElementById("keyword").value.trim();

  if (!keyword) {
    alert("Please enter a keyword!");
    return;
  }

  const posterImg = document.getElementById("posterAI");
  posterImg.src = ""; // Reset image

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: keyword }),
    });

    const data = await response.json();

    if (data.imageUrl) {
      posterImg.src = data.imageUrl;
    } else if (data.error) {
      if (data.error.includes("Billing hard limit")) {
        alert("Cannot generate poster: OpenAI billing limit reached 😢");
      } else {
        alert("Error: " + data.error);
      }
      posterImg.src = "https://via.placeholder.com/512x512.png?text=Poster+Unavailable";
    } else {
      alert("Failed to generate poster.");
      posterImg.src = "https://via.placeholder.com/512x512.png?text=Poster+Unavailable";
    }
  } catch (err) {
    console.error(err);
    alert("Error connecting to server!");
    posterImg.src = "https://via.placeholder.com/512x512.png?text=Poster+Unavailable";
  }
}

// Download the poster
function downloadAI() {
  const img = document.getElementById("posterAI");

  if (!img.src || img.src.includes("placeholder")) {
    alert("Generate a poster first!");
    return;
  }

  const a = document.createElement("a");
  a.href = img.src;
  a.download = "poster.png";
  a.click();
}
