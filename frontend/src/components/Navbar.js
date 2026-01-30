import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { VscAccount } from "react-icons/vsc";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="navbar">
      {/* LEFT */}
      <div className="nav-left">🎨 AI Creative Studio</div>

      {/* RIGHT (desktop) */}
      <div className="nav-desktop">
        <nav className="nav-links">
          <Link to="art">Art</Link>
          <Link to="music">Music</Link>
          <Link to="poetry">Poetry</Link>
        </nav>

        {/* Profile dropdown */}
        <div
          className="profile-wrapper"
          onClick={() => setProfileOpen(!profileOpen)}
        >
          <div className="profile-icon"><VscAccount size={60}/></div>

          {profileOpen && (
  <div className="profile-dropdown">
    <span onClick={() => navigate("/dashboard/profile")}>
      Profile
    </span>

    <span onClick={() => navigate("/dashboard/settings")}>
      ⚙ Settings
    </span>

    <span onClick={logout}>
      Logout
    </span>
  </div>
)}

        </div>
      </div>

      {/* HAMBURGER (mobile only) */}
      <div
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="art" onClick={() => setMenuOpen(false)}>Art</Link>
          <Link to="music" onClick={() => setMenuOpen(false)}>Music</Link>
          <Link to="poetry" onClick={() => setMenuOpen(false)}>Poetry</Link>
          <Link to="/dashboard/profile" onClick={() => setMenuOpen(false)}>
            Profile
          </Link>
          <Link to="/dashboard/settings" onClick={() => setMenuOpen(false)}>
            ⚙ Settings
          </Link>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </header>
  );
}

export default Navbar;
