import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      console.log("Attempting login...");

      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Login failed");
        return;
      }

      // 🔐 Store auth
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("is_admin", String(data.is_admin)); // 🔥 force string

      // 🚦 Role-based routing
      if (data.is_admin === true) {
        navigate("/admin", { replace: true });      // 🔥 prevent back button loop
      } else {
        navigate("/dashboard", { replace: true });  // 🔥
      }

    } catch (err) {
      console.error("Login error:", err);
      alert("Backend not reachable");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🎨 AI Creative Studio</h1>
        <p className="login-subtitle">
          Create Art • Music • Poetry using AI
        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <p className="signup-text">
          Don’t have an account?{" "}
          <span className="signup-link" onClick={() => navigate("/signup")}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
