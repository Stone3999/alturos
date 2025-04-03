import React, { useCallback, useEffect, useState } from "react";
import { FaMinus, FaPlus, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import AlturOSImage from "../../assets/AlturOS.jpg";
import "./carrito.css";

export default function Carrito() {
  const navigate = useNavigate();

  const [carrito, setCarrito] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [iva, setIva] = useState(0);
  const [total, setTotal] = useState(0);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [saldoUsuario, setSaldoUsuario] = useState(null); // NUEVO

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id ?? user?.uid;

  const obtenerSaldoUsuario = async () => {
    try {
      console.log("🔍 Consultando saldo de userId:", userId);
      const res = await fetch("https://backendalturos.onrender.com/api/carro/saldo", {
        method: "POST", // Cambié a POST
        headers: {
          "Content-Type": "application/json", // Asegúrate de enviar los datos como JSON
        },
        body: JSON.stringify({ us_id: userId }), // Pasando us_id en el cuerpo
      });
      const data = await res.json();
      if (res.ok) {
        setSaldoUsuario(data.saldo); // Aquí se obtiene el saldo del backend
        console.log("💰 Saldo actual:", data.saldo);
      } else {
        console.error(data.message || "Error desconocido");
      }
    } catch (err) {
      console.error("❌ Error obteniendo saldo:", err);
    }
  };
  


  const obtenerCarrito = useCallback(async () => {
    if (!userId) {
      console.error("❌ No se encontró el userId en localStorage");
      return;
    }

    try {
      const response = await fetch(`https://backendalturos.onrender.com/api/carro/${userId}`);

      if (!response.ok) {
        if (response.status === 404) {
          setCarrito([]);
          calcularTotales([]);
          return;
        }
        throw new Error('Error: ${response.status}');
      }

      const data = await response.json();
      setCarrito(data.productos || []);
      calcularTotales(data.productos || []);
    } catch (error) {
      console.error("❌ Error de conexión con el servidor:", error);
      setCarrito([]);
    }
  }, [userId]);

  useEffect(() => {
    if (userId !== undefined && userId !== null) {
      obtenerCarrito();
      obtenerSaldoUsuario(); // NUEVO
    }
  }, [userId, obtenerCarrito]);

  const aumentarCantidad = async (prod_id, stock_actual, cantidad_actual) => {
    if (cantidad_actual >= stock_actual) {
      alert("⚠ No puedes agregar más de lo que hay en stock.");
      return;
    }

    try {
      const response = await fetch('https://backendalturos.onrender.com/api/carro/agregar', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ us_id: userId, prod_id, car_cantidad: 1 }),
      });

      if (response.ok) {
        obtenerCarrito();
        obtenerSaldoUsuario(); // si deseas que se actualice al cambiar cantidades
      }
    } catch (error) {
      console.error("❌ Error aumentando cantidad:", error);
    }
  };

  const disminuirCantidad = async (prod_id, cantidad_actual) => {
    if (cantidad_actual <= 1) {
      return eliminarProducto(prod_id);
    }

    try {
      const response = await fetch('https://backendalturos.onrender.com/api/carro/disminuir', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ us_id: userId, prod_id }),
      });

      if (response.ok) {
        obtenerCarrito();
        obtenerSaldoUsuario();
      }
    } catch (error) {
      console.error("❌ Error disminuyendo cantidad:", error);
    }
  };

  const eliminarProducto = async (prod_id) => {
    try {
      const response = await fetch('https://backendalturos.onrender.com/api/carro/eliminar/${userId}/${prod_id}', {
        method: "DELETE",
      });

      if (response.ok) obtenerCarrito();
    } catch (error) {
      console.error("❌ Error eliminando producto:", error);
    }
  };

  const calcularTotales = (productos) => {
    const totalCalculado = productos.reduce((acc, prod) => acc + prod.prod_precio * prod.car_cantidad, 0);
    const subtotalCalculado = totalCalculado * 0.84;
    const ivaCalculado = totalCalculado * 0.16;
  
    setSubtotal(subtotalCalculado);
    setIva(ivaCalculado);
    setTotal(totalCalculado);
  };
  

  const procesarPago = async () => {
    if (carrito.length === 0) {
      alert("⚠ No hay productos en el carrito.");
      return;
    }
  
    setProcesandoPago(true);
  
    try {
      const response = await fetch("https://backendalturos.onrender.com/api/carro/pagar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ us_id: userId }),
      });
  
      const result = await response.json(); // Asegúrate de que la respuesta sea JSON
  
      if (!response.ok) {
        alert(result.error || "❌ Error al procesar el pago");
        setProcesandoPago(false);
        return;
      }
  
      alert(result.message || "✅ Compra realizada con éxito");
  
      setCarrito([]);
      setSubtotal(0);
      setIva(0);
      setTotal(0);
      setProcesandoPago(false);
  
      await obtenerSaldoUsuario(); // NUEVO
    } catch (error) {
      console.error("❌ Error al procesar el pago:", error);
      alert("❌ Error al procesar el pago");
      setProcesandoPago(false);
    }
  };
  

  return (
    <div className="carrito-container">
      <div className="info-usuario">
        <h2>Carrito</h2>
        {saldoUsuario !== null && (
          <p className="saldo-usuario">
          💰 Saldo disponible: ${Number(saldoUsuario).toFixed(2)}
        </p>
        )}
      </div>

      {carrito.length > 0 ? (
        carrito.map((item) => (
          <div key={item.prod_id} className="carrito-item">
            <img src={item.prod_img1 || AlturOSImage} alt={item.prod_nom} className="carrito-image" />
            <div className="carrito-details">
              <h3>{item.prod_nom}</h3>
              <div className="cantidad-container">
                <span>Cantidad</span>
                <button className="cantidad-btn" onClick={() => aumentarCantidad(item.prod_id, item.prod_stock, item.car_cantidad)}>
                  <FaPlus />
                </button>
                <span className="cantidad">{item.car_cantidad}</span>
                <button className="cantidad-btn" onClick={() => disminuirCantidad(item.prod_id, item.car_cantidad)}>
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

      <div className="totales">
        <p>Subtotal: <span>${subtotal.toFixed(2)}</span></p>
        <p>IVA (16%): <span>${iva.toFixed(2)}</span></p>
        <p><strong>Total:</strong> <span>${total.toFixed(2)}</span></p>
      </div>

      {procesandoPago ? (
        <p className="procesando-text">Procesando compra...</p>
      ) : (
        <button className="pagar-btn" onClick={procesarPago}>Pagar</button>
      )}

      <button className="boton-volver-admin" onClick={() => navigate("/admin")}>Volver</button>
    </div>
  );
}