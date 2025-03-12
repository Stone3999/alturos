import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login/Login";
import Registro from "./components/Registro/Registro";
import Dashboard from "./components/Dashboard/Dashboard";
import Carrito from "./components/Carrito/Carrito";
import Producto from "./components/Producto/Producto";
import AdminPanel from "./components/Admin/AdminPanel";
import Usuarios from "./components/Admin/Usuarios";
import Productos from "./components/Admin/Productos";
import Dispositivos from "./components/Admin/Dispositivos";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token) {
      setIsAuthenticated(true);
      if (user?.email === "2023371005@uteq.edu.mx") {
        setIsAdmin(true);
      }
    }
  }, []);

  const handleLogin = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    setIsAuthenticated(true);
    if (user?.email === "2023371005@uteq.edu.mx") {
      setIsAdmin(true);
      navigate("/admin"); // 🔹 Redirigir a panel de administrador
    } else {
      navigate("/dashboard"); // 🔹 Redirigir a Usuario normal
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate("/");
  };

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={handleLogin} />} />
      <Route path="/registro" element={<Registro />} />

      {/* 🔹 Rutas protegidas para Usuarios normales */}
      <Route
        path="/dashboard"
        element={isAuthenticated && !isAdmin ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" />}
      />
      <Route path="/carrito" element={isAuthenticated && !isAdmin ? <Carrito /> : <Navigate to="/" />} />
      <Route path="/producto" element={isAuthenticated && !isAdmin ? <Producto /> : <Navigate to="/" />} />

      {/* 🔹 Rutas protegidas para administradores */}
      <Route path="/admin" element={isAuthenticated && isAdmin ? <AdminPanel /> : <Navigate to="/" />} />
      <Route path="/admin/Usuarios" element={isAuthenticated && isAdmin ? <Usuarios /> : <Navigate to="/" />} />
      <Route path="/admin/productos" element={isAuthenticated && isAdmin ? <Productos /> : <Navigate to="/" />} />
      <Route path="/admin/dispositivos" element={isAuthenticated && isAdmin ? <Dispositivos /> : <Navigate to="/" />} />

      {/* Redirigir cualquier ruta no encontrada al login */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

// Envolver App con Router
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
