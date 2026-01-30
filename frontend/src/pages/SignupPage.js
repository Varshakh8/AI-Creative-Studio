import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!username || !email || !password) {
      alert("All fields are required");
      return;
    }

    // Email must contain '@'
    if (!email.includes("@")) {
      alert("Email must be valid and contain '@'");
      return;
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
      alert(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
      );
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Signup successful! Please login.");
        navigate("/login");
      } else {
        alert(data.detail || data.message || "Signup failed");
      }
    } catch (error) {
      alert("Failed to signup: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>📝 Sign Up</h1>

        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSignup}>Create Account</button>

        <footer className="signup-footer">
          <p>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="login-link1"
            >
              Login
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default SignupPage;
