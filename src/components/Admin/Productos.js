import { jsPDF } from "jspdf"; // Importar jsPDF
import React, { useEffect, useState } from "react";
import { FaEdit, FaFilePdf, FaTrash } from "react-icons/fa"; // Importar íconos
import { useNavigate } from "react-router-dom";


export default function Productos() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const [productoEditado, setProductoEditado] = useState(null);

  useEffect(() => {
    obtenerProductos();
  }, []);

  // Obtener todos los productos desde la API
  const obtenerProductos = async () => {
    try {
      const response = await fetch("https://backendalturos.onrender.com/api/productos");

      if (!response.ok) {
        throw new Error(`❌ Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("❌ Error de conexión con el servidor:", error);
      setError("❌ No se pudo obtener la lista de productos.");
    }
  };

  // 🔹 Eliminar producto
  const eliminarProducto = async (prod_id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const response = await fetch(`https://backendalturos.onrender.com/api/productos/producto/${prod_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("❌ No se pudo eliminar el producto.");
      }

      alert("✅ Producto eliminado correctamente");
      obtenerProductos(); // Recargar lista
    } catch (error) {
      console.error("❌ Error al eliminar producto:", error);
    }
  };

  // 🔹 Generar reporte en PDF con formato de tabla
const generarPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Reporte de Productos - AlturOS", 20, 20);
  doc.setFontSize(10);

  const startY = 40;
  const cellHeight = 15;
  const cellPadding = 3;
  let yPosition = startY;

  // Definir las columnas con anchos personalizados
  const columns = ["ID", "Nombre", "Descripción", "Precio", "Stock"];
  const columnWidths = [20, 40, 70, 30, 30]; // Ajuste de anchos para cada columna
  
  // Calcular posiciones X para cada columna
  const xPositions = [];
  let currentX = 10;
  for (let i = 0; i < columnWidths.length; i++) {
    xPositions.push(currentX);
    currentX += columnWidths[i];
  }

  // Dibujar cabecera de la tabla
  doc.setFillColor(50, 50, 50); // Cambiado a un gris oscuro más profesional
  columns.forEach((column, index) => {
    doc.rect(xPositions[index], yPosition, columnWidths[index], cellHeight, 'FD');
    doc.setTextColor(255, 255, 255); // Texto blanco para mejor contraste
    doc.setFont('helvetica', 'bold');
    doc.text(column, xPositions[index] + cellPadding, yPosition + cellHeight / 2 + 3);
  });

  yPosition += cellHeight;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0); // Volver al texto negro para el contenido

  // Dibujar filas de la tabla
  productos.forEach((producto) => {
    // Verificar si necesitamos una nueva página
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }

    // Acortar la descripción si es muy larga
    let descripcion = producto.prod_desc;
    if (descripcion && descripcion.length > 40) {
      descripcion = descripcion.substring(0, 37) + '...';
    }

    // ID
    doc.rect(xPositions[0], yPosition, columnWidths[0], cellHeight);
    doc.text(String(producto.prod_id), xPositions[0] + cellPadding, yPosition + cellHeight / 2 + 3);

    // Nombre
    doc.rect(xPositions[1], yPosition, columnWidths[1], cellHeight);
    doc.text(producto.prod_nom || '', xPositions[1] + cellPadding, yPosition + cellHeight / 2 + 3);

    // Descripción
    doc.rect(xPositions[2], yPosition, columnWidths[2], cellHeight);
    doc.text(descripcion || '', xPositions[2] + cellPadding, yPosition + cellHeight / 2 + 3);

    // Precio
    doc.rect(xPositions[3], yPosition, columnWidths[3], cellHeight);
    doc.text(`$${producto.prod_precio}`, xPositions[3] + cellPadding, yPosition + cellHeight / 2 + 3);

    // Stock
    doc.rect(xPositions[4], yPosition, columnWidths[4], cellHeight);
    doc.text(String(producto.prod_stock), xPositions[4] + cellPadding, yPosition + cellHeight / 2 + 3);

    yPosition += cellHeight;
  });

  // Descargar el PDF
  doc.save("Reporte_Productos_AlturOS.pdf");
};
  // 🔹 Manejar cambios en el formulario de edición
  const handleChange = (e) => {
    setProductoEditado({
      ...productoEditado,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Enviar actualización del producto a la base de datos
  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `https://backendalturos.onrender.com/api/productos/producto/${productoEditado.prod_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prod_nom: productoEditado.prod_nom,
            prod_desc: productoEditado.prod_desc,
            prod_precio: productoEditado.prod_precio,
            prod_stock: productoEditado.prod_stock,
          }),
        }
      );

      if (!response.ok) throw new Error("❌ No se pudo actualizar el producto.");

      alert("✅ Producto actualizado correctamente");
      setProductoEditado(null);
      obtenerProductos(); // Recargar lista de productos
    } catch (error) {
      console.error("❌ Error al actualizar producto:", error);
    }
  };

  return (
    <div className="admin-container">
      <h1>📦 Gestión de Productos</h1>
      <p>Administra los productos en el sistema.</p>
      <button className="boton-volver-admin" onClick={() => navigate("/admin")}>
        Volver
      </button>
    <p></p>
      {error && <p className="error-message">{error}</p>}

      <button onClick={generarPDF} className="btn-pdf">
        <FaFilePdf /> Descargar Reporte de Productos
      </button>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length > 0 ? (
            productos.map((producto) => (
              <tr key={producto.prod_id}>
                {productoEditado && productoEditado.prod_id === producto.prod_id ? (
                  <>
                    <td>{producto.prod_id}</td>
                    <td>
                      <input
                        name="prod_nom"
                        value={productoEditado.prod_nom}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        name="prod_desc"
                        value={productoEditado.prod_desc}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        name="prod_precio"
                        type="number"
                        value={productoEditado.prod_precio}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        name="prod_stock"
                        type="number"
                        value={productoEditado.prod_stock}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <button className="edit-button" onClick={handleUpdate}>
                        Guardar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{producto.prod_id}</td>
                    <td>{producto.prod_nom}</td>
                    <td>{producto.prod_desc}</td>
                    <td>${producto.prod_precio}</td>
                    <td>{producto.prod_stock}</td>
                    <td>
                      <button className="edit-button" onClick={() => setProductoEditado(producto)}>
                        <FaEdit />
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => eliminarProducto(producto.prod_id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No hay productos registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
