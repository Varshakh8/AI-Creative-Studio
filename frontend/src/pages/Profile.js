import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { VscAccount } from "react-icons/vsc";
import { IoMdArrowRoundBack } from "react-icons/io";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://127.0.0.1:8000/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => console.error("Failed to load profile"));
  }, [navigate]);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-page">
      <div className="profile-card">
  <button className="back-btn" onClick={() => navigate("/dashboard/art")}>
    <IoMdArrowRoundBack size={20}/>
  </button>

  <div className="avatar"><VscAccount size={75} /></div>
  <h2>{user.username}</h2>
  <p className="role">Creative Member</p>

  <div className="info">
  <div className="info-row">
    <span>User ID:</span>
    <strong>{user.id}</strong>
  </div>

  <div className="info-row">
    <span>Email:</span>
    <strong>{user.email}</strong>
  </div>
</div>

</div>

    </div>
  );
}

export default Profile;
