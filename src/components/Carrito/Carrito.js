import React, { useEffect, useState } from "react";
import "./carrito.css"; // Asegúrate de que este archivo contiene los estilos correctos
import { FaPlus, FaMinus, FaTimesCircle } from "react-icons/fa";
import AlturOSImage from "../../assets/AlturOS.jpg"; // Imagen de respaldo en caso de error

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [iva, setIva] = useState(0);
  const [total, setTotal] = useState(0);

  const user = JSON.parse(localStorage.getItem("user")); // Obtener datos del Usuario logueado
  const userId = user?.id; // Extraer userId

  useEffect(() => {
    if (userId) {
      obtenerCarrito();
    }
  }, [userId]);

  // 🔹 Obtener productos del carrito
  const obtenerCarrito = async () => {
    if (!userId) {
      console.error("❌ No se encontró el userId en localStorage");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/carrito/${userId}`);

      if (!response.ok) {
        console.error(`❌ Error al obtener el carrito: ${response.status} ${response.statusText}`);
        return;
      }

      const data = await response.json();
      setCarrito(data);
      calcularTotales(data);
    } catch (error) {
      console.error("❌ Error de conexión con el servidor:", error);
    }
  };

  // 🔹 Aumentar cantidad (hasta el máximo stock disponible)
  const aumentarCantidad = async (prod_id, stock_actual, cantidad_actual) => {
    if (cantidad_actual >= stock_actual) {
      alert("⚠️ No puedes agregar más de lo que hay en stock.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/carrito/aumentar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, prod_id }),
      });

      if (response.ok) obtenerCarrito();
    } catch (error) {
      console.error("❌ Error aumentando cantidad:", error);
    }
  };

  // 🔹 Disminuir cantidad (no permitir menos de 1)
  const disminuirCantidad = async (prod_id, cantidad_actual) => {
    if (cantidad_actual <= 1) {
      return eliminarProducto(prod_id);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/carrito/disminuir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, prod_id }),
      });

      if (response.ok) obtenerCarrito();
    } catch (error) {
      console.error("❌ Error disminuyendo cantidad:", error);
    }
  };

  // 🔹 Eliminar producto del carrito
  const eliminarProducto = async (prod_id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/carrito/eliminar/${userId}/${prod_id}`, {
        method: "DELETE",
      });

      if (response.ok) obtenerCarrito();
    } catch (error) {
      console.error("❌ Error eliminando producto:", error);
    }
  };

  // 🔹 Calcular totales (Subtotal, IVA y Total)
  const calcularTotales = (productos) => {
    const subtotalCalculado = productos.reduce((acc, prod) => acc + prod.prod_precio * prod.car_cantidad, 0);
    const ivaCalculado = subtotalCalculado * 0.16; // 16% de IVA
    const totalCalculado = subtotalCalculado + ivaCalculado;

    setSubtotal(subtotalCalculado);
    setIva(ivaCalculado);
    setTotal(totalCalculado);
  };

  return (
    <div className="carrito-container">
      <h2>Carrito</h2>

      {carrito.length > 0 ? (
        carrito.map((item) => (
          <div key={item.prod_id} className="carrito-item">
            <img src={item.prod_img1 || AlturOSImage} alt={item.prod_nom} className="carrito-image" />
            <div className="carrito-details">
              <h3>{item.prod_nom}</h3>
              <div className="cantidad-container">
                <span>Cantidad</span>
                <button
                  className="cantidad-btn"
                  onClick={() => aumentarCantidad(item.prod_id, item.prod_stock, item.car_cantidad)}
                >
                  <FaPlus />
                </button>
                <span className="cantidad">{item.car_cantidad}</span>
                <button
                  className="cantidad-btn"
                  onClick={() => disminuirCantidad(item.prod_id, item.car_cantidad)}
                >
                  <FaMinus />
                </button>
              </div>
            </div>
            <button className="eliminar-producto" onClick={() => eliminarProducto(item.prod_id)}>
              <FaTimesCircle />
            </button>
            <span className="precio-total">${(item.prod_precio * item.car_cantidad).toFixed(2)}</span>
          </div>
        ))
      ) : (
        <p className="empty-cart">Tu carrito está vacío</p>
      )}

      {/* Totales */}
      <div className="totales">
        <p>Subtotal: <span>${subtotal.toFixed(2)}</span></p>
        <p>IVA (16%): <span>${iva.toFixed(2)}</span></p>
        <p><strong>Total:</strong> <span>${total.toFixed(2)}</span></p>
      </div>

      {/* Botón de pago */}
      <button className="pagar-btn">Pagar</button>
    </div>
  );
}
