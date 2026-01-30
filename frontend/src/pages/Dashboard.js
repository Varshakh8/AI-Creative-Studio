// src/pages/Dashboard.js
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <Navbar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
