import React, { useEffect, useState } from "react";
import "./AdminPanel.css"; // Usamos los mismos estilos
import { FaTrash, FaUserEdit } from "react-icons/fa";

export default function Usuarios() {
  const [Usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // 🔹 Obtener Usuarios desde la API
  const obtenerUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/Usuarios");

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

  // 🔹 Eliminar Usuario
  const eliminarUsuario = async (id_us) => {
    if (!window.confirm("¿Estás seguro de eliminar este Usuario?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/auth/Usuarios/${id_us}`, {
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

  // 🔹 Cambiar rol de Usuario
  const cambiarRol = async (id_us, nuevoRol) => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/Usuario`, {
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

  return (
    <div className="admin-container">
      <h1>👤 Gestión de Usuarios</h1>
      <p>Administra los Usuarios y sus permisos en el sistema.</p>

      {error && <p className="error-message">{error}</p>}

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
