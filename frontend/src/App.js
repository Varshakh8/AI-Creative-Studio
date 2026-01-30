import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import ArtTab from "./pages/ArtTab";
import MusicTab from "./pages/MusicTab";
import PoetryTab from "./pages/PoetryTab";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import SettingsPage from "./pages/SettingsPage";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>

        {/* Default */}
        <Route path="/" element={<Navigate to="/landing" replace />} />

        {/* Public */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* User Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<ArtTab />} />   {/* 🔥 default tab */}
          <Route path="art" element={<ArtTab />} />
          <Route path="music" element={<MusicTab />} />
          <Route path="poetry" element={<PoetryTab />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Admin Protected */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
