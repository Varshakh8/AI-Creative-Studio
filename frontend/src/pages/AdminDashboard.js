import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Users, Shield, Activity, Trash2, Crown } from "lucide-react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [usage, setUsage] = useState([]);

  const token = localStorage.getItem("token");

  const authHeader = useMemo(() => ({
    Authorization: `Bearer ${token}`,
  }), [token]);

  useEffect(() => {
    fetch("http://localhost:8000/auth/admin/users", { headers: authHeader })
      .then(res => res.json())
      .then(setUsers);
  }, [authHeader]);

  useEffect(() => {
    fetch("http://localhost:8000/auth/admin/stats", { headers: authHeader })
      .then(res => res.json())
      .then(setStats);
  }, [authHeader]);

  useEffect(() => {
    fetch("http://localhost:8000/auth/admin/logs", { headers: authHeader })
      .then(res => res.json())
      .then(setLogs);
  }, [authHeader]);

  useEffect(() => {
    fetch("http://localhost:8000/auth/admin/usage", { headers: authHeader })
      .then(res => res.json())
      .then(setUsage);
  }, [authHeader]);

  const makeAdmin = async (id) => {
    await fetch(`http://localhost:8000/auth/admin/make-admin/${id}`, {
      method: "PUT",
      headers: authHeader,
    });
    window.location.reload();
  };

  const deleteUser = async (id) => {
    await fetch(`http://localhost:8000/auth/admin/delete-user/${id}`, {
      method: "DELETE",
      headers: authHeader,
    });
    window.location.reload();
  };

  return (
    <div className="admin-container">
      <motion.h1 
        className="admin-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        👑 Admin Control Panel
      </motion.h1>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <Users size={28} />
          <h3>Total Users</h3>
          <p>{stats?.total_users || 0}</p>
        </div>

        <div className="stat-card">
          <Shield size={28} />
          <h3>Admins</h3>
          <p>{stats?.total_admins || 0}</p>
        </div>

        <div className="stat-card">
          <Activity size={28} />
          <h3>Normal Users</h3>
          <p>{stats?.normal_users || 0}</p>
        </div>
      </div>

      {/* USERS */}
      <div className="panel">
        <h2>👥 Users</h2>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>
                  {u.is_admin ? (
                    <span className="badge admin">Admin</span>
                  ) : (
                    <span className="badge user">User</span>
                  )}
                </td>
                <td className="actions">
                  {!u.is_admin && (
                    <button className="btn promote" onClick={() => makeAdmin(u.id)}>
                      <Crown size={16}/> Make Admin
                    </button>
                  )}
                  <button className="btn delete" onClick={() => deleteUser(u.id)}>
                    <Trash2 size={16}/> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LOGS */}
      <div className="panel">
        <h2>📜 Admin Logs</h2>
        <div className="logs-box">
          {logs.map(l => (
            <div key={l.id} className="log-item">
              <b>{l.admin_username}</b> → {l.action}
              <span>{new Date(l.timestamp).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* USAGE */}
      <div className="panel">
        <h2>🤖 AI Usage</h2>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Feature</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            {usage.map((u, i) => (
              <tr key={i}>
                <td>{u.username}</td>
                <td>{u.feature}</td>
                <td>{u.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default AdminDashboard;
