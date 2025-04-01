import { jsPDF } from "jspdf";
import React, { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Ventas() {
const navigate = useNavigate();

const [ventas, setVentas] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        obtenerVentas();
    }, []);

    // 🔹 Obtener ventas desde el backend
    const obtenerVentas = async () => {
        try {
        const response = await fetch("http://backendalturos.onrender.com/api/admin/ventas");

        if (!response.ok) {
            throw new Error(`❌ Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        setVentas(data);
        } catch (error) {
        console.error("❌ Error al obtener ventas:", error);
        setError("❌ No se pudieron cargar las ventas.");
        }
    };

    // 🔹 Generar PDF de reporte
    const generarPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Reporte de Ventas - AlturOS", 20, 20);
        doc.setFontSize(10);

        const startY = 40;
        const cellHeight = 12;
        const cellPadding = 3;
        let yPosition = startY;

        const columns = ["ID Venta", "ID Usuario", "Producto", "Fecha", "Total"];
        const columnWidths = [25, 30, 50, 45, 30];
        const xPositions = [];
        let currentX = 10;
        for (let width of columnWidths) {
        xPositions.push(currentX);
        currentX += width;
        }

        // Encabezados
        doc.setFillColor(40, 40, 40);
        columns.forEach((col, i) => {
        doc.rect(xPositions[i], yPosition, columnWidths[i], cellHeight, 'FD');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text(col, xPositions[i] + cellPadding, yPosition + cellHeight / 2 + 3);
        });

        yPosition += cellHeight;
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');

        ventas.forEach((venta) => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }

        doc.rect(xPositions[0], yPosition, columnWidths[0], cellHeight);
        doc.text(String(venta.vent_id), xPositions[0] + cellPadding, yPosition + 8);

        doc.rect(xPositions[1], yPosition, columnWidths[1], cellHeight);
        doc.text(String(venta.us_id), xPositions[1] + cellPadding, yPosition + 8);

        doc.rect(xPositions[2], yPosition, columnWidths[2], cellHeight);
        doc.text(venta.prod_nom || "", xPositions[2] + cellPadding, yPosition + 8);

        doc.rect(xPositions[3], yPosition, columnWidths[3], cellHeight);
        doc.text(new Date(venta.vent_fecha).toLocaleString(), xPositions[3] + cellPadding, yPosition + 8);

        doc.rect(xPositions[4], yPosition, columnWidths[4], cellHeight);
        doc.text(`$${Number(venta.vent_total).toFixed(2)}`, xPositions[4] + cellPadding, yPosition + 8);

        yPosition += cellHeight;
        });

        doc.save("Reporte_Ventas_AlturOS.pdf");
    };

    return (
        <div className="admin-container">
        <h1>🧾 Reporte de Ventas</h1>
        <p>Visualiza todas las ventas realizadas en el sistema.</p>

        {error && <p className="error-message">{error}</p>}

        <button className="boton-volver-admin" onClick={() => navigate("/admin")}>
            Volver
        </button>
        
        <p></p>

        <button onClick={generarPDF} className="btn-pdf">
            <FaFilePdf /> Descargar Reporte de Ventas
        </button>

        <table className="admin-table">
            <thead>
            <tr>
                <th>ID Venta</th>
                <th>ID Usuario</th>
                <th>Producto</th>
                <th>Fecha</th>
                <th>Total</th>
            </tr>
            </thead>
            <tbody>
            {ventas.length > 0 ? (
                ventas.map((venta) => (
                <tr key={venta.vent_id}>
                    <td>{venta.vent_id}</td>
                    <td>{venta.us_id}</td>
                    <td>{venta.prod_nom}</td>
                    <td>{new Date(venta.vent_fecha).toLocaleString()}</td>
                    <td>${Number(venta.vent_total).toFixed(2)}</td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan="5">No hay ventas registradas</td>
                </tr>
            )}
            </tbody>
        </table>
        </div>
    );
}
