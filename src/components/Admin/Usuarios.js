import { jsPDF } from "jspdf"; // Importar jsPDF
import React, { useEffect, useState } from "react";
import { FaFilePdf, FaTrash } from "react-icons/fa"; // Importar íconos
import { useNavigate } from "react-router-dom";

export default function Usuarios() {
  const navigate = useNavigate();
  const [Usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // Obtener Usuarios desde la API
  const obtenerUsuarios = async () => {
    try {
      const response = await fetch("http://backendalturos.onrender.com/api/admin/usuarios");

      if (!response.ok) {
        throw new Error(`❌ Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("❌ Error de conexión con el servidor:", error);
      setError("❌ No se pudo obtener la lista de Usuarios.");
    }
  };

  // Eliminar Usuario
  const eliminarUsuario = async (id_us) => {
    if (!window.confirm("¿Estás seguro de eliminar este Usuario?")) return;

    try {
      const response = await fetch(`http://backendalturos.onrender.com/api/admin/usuarios/${id_us}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("❌ No se pudo eliminar el Usuario.");
      }

      alert("✅ Usuario eliminado correctamente");
      obtenerUsuarios(); // Recargar lista
    } catch (error) {
      console.error("❌ Error al eliminar Usuario:", error);
    }
  };

  // Cambiar rol de Usuario
  const cambiarRol = async (id_us, nuevoRol) => {
    try {
      const response = await fetch(`http://backendalturos.onrender.com/api/admin/usuarios/${id_us}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ us_tipo: nuevoRol }),
      });

      if (!response.ok) {
        throw new Error("❌ No se pudo cambiar el rol del Usuario.");
      }

      alert("✅ Rol actualizado correctamente");
      obtenerUsuarios(); // Recargar lista
    } catch (error) {
      console.error("❌ Error al cambiar rol:", error);
    }
  };

// Generar reporte en PDF con formato de tabla
const generarPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Reporte de Usuarios - AlturOS", 20, 20);
  doc.setFontSize(12);

  const startY = 40; // Ajustar la posición inicial para dejar más espacio en el encabezado

  // Definir las columnas con un ancho más amplio
  const columns = ["ID", "Nombre", "Correo", "Rol"];
  const columnWidths = [20, 60, 80, 40]; // Ajustar los anchos de las columnas

  // Definir los datos de la tabla y asegurarnos de que todo sea string
  const data = Usuarios.map((usuario) => [
    String(usuario.id_us),
    `${usuario.us_nomb} ${usuario.us_apep}`,
    usuario.us_mail,
    usuario.us_tipo === 0 ? "Cuidador" : "Supervisado",
  ]);

  const cellHeight = 10;
  const cellPadding = 5;
  let yPosition = startY;

  // Dibujar cabecera de la tabla
  columns.forEach((column, index) => {
    doc.rect(20 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yPosition, columnWidths[index], cellHeight);
    doc.text(column, 20 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + cellPadding, yPosition + cellHeight / 2 + 3);
  });

  yPosition += cellHeight;

  // Dibujar filas de la tabla
  data.forEach((row) => {
    row.forEach((cell, index) => {
      doc.rect(20 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yPosition, columnWidths[index], cellHeight);
      doc.text(cell, 20 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + cellPadding, yPosition + cellHeight / 2 + 3);
    });
    yPosition += cellHeight;
  });

  // Descargar el PDF
  doc.save("Reporte_Usuarios_AlturOS.pdf");
};

  return (
    <div className="admin-container">
      <h1>👤 Gestión de Usuarios</h1>
      <p>Administra los Usuarios y sus permisos en el sistema.</p>

      {error && <p className="error-message">{error}</p>}

      <button className="boton-volver-admin" onClick={() => navigate("/admin")}>
          Volver
      </button>

      <p></p>

      <button onClick={generarPDF} className="btn-pdf">
        <FaFilePdf /> Descargar Reporte de Usuarios
      </button>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Usuarios.length > 0 ? (
            Usuarios.map((Usuario) => (
              <tr key={Usuario.id_us}>
                <td>{Usuario.id_us}</td>
                <td>{Usuario.us_nomb} {Usuario.us_apep}</td>
                <td>{Usuario.us_mail}</td>
                <td>
                  <select
                    value={Usuario.us_tipo}
                    onChange={(e) => cambiarRol(Usuario.id_us, e.target.value)}
                  >
                    <option value="0">Cuidador</option>
                    <option value="1">Supervisado</option>
                  </select>
                </td>

                <td>
                  <button className="delete-button" onClick={() => eliminarUsuario(Usuario.id_us)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No hay Usuarios registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
