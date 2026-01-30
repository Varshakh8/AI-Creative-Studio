import React, { useState } from "react";
import "./TabStyles.css";

function MusicTab() {
  const [prompt, setPrompt] = useState("");
  const [musicUrl, setMusicUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const generateMusic = async () => {
    setLoading(true);
    setMusicUrl(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/generate-music", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || data.error || "Music generation failed");
        return;
      }

      if (data.music_url) {
        setMusicUrl(data.music_url);
      }
    } catch (err) {
      alert("Backend not reachable");
    }

    setLoading(false);
  };

  return (
    <div className="tab-card">
      <h2>🎵 Music Generator</h2>

      <textarea
        rows="3"
        placeholder="Describe your music..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button onClick={generateMusic} disabled={loading || !prompt}>
        {loading ? "Generating..." : "Generate Music"}
      </button>

      {musicUrl && (
        <div className="tab-result">
          <audio controls>
            <source src={musicUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}

export default MusicTab;
