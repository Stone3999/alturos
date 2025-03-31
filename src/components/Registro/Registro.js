import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Registro/registro.css";

// Constantes y utilidades
const TIPO_USUARIO = {
  CUIDADOR: "0",
  SUPERVISADO: "1"
};

const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{8,}$/;
const API_URL = "http://localhost:5000/api/auth/register";

export default function Registro() {
  const initialFormState = {
    us_tipo: "",
    us_nomb: "",
    us_apep: "",
    us_apem: "",
    us_mail: "",
    us_pass: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Validación en tiempo real
    if (name === "us_pass") {
      validatePasswordField(value);
    } else if (name === "us_mail") {
      validateEmailField(value);
    }
  };

  // Validaciones
  const validatePasswordField = (password) => {
    if (!password) {
      setErrors(prev => ({ ...prev, us_pass: "La contraseña es obligatoria" }));
      return false;
    } else if (!PASSWORD_REGEX.test(password)) {
      setErrors(prev => ({ 
        ...prev, 
        us_pass: "La contraseña debe tener al menos 8 caracteres, 1 número y 1 carácter especial" 
      }));
      return false;
    } else {
      setErrors(prev => ({ ...prev, us_pass: "" }));
      return true;
    }
  };

  const validateEmailField = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrors(prev => ({ ...prev, us_mail: "El correo es obligatorio" }));
      return false;
    } else if (!emailRegex.test(email)) {
      setErrors(prev => ({ ...prev, us_mail: "Formato de correo inválido" }));
      return false;
    } else {
      setErrors(prev => ({ ...prev, us_mail: "" }));
      return true;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar campos requeridos
    if (!form.us_tipo) newErrors.us_tipo = "Seleccione un tipo de usuario";
    if (!form.us_nomb) newErrors.us_nomb = "El nombre es obligatorio";
    if (!form.us_apep) newErrors.us_apep = "El apellido paterno es obligatorio";
    
    // Validar correo y contraseña
    if (!validateEmailField(form.us_mail)) newErrors.us_mail = errors.us_mail || "El correo es inválido";
    if (!validatePasswordField(form.us_pass)) newErrors.us_pass = errors.us_pass || "La contraseña es inválida";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(API_URL, {
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
        setErrors(prev => ({ ...prev, general: data.error || "❌ Error al registrar usuario" }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, general: "❌ Error de conexión con el servidor" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="registro-container">
      <h2>Registro de Usuario</h2>
      
      {errors.general && <p className="error">{errors.general}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="us_tipo">Tipo de Usuario</label>
          <select 
            id="us_tipo"
            name="us_tipo" 
            value={form.us_tipo}
            onChange={handleChange} 
            className={errors.us_tipo ? "error-input" : ""}
          >
            <option value="">Selecciona un tipo de Usuario</option>
            <option value={TIPO_USUARIO.CUIDADOR}>Cuidador</option>
            <option value={TIPO_USUARIO.SUPERVISADO}>Supervisado</option>
          </select>
          {errors.us_tipo && <span className="error-text">{errors.us_tipo}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="us_nomb">Nombre</label>
          <input
            id="us_nomb"
            type="text"
            name="us_nomb"
            value={form.us_nomb}
            placeholder="Nombre"
            onChange={handleChange}
            className={errors.us_nomb ? "error-input" : ""}
          />
          {errors.us_nomb && <span className="error-text">{errors.us_nomb}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="us_apep">Apellido Paterno</label>
          <input
            id="us_apep"
            type="text"
            name="us_apep"
            value={form.us_apep}
            placeholder="Apellido Paterno"
            onChange={handleChange}
            className={errors.us_apep ? "error-input" : ""}
          />
          {errors.us_apep && <span className="error-text">{errors.us_apep}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="us_apem">Apellido Materno (Opcional)</label>
          <input
            id="us_apem"
            type="text"
            name="us_apem"
            value={form.us_apem}
            placeholder="Apellido Materno"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="us_mail">Correo Electrónico</label>
          <input
            id="us_mail"
            type="email"
            name="us_mail"
            value={form.us_mail}
            placeholder="ejemplo@correo.com"
            onChange={handleChange}
            className={errors.us_mail ? "error-input" : ""}
          />
          {errors.us_mail && <span className="error-text">{errors.us_mail}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="us_pass">Contraseña</label>
          <input
            id="us_pass"
            type="password"
            name="us_pass"
            value={form.us_pass}
            placeholder="Contraseña"
            onChange={handleChange}
            className={errors.us_pass ? "error-input" : ""}
          />
          {errors.us_pass && <span className="error-text">{errors.us_pass}</span>}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? "Registrando..." : "Registrarse"}
        </button>
      </form>
      ¿Ya tienes una cuenta?
      <p onClick={handleLoginRedirect} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>
        Inicia sesión
      </p>
    </div>
  );
}