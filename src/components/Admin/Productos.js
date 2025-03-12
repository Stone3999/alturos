import React from "react";
import "./AdminPanel.css"; // Usamos los mismos estilos

export default function Productos() {
  return (
    <div className="admin-container">
      <h1>📦 Gestión de Productos</h1>
      <p>Agrega, edita o elimina productos del inventario.</p>
      <div className="admin-content">
        <div className="admin-card">
          <h2>Inventario</h2>
          <p>Aquí se mostrarán los productos disponibles en la tienda.</p>
        </div>
      </div>
    </div>
  );
}
