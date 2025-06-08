import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/"); // или другой путь, куда хочешь возвращаться
  };

  return (
    <nav
      style={{
        padding: "1rem",
        background: "#333",
        color: "#fff",
        display: "flex",
        alignItems: "center",
      }}
    >
      <button
        onClick={handleBackClick}
        style={{
          marginRight: 20,
          padding: "0.5rem 1rem",
          cursor: "pointer",
          background: "#555",
          border: "none",
          borderRadius: 4,
          color: "#fff",
        }}
      >
        Вернуться
      </button>

      <Link to="/admin/facilities" style={{ color: "#fff", marginRight: 20 }}>
        Facilities
      </Link>
      <Link to="/admin/events" style={{ color: "#fff", marginRight: 20 }}>
        Events
      </Link>
      <Link to="/admin/sectors" style={{ color: "#fff", marginRight: 20 }}>
        Sectors
      </Link>
      <Link to="/admin/map" style={{ color: "#fff" }}>
        Map
      </Link>
    </nav>
  );
};

export default AdminNavbar;
