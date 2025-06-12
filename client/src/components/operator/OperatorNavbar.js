import { Link, useNavigate } from "react-router-dom";

const OperatorNavbar = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/");
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
        Сканер
      </Link>
    </nav>
  );
};

export default OperatorNavbar;
