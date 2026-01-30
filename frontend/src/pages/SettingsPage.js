import React, { useState, useEffect } from "react";
import "./SettingsPage.css";

function SettingsPage() {
  const token = localStorage.getItem("token");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [deletePassword, setDeletePassword] = useState("");


  useEffect(() => {
    fetch("http://127.0.0.1:8000/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username);
        setEmail(data.email);
      })
      .catch(() => {
        setMessage("Failed to load profile");
      });
  }, [token]); // ✅ dependency fixed

  const updateUsername = async () => {
    const res = await fetch("http://127.0.0.1:8000/auth/update-profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username }),
    });

    const data = await res.json();
    setMessage(data.message || "Username updated");
  };

  const updateEmail = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/update-email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.detail || "Failed to update email");
      } else {
        setMessage(data.message || "Email updated successfully");
      }
    } catch (err) {
      setMessage("Server error while updating email");
    }
  };

  const updatePassword = async () => {
    const res = await fetch("http://127.0.0.1:8000/auth/update-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });

    const data = await res.json();
    setMessage(data.message || data.detail);
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const deleteAccount = async () => {
  const confirmDelete = window.confirm(
    "⚠️ This will permanently delete your account. Continue?"
  );

  if (!confirmDelete) return;

  const res = await fetch("http://127.0.0.1:8000/auth/delete-account", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password: deletePassword }),
  });

  const data = await res.json();

  if (!res.ok) {
    setMessage(data.detail || "Failed to delete account");
  } else {
    alert("Account deleted successfully");
    localStorage.clear();
    window.location.href = "/";
  }
};


  return (
    <div className="settings-page">
      <h2>⚙ Account Settings</h2>

      <div className="settings-card">
        <h3>Update Username</h3>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={updateUsername}>Save</button>
      </div>

      <div className="settings-card">
        <h3>Update Email</h3>
        <input
          type="email"
          placeholder="New email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={updateEmail}>Update Email</button>
      </div>

      <div className="settings-card">
        <h3>Change Password</h3>
        <input
          type="password"
          placeholder="Old Password"
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={updatePassword}>Update Password</button>
      </div>

      {message && <p className="msg">{message}</p>}

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>

      <div className="settings-card danger">
  <h3>🚨 Danger Zone</h3>
  <p>This action is permanent and cannot be undone.</p>

  <input
    type="password"
    placeholder="Confirm your password"
    value={deletePassword}
    onChange={(e) => setDeletePassword(e.target.value)}
  />

  <button className="delete-btn" onClick={deleteAccount}>
    Delete Account
  </button>
</div>

    </div>
  );
}

export default SettingsPage;
