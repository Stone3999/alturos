import React from "react";
import "./AdminPanel.css"; // Usamos los mismos estilos

export default function Dispositivos() {
  return (
    <div className="admin-container">
      <h1>📋 Reporte de Dispositivos</h1>
      <p>Consulta el estado y ubicación de los dispositivos registrados.</p>
      <div className="admin-content">
        <div className="admin-card">
          <h2>Dispositivos Registrados</h2>
          <p>Aquí se listarán los dispositivos conectados.</p>
        </div>
      </div>
    </div>
  );
}
