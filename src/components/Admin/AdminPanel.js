import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPanel.css";
import { FaUsers, FaBoxOpen, FaMicrochip, FaSignOutAlt } from "react-icons/fa"; // Importamos los iconos

export default function AdminPanel() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // 🔹 Redirigir al login
  };

  return (
    <div className="admin-container">
      {/* 🔹 Header con botón de logout */}
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt /> Cerrar Sesión
        </button>
      </div>

      {/* 🔹 Secciones del panel */}
      <div className="admin-sections">
        <div className="admin-card" onClick={() => navigate("/admin/Usuarios")}>
          <FaUsers className="admin-icon" />
          <h2>Gestión de Usuarios</h2>
        </div>
        <div className="admin-card" onClick={() => navigate("/admin/productos")}>
          <FaBoxOpen className="admin-icon" />
          <h2>Gestión de Productos</h2>
        </div>
        <div className="admin-card" onClick={() => navigate("/admin/dispositivos")}>
          <FaMicrochip className="admin-icon" />
          <h2>Reporte de Dispositivos</h2>
        </div>
      </div>
    </div>
  );
}
