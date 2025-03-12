import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Login/login.css";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { signInWithGoogle } from "./Firebase";
import logo from "../../assets/logo.png"; // Ruta del logo

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
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
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLogin();

        if (data.user.email === "2023371005@uteq.edu.mx") {
          navigate("/admin"); // 🔹 Redirige a admin si el Usuario es admin
        } else {
          navigate("/dashboard");
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

        // 🔹 Guardar Usuario en localStorage
        localStorage.setItem("user", JSON.stringify({ uid, email, displayName }));

        onLogin();
        
        if (email === "2023371005@uteq.edu.mx") {
          navigate("/admin"); // 🔹 Redirige a admin si el Usuario es admin
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

      <p onClick={handleRegisterRedirect} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>
        Registrate aquí
      </p>

      <button className="google-button" onClick={handleGoogleLogin}>
        <FaGoogle /> Iniciar sesión con Google
      </button>
    </div>
  );
}
