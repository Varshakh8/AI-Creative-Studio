import React, { useState } from "react";
import "./TabStyles.css";

function PoetryTab() {
  const [prompt, setPrompt] = useState("");
  const [poetry, setPoetry] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const generatePoetry = async () => {
    setLoading(true);
    setPoetry("");

    try {
      const response = await fetch("http://127.0.0.1:8000/generate-poetry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || data.error || "Poetry generation failed");
        return;
      }

      if (data.poetry) {
        setPoetry(data.poetry);
      }
    } catch (err) {
      alert("Backend not reachable");
    }

    setLoading(false);
  };

  return (
    <div className="tab-card">
      <h2>📜 Poetry Generator</h2>

      <textarea
        rows="3"
        placeholder="Give a theme or line for poetry..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button onClick={generatePoetry} disabled={loading || !prompt}>
        {loading ? "Generating Poetry..." : "Generate Poetry"}
      </button>

      {poetry && (
        <div className="tab-result">
          <h3>Generated Poetry:</h3>
          <p>{poetry}</p>
        </div>
      )}
    </div>
  );
}

export default PoetryTab;
