import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function AuthWrapper({ isAuthenticated, isAdmin, isCheckingSession }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isCheckingSession) return; // Espera a que termine la verificación de sesión

    // Si estamos autenticados, redirige según el rol
    if (isAuthenticated) {
      if (location.pathname === "/") {
        // Si estamos en la página de login y estamos autenticados, redirigimos según el rol
        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
    } else if (location.pathname !== "/" && location.pathname !== "/registro") {
      // Si no estamos autenticados y no estamos en el login o registro, redirigimos al login
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, isCheckingSession, location.pathname, navigate]);

  return null;
}

export default AuthWrapper;
