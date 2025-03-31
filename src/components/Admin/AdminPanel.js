import React from "react";
import { FaBoxOpen, FaChartLine, FaHistory, FaMicrochip, FaShoppingBag, FaSignOutAlt, FaUsers } from "react-icons/fa"; // Importamos los iconos
import { useNavigate } from "react-router-dom";
import "./AdminPanel.css";

export default function AdminPanel({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Llama a la función de cierre de sesión
    navigate("/"); // Redirige al login
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
        <div className="admin-card" onClick={() => navigate("/admin/usuarios")}>
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
        <div className="admin-card" onClick={() => navigate("/admin/ventas")}>
          <FaShoppingBag className="admin-icon" />
          <h2>Reporte de Ventas</h2>
        </div>
        {/* Botón para ver el historial de caídas */}
        <div className="admin-card" onClick={() => navigate("/admin/historial")}>
          <FaHistory className="admin-icon" />
          <h2>Historial de Caídas</h2>
        </div>
        <div className="admin-card" onClick={() => navigate("/admin/graficas")}>
          <FaChartLine className="admin-icon" />
          <h2>Gráficas</h2>
        </div>
      </div>
    </div>
  );
}
