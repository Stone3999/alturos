import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import AdminPanel from "./components/Admin/AdminPanel";
import Dispositivos from "./components/Admin/Dispositivos";
import Graficas from "./components/Admin/Graficas";
import Historial from "./components/Admin/Historial";
import Productos from "./components/Admin/Productos";
import Usuarios from "./components/Admin/Usuarios";
import Ventas from "./components/Admin/Ventas";
import Carrito from "./components/Carrito/Carrito";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/Login";
import Producto from "./components/Producto/Producto";
import Registro from "./components/Registro/Registro";

import { useNavigate } from "react-router-dom";
import AuthWrapper from "./AuthWrapper";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (token) {
      setIsAuthenticated(true);
      if (user?.email === "2023371005@uteq.edu.mx") {
        setIsAdmin(true);
      }
    }
  
    setIsCheckingSession(false); // ✅ Ya terminamos de revisar
  }, []);

  const navigate = useNavigate();

  const handleLogin = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    setIsAuthenticated(true);
    if (user?.email === "2023371005@uteq.edu.mx") {
      setIsAdmin(true);
      navigate("/admin");
    } else {
      navigate("/dashboard");
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
    <>
      <AuthWrapper
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        isCheckingSession={isCheckingSession}
      />

      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas protegidas para Usuarios */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated && !isAdmin ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/carrito"
          element={
            isAuthenticated && !isAdmin ? <Carrito /> : <Navigate to="/" />
          }
        />
        <Route
          path="/producto"
          element={
            isAuthenticated && !isAdmin ? <Producto /> : <Navigate to="/" />
          }
        />

        {/* Rutas protegidas para Admin */}
        <Route
          path="/admin"
          element={
            isAuthenticated && isAdmin ? <AdminPanel onLogout={handleLogout}/> : <Navigate to="/" />
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            isAuthenticated && isAdmin ? <Usuarios /> : <Navigate to="/" />
          }
        />
        <Route
          path="/admin/productos"
          element={
            isAuthenticated && isAdmin ? <Productos /> : <Navigate to="/" />
          }
        />
        <Route
          path="/admin/dispositivos"
          element={
            isAuthenticated && isAdmin ? (
              <Dispositivos />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/ventas"
          element={
            isAuthenticated && isAdmin ? <Ventas /> : <Navigate to="/" />
          }
        />
        <Route path="/admin/historial" element={<Historial />} />
        <Route path="/admin/graficas" element={<Graficas />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

// App envuelto con Router
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
