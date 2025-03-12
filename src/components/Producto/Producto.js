import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBars } from "react-icons/fa";
import "./producto.css"; // Importamos los estilos
import AlturOSImage from "../../assets/AlturOS.jpg"; // Imagen por defecto en caso de error

export default function Producto() {
  const [producto, setProducto] = useState(null);
  const [currentImage, setCurrentImage] = useState(AlturOSImage); // Imagen actual
  const [carritoMensaje, setCarritoMensaje] = useState(""); // Mensaje de confirmación
  const navigate = useNavigate();

  // 🔹 Simulación de obtener el ID del Usuario desde localStorage o autenticación
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    console.log("🔍 Enviando solicitud para obtener el producto...");

    fetch("http://localhost:5000/api/auth/producto/1") // Asegúrate de que este endpoint es correcto
      .then(response => {
        console.log("🔍 Respuesta del servidor:", response);

        if (!response.ok) {
          throw new Error(`❌ Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("✅ Producto recibido:", data);

        if (!data || Object.keys(data).length === 0) {
          console.error("❌ Error: Producto vacío o no válido.");
          return;
        }

        setProducto(data);
        setCurrentImage(data.prod_img1 || AlturOSImage);
      })
      .catch(error => {
        console.error("❌ Error obteniendo el producto:", error);
      });
  }, []);

  // 🔹 Manejar el cambio de imagen
  const changeImage = (img) => {
    setCurrentImage(img);
  };

  // 🔹 Función para agregar al carrito
  const agregarAlCarrito = async () => {
    if (!userId) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      return;
    }

    try {
      console.log("🛒 Agregando al carrito...", { userId, prod_id: producto.prod_id });

      const response = await fetch("http://localhost:5000/api/auth/carrito/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, prod_id: producto.prod_id }),
      });

      const data = await response.json();
      console.log("🛒 Respuesta del carrito:", data);

      if (response.ok) {
        setCarritoMensaje("✅ Producto agregado al carrito");
      } else {
        setCarritoMensaje("⚠️ " + data.error);
      }
    } catch (error) {
      console.error("❌ Error agregando al carrito:", error);
      setCarritoMensaje("❌ Error en la conexión con el servidor");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Barra superior */}
      <div className="dashboard-header">
        <h1>Detalles del Producto</h1>
        <div className="icon-container">
          {/* 🔹 Redirigir al carrito al hacer clic */}
          <FaShoppingCart className="cart-icon" onClick={() => navigate("/carrito")} />
          <FaBars />
        </div>
      </div>

      {/* Contenido del producto */}
      <div className="producto-content">
        {producto ? (
          <>
            <h2>✅ Producto cargado: {producto.prod_nom}</h2> {/* 🔹 Agregado para depuración */}
            {/* Imagen del producto */}
            <div className="producto-image-container">
              <img src={currentImage} alt={producto.prod_nom} className="producto-main-image" />
              {/* Miniaturas de imágenes */}
              <div className="producto-thumbnails">
                {producto.prod_img1 && <img src={producto.prod_img1} alt="Img 1" onClick={() => changeImage(producto.prod_img1)} />}
                {producto.prod_img2 && <img src={producto.prod_img2} alt="Img 2" onClick={() => changeImage(producto.prod_img2)} />}
                {producto.prod_img3 && <img src={producto.prod_img3} alt="Img 3" onClick={() => changeImage(producto.prod_img3)} />}
                {producto.prod_img4 && <img src={producto.prod_img4} alt="Img 4" onClick={() => changeImage(producto.prod_img4)} />}
              </div>
            </div>

            {/* Detalles del producto */}
            <div className="producto-info">
              <h2>{producto.prod_nom}</h2>
              <p className="producto-description">{producto.prod_desc}</p>
              <p className="producto-price">Precio: <strong>${producto.prod_precio}</strong></p>
              <p className="producto-stock">Stock disponible: <strong>{producto.prod_stock}</strong></p>
              
              {/* Botón para agregar al carrito */}
              <button className="add-to-cart" onClick={agregarAlCarrito}>
                Agregar al carrito
              </button>

              {/* Mostrar mensaje si el producto se agregó al carrito */}
              {carritoMensaje && <p className="carrito-mensaje">{carritoMensaje}</p>}
            </div>
          </>
        ) : (
          <p className="loading-text">Cargando información del producto...</p>
        )}
      </div>
    </div>
  );
}
