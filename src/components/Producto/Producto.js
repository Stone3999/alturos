import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AlturOSImage from "../../assets/AlturOS.jpg";
import "./producto.css";

export default function Producto() {
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener el id del producto desde los parámetros de la URL
  const { id } = useParams();
  const productId = id || 1; // Si no hay ID en la URL, usar 1 como predeterminado

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Hacer la solicitud al backend usando el ID del producto
    fetch(`https://backendalturos.onrender.com/api/productos/${productId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Producto no encontrado");
        }
        return response.json();
      })
      .then((data) => {
        setProducto(data);
        setCurrentImage(data.prod_img1 || AlturOSImage);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error obteniendo el producto:", error);
        setError(error.message);
        setLoading(false);
        setProducto(null);
      });
  }, [productId]); // Recargar cuando cambie el ID del producto

  const changeImage = (img) => {
    setCurrentImage(img);
  };

  // Función para agregar al carrito
  const agregarAlCarrito = async () => {
    const storedUser = localStorage.getItem("user");
  
    if (!storedUser) {
      alert("⚠️ Debes iniciar sesión para agregar productos al carrito");
      return;
    }
  
    let us_id;
  
    try {
      const user = JSON.parse(storedUser);
      // Para usuarios normales: user.id
      // Para usuarios de Google: user.uid
      us_id = user.id || user.uid;
  
      if (!us_id) {
        alert("⚠️ No se pudo determinar el ID del usuario");
        return;
      }
    } catch (error) {
      console.error("❌ Error leyendo el usuario de localStorage:", error);
      alert("⚠️ Hubo un problema con tu sesión. Inicia sesión de nuevo.");
      return;
    }
  
    const car_cantidad = 1;
  
    try {
      const response = await fetch("https://backendalturos.onrender.com/api/carro/carrito", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          us_id,
          prod_id: producto.prod_id,
          car_cantidad
        }),
      });
  
      if (!response.ok) {
        throw new Error("❌ No se pudo agregar el producto al carrito");
      }
  
      alert("✅ Producto agregado al carrito");
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      setError(error.message);
    }
  };
  

  return (
    <div className="producto-container">
      <h1>Detalles del Producto</h1>

      <div className="producto-content">
        {loading ? (
          <p className="loading-text">Cargando información del producto...</p>
        ) : error ? (
          <p className="error-text">Error: {error}</p>
        ) : producto ? (
          <>
            <div className="producto-image-container">
              <img 
                src={currentImage || AlturOSImage} 
                alt={producto.prod_nom} 
                className="producto-main-image" 
              />
              <div className="producto-thumbnails">
                {producto.prod_img1 && (
                  <img
                    src={producto.prod_img1}
                    alt="Imagen 1"
                    className={currentImage === producto.prod_img1 ? "active" : ""}
                    onClick={() => changeImage(producto.prod_img1)}
                  />
                )}
                {producto.prod_img2 && (
                  <img
                    src={producto.prod_img2}
                    alt="Imagen 2"
                    className={currentImage === producto.prod_img2 ? "active" : ""}
                    onClick={() => changeImage(producto.prod_img2)}
                  />
                )}
                {producto.prod_img3 && (
                  <img
                    src={producto.prod_img3}
                    alt="Imagen 3"
                    className={currentImage === producto.prod_img3 ? "active" : ""}
                    onClick={() => changeImage(producto.prod_img3)}
                  />
                )}
                {producto.prod_img4 && (
                  <img
                    src={producto.prod_img4}
                    alt="Imagen 4"
                    className={currentImage === producto.prod_img4 ? "active" : ""}
                    onClick={() => changeImage(producto.prod_img4)}
                  />
                )}
              </div>
            </div>

            <div className="producto-info">
              <h2>{producto.prod_nom}</h2>
              <div className="producto-id">
                <span>ID Producto: {producto.prod_id}</span>
              </div>
              
              <div className="producto-price">
                <h3>
                  {/* Asegurándonos de que prod_precio sea un número antes de usar toFixed */}
                  ${Number(producto.prod_precio).toFixed(2)}
                </h3>
              </div>
              
              <div className="producto-stock">
                <span>Stock disponible: {producto.prod_stock}</span>
              </div>
              
              <div className="producto-description">
                <h4>Descripción:</h4>
                <p>{producto.prod_desc || "No hay descripción disponible"}</p>
              </div>

              <button onClick={agregarAlCarrito} className="add-to-cart-btn">Agregar al carrito</button>
              <button className="boton-volver-admin text-align-center" onClick={() => navigate("/admin")}>Volver</button>
            </div>
          </>
        ) : (
          <p className="producto-not-found">Producto no encontrado</p>
        )}
      </div>
    </div>
  );
}
