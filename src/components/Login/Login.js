import { useState } from "react";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png"; // Ruta del logo
import "../Login/login.css";
import { signInWithGoogle } from "./Firebase";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    try {
      // Hacemos la solicitud al backend para el login
      const response = await fetch("https://backendalturos.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ us_mail: email, us_pass: password }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        setError("❌ Error inesperado del servidor");
        return;
      }

      if (response.ok) {
        // Guardamos el token y el usuario en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLogin(); // Llamamos a la función onLogin si la autenticación es exitosa

        // Redirigir según el tipo de usuario
        if (data.user.email === "2023371005@uteq.edu.mx") {
          navigate("/admin"); // Redirige a admin si el usuario es admin
        } else {
          navigate("/dashboard"); // Redirige al dashboard si el usuario no es admin
        }
      } else {
        setError(data.error || "❌ Error al iniciar sesión");
      }
    } catch (error) {
      setError("❌ Error de conexión con el servidor");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();

      if (user) {
        const { email, displayName, uid } = user;

        // Guardar usuario en localStorage
        localStorage.setItem("user", JSON.stringify({ uid, email, displayName }));

        onLogin(); // Llamamos a la función onLogin si Google login es exitoso
        
        // Redirigir según el tipo de usuario
        if (email === "2023371005@uteq.edu.mx") {
          navigate("/admin"); // Redirige a admin si el Usuario es admin
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      setError("❌ Error con Google Sign-In");
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/registro");
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Logo" className="logo" />
      <h2>INICIO DE SESIÓN</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <label>CORREO ELECTRONICO</label>
        <input
          type="email"
          placeholder="CORREO ELECTRONICO"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>CONTRASEÑA</label>
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="CONTRASEÑA"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <button type="submit">INICIAR SESIÓN</button>
      </form>
      <button className="google-button" onClick={handleGoogleLogin}>
        <FaGoogle /> Iniciar sesión con Google
      </button>
      <p> </p>

      ¿Aún no tienes una cuenta?
      <p onClick={handleRegisterRedirect} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>
        Registrate aquí
      </p>

      
    </div>
  );
}
