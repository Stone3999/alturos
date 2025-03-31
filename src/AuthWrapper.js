import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function AuthWrapper({ isAuthenticated, isAdmin, isCheckingSession }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isCheckingSession) return; // Espera a que termine la verificación de sesión

    if (isAuthenticated) {
      if (location.pathname === "/") {
        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
    } else if (location.pathname !== "/") {
      navigate("/"); // Si no estamos autenticados y no estamos en el login, redirigimos
    }
  }, [isAuthenticated, isAdmin, isCheckingSession, location.pathname, navigate]);

  return null;
}

export default AuthWrapper;
