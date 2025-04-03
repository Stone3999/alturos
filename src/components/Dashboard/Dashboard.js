import React, { useState } from "react";
import { FaBars, FaShoppingCart } from "react-icons/fa";
import { MdHealthAndSafety } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import AlturOSImage from "../../assets/AlturOS.jpg"; // Imagen del dispositivo
import ElderlyImage from "../../assets/elderly.jpg"; // Imagen de los viejitos
import "./dashboard.css"; // Importamos los estilos

export default function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false); // Estado para mostrar/ocultar el menú

  // Función para redirigir a Producto.js al hacer clic en la imagen
  const handleImageClick = () => {
    navigate("/producto");
  };
  // Función para redirigir a Carrito.js
  const handleCartClick = () => {
    navigate("/carrito");
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      // Verificar que el usuario y el token están disponibles
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
  
      console.log("User:", user);  // Verifica si el usuario se obtiene correctamente
      console.log("Token:", token); // Verifica si el token se obtiene correctamente
  
      if (!user || !token) {
        console.error("❌ No se encontró la información del usuario o token");
        return;
      }
  
      const userId = user.id;
  
      // Hacer la solicitud POST para cerrar sesión y actualizar us_logged a 0
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Enviar el token
        },
        body: JSON.stringify({ userId }), // Enviar el userId
      });
  
      const result = await response.json();
  
      console.log("Logout result:", result);  // Verifica la respuesta del servidor
  
      if (response.ok) {
        console.log(result.message); // Mensaje del servidor
  
        // Eliminar los datos del usuario y token de localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("token");
  
        onLogout(); // Llamar a la función de cierre de sesión
        navigate("/"); // Redirigir al login
      } else {
        console.error(result.error); // Manejo de error
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  
  

  return (
    <div className="dashboard-container">
      {/* Barra superior */}
      <div className="dashboard-header">
        <h1>AlturOS</h1>
        <div className="icon-container">
          {/* Ícono del carrito */}
          <FaShoppingCart onClick={handleCartClick} style={{ cursor: "pointer" }} />

          {/* Ícono de menú (tres líneas) */}
          <div className="menu-icon" onClick={() => setShowMenu(!showMenu)}>
            <FaBars style={{ cursor: "pointer" }} />
            {/* Menú desplegable */}
            {showMenu && (
              <div className="dropdown-menu">
                <button onClick={handleLogout}>Cerrar Sesión</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sección de introducción */}
      <div className="dashboard-content">
        <div className="intro-section">
          {/* Texto introductorio */}
          <div className="intro-text-container">
            <h2>AlturOS: Seguridad y Cuidado Inteligente</h2>
            <p className="intro-text">
              Imagina que tienes un familiar mayor o una persona con movilidad reducida, y te preocupa que pueda sufrir una caída cuando no estás cerca.
              Las caídas pueden ser peligrosas, y muchas veces quienes las sufren no pueden pedir ayuda de inmediato.
            </p>
            <p className="intro-text">
              Para abordar este problema, estamos desarrollando <strong>AlturOS</strong>, un sistema inteligente diseñado para detectar caídas y enviar alertas automáticas
              a familiares o cuidadores en tiempo real. Nuestro objetivo es proporcionar seguridad sin comprometer la independencia de las personas que lo necesitan.
            </p>
          </div>

          {/* Imagen de los viejitos */}
          <div className="elderly-image-container">
            <img
              src={ElderlyImage} // Imagen de los viejitos
              alt="Personas mayores"
              className="elderly-image"
            />
          </div>
        </div>

        {/* Tarjetas informativas */}
        <div className="info-cards">
          <div className="card">
            <MdHealthAndSafety className="card-icon" />
            <h3>Seguridad en Tiempo Real</h3>
            <p>Detección instantánea de caídas y alertas automáticas.</p>
          </div>
          <div className="card">
            <FaBars className="card-icon" />
            <h3>Personalización Total</h3>
            <p>Configura alertas y contactos de emergencia fácilmente.</p>
          </div>
          <div className="card">
            <FaShoppingCart className="card-icon" />
            <h3>Notificaciones Inteligentes</h3>
            <p>Recibe alertas en tiempo real en tu dispositivo móvil.</p>
          </div>
        </div>

        {/* Imagen que redirige a Producto.js */}
        <div className="image-container" onClick={handleImageClick}>
          <img
            src={AlturOSImage} // Imagen del dispositivo AlturOS
            alt="Dispositivo AlturOS"
            className="clickable-image"
          />
          <p className="image-text">Haz clic en la imagen para conocer más detalles</p>
        </div>

        {/* Sección de Beneficios */}
        <div className="benefits-section">
          <h3>¿Cómo funciona?</h3>
          <ul>
            <li><strong>🔹 Detección de caídas:</strong> Sensores avanzados identifican movimientos bruscos y caídas.</li>
            <li><strong>📡 Conectividad inalámbrica:</strong> Se envían alertas automáticas al cuidador a través de la aplicación móvil.</li>
            <li><strong>📞 Notificación de emergencia:</strong> Si la persona no responde, se envía una alerta a un contacto de confianza.</li>
          </ul>

          <h3>Beneficios</h3>
          <p>
            <strong>AlturOS</strong> está diseñado para brindar tranquilidad tanto a los Usuarios como a sus familiares. Con su tecnología avanzada,
            puede mejorar la seguridad en el hogar y dar más independencia a las personas mayores o con movilidad reducida.
          </p>
        </div>
      </div>
    </div>
  );
}