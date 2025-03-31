import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCaidas } from "../Login/Firebase"; // Importamos la función para obtener las caídas
import "./AdminPanel.css"; // Estilos para las tarjetas de caídas

export default function HistorialCaidas() {
  const [caidas, setCaidas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener las caídas de Firebase al montar el componente
    getCaidas(setCaidas);  // Actualiza el estado con los datos de caídas en tiempo real
  }, []);

  return (
    <div className="admin-container">
      <h1>🧾 Historial de Caídas</h1>
      <p>Visualiza todas las caídas registradas en el sistema.</p>

      <button className="boton-volver-admin" onClick={() => navigate("/admin")}>
        Volver
      </button>

      <div className="admin-sections">
        {caidas.length > 0 ? (
          caidas.map((caida) => (
            <div className="admin-card" key={caida.id}>
              <h3>Fecha: {new Date(caida.fecha).toLocaleString()}</h3>
              <p><strong>Descripción:</strong> {caida.descripcion}</p>
              <p><strong>Latitud:</strong> {caida.latitud}</p>
              <p><strong>Longitud:</strong> {caida.longitud}</p>
              <p><strong>Pulso Cardíaco:</strong> {caida.pulsoCardiaco} BPM</p>
            </div>
          ))
        ) : (
          <p>No hay caídas registradas.</p>
        )}
      </div>
    </div>
  );
}
