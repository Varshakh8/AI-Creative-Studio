import React, { useState } from "react";
import "./TabStyles.css";

function ArtTab() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const generateArt = async () => {
    setLoading(true);
    setImage(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/generate-art", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || data.error || "Something went wrong");
        return;
      }

      if (data.image_url) {
        setImage(data.image_url);
      }
    } catch (err) {
      alert("Backend not reachable");
    }

    setLoading(false);
  };

  return (
    <div className="tab-card">
      <h2>🎨 Art Generator</h2>

      <textarea
        rows="3"
        placeholder="Describe your artwork..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button onClick={generateArt} disabled={loading || !prompt}>
        {loading ? "Generating Art..." : "Generate Art"}
      </button>

      {image && (
        <div className="tab-result">
          <img src={image} alt="AI Art" width="400" />
        </div>
      )}
    </div>
  );
}

export default ArtTab;
