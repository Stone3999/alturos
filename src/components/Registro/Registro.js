import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Registro/registro.css";

export default function Registro() {
  const [form, setForm] = useState({
    us_tipo: "",
    us_nomb: "",
    us_apep: "",
    us_apem: "",
    us_mail: "",
    us_pass: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Registro exitoso");
        navigate("/login");
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("❌ Error de conexión con el servidor");
    }
  };

  return (
    <div className="registro-container">
      <h2>Registro</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Tipo de Usuario</label>
        <select name="us_tipo" onChange={handleChange} required>
          <option value="">Selecciona un tipo de Usuario</option>
          <option value="0">Cuidador</option>
          <option value="1">Supervisado</option>
        </select>
        <input type="text" name="us_nomb" placeholder="Nombre" onChange={handleChange} required />
        <input type="text" name="us_apep" placeholder="Apellido Paterno" onChange={handleChange} required />
        <input type="text" name="us_apem" placeholder="Apellido Materno" onChange={handleChange} />
        <input type="email" name="us_mail" placeholder="Correo" onChange={handleChange} required />
        <input type="password" name="us_pass" placeholder="Contraseña" onChange={handleChange} required />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}
