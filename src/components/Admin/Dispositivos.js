import { jsPDF } from "jspdf";
import React, { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./AdminPanel.css"; // Usamos los mismos estilos

export default function Dispositivos() {
  const [dispositivos, setDispositivos] = useState([]);
  const [error, setError] = useState(""); // Para manejar los errores de la petición
  const navigate = useNavigate();

  // Obtener dispositivos del backend
  useEffect(() => {
    const obtenerDispositivos = async () => {
      try {
        const response = await fetch("http://backendalturos.onrender.com/api/admin/dispositivos");

        if (!response.ok) {
          throw new Error(`❌ Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        setDispositivos(data);  // Guardamos los dispositivos en el estado
      } catch (error) {
        console.error("❌ Error al obtener dispositivos:", error);
        setError("❌ No se pudieron cargar los dispositivos.");
      }
    };

    obtenerDispositivos(); // Llamamos a la función cuando el componente se monta
  }, []);

  // 🔹 Generar PDF de reporte de dispositivos
  // 🔹 Generar PDF de reporte de dispositivos
const generarPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Reporte de Dispositivos - AlturOS", 20, 20);
  doc.setFontSize(10);

  const startY = 40;
  const cellHeight = 12;
  const cellPadding = 3;
  let yPosition = startY;

  const columns = ["ID Único", "Código", "Usuario", "Batería", "Estado"];
  const columnWidths = [25, 30, 50, 30, 40];
  const xPositions = [];
  let currentX = 10;
  for (let width of columnWidths) {
    xPositions.push(currentX);
    currentX += width;
  }

  // Establecemos el color de fondo del encabezado
  
  // Dibujamos los encabezados con color de fondo
  columns.forEach((col, i) => {
    doc.setFillColor(40, 40, 40); // Color de fondo (gris oscuro)
    doc.rect(xPositions[i], yPosition, columnWidths[i], cellHeight, 'FD'); // 'FD' hace el fondo relleno
    doc.setTextColor(255, 255, 255); // Color blanco para el texto
    doc.setFont('helvetica', 'bold');
    doc.text(col, xPositions[i] + cellPadding, yPosition + cellHeight / 2 + 3);
  });

  yPosition += cellHeight;
  doc.setFillColor(255, 255, 255); // Color de fondo (gris oscuro)
  doc.setTextColor(0, 0, 0); // Volver a color de texto negro para los datos
  doc.setFont('helvetica', 'normal');

  dispositivos.forEach((dispositivo) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }

    doc.rect(xPositions[0], yPosition, columnWidths[0], cellHeight);
    doc.text(dispositivo.dis_id.toString(), xPositions[0] + cellPadding, yPosition + 8);

    doc.rect(xPositions[1], yPosition, columnWidths[1], cellHeight);
    doc.text(dispositivo.dis_codigo.toString(), xPositions[1] + cellPadding, yPosition + 8);

    doc.rect(xPositions[2], yPosition, columnWidths[2], cellHeight);
    doc.text(dispositivo.us_nomb.toString(), xPositions[2] + cellPadding, yPosition + 8);

    doc.rect(xPositions[3], yPosition, columnWidths[3], cellHeight);
    doc.text(dispositivo.dis_bat.toString() + "%", xPositions[3] + cellPadding, yPosition + 8);

    doc.rect(xPositions[4], yPosition, columnWidths[4], cellHeight);
    doc.text(dispositivo.dis_stat === 1 ? "Activo" : "Inactivo", xPositions[4] + cellPadding, yPosition + 8);
    
    yPosition += cellHeight;
  });

  doc.save("Reporte_Dispositivos_AlturOS.pdf");
};



  return (
    <div className="admin-container">
      <h1>📋 Reporte de Dispositivos</h1>
      <p>Consulta el estado y ubicación de los dispositivos registrados.</p>
      <button className="boton-volver-admin" onClick={() => navigate("/admin")}>
        Volver
      </button>

      {/* Mostrar mensaje de error si existe */}
      {error && <p className="error-message">{error}</p>}

      <div className="admin-content">
        <div className="admin-sections">
          {dispositivos.length > 0 ? (
            dispositivos.map((dispositivo) => (
              <div className="admin-card" key={dispositivo.dis_id}>
                <h3>Dispositivo ID: {dispositivo.dis_id}</h3>
                <p><strong>Código:</strong> {dispositivo.dis_codigo}</p>
                <p><strong>Usuario:</strong> {dispositivo.us_id}</p>
                <p><strong>Batería:</strong> {dispositivo.dis_bat}%</p>
                <p 
                  style={{ 
                    color: dispositivo.dis_stat === 1 ? 'green' : 'red' 
                  }}
                >
                  <strong>Estado:</strong> {dispositivo.dis_stat === 1 ? "Activo" : "Inactivo"}
                </p>
              </div>
            ))
          ) : (
            <p>No hay dispositivos registrados.</p>
          )}
        </div>
      </div>

      {/* Botón para generar el reporte en PDF */}
      <button onClick={generarPDF} className="btn-pdf">
        <FaFilePdf /> Descargar Reporte de Dispositivos
      </button>
    </div>
  );
}
