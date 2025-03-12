const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../database");

const router = express.Router();

// 🔹 REGISTRO DE USUARIO
router.post("/register", async (req, res) => {
  const { us_tipo, us_nomb, us_apep, us_apem, us_mail, us_pass } = req.body;

  if (!us_tipo || !us_nomb || !us_apep || !us_mail || !us_pass) {
    return res.status(400).json({ error: "❌ Todos los campos son obligatorios" });
  }

  try {
    const [existingUsers] = await db.promise().query("SELECT * FROM usuario WHERE us_mail = ?", [us_mail]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "❌ El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(us_pass, 10);
    const insertUserQuery = `
      INSERT INTO usuario (us_tipo, us_status, us_nomb, us_apep, us_apem, us_mail, us_pass, us_logged) 
      VALUES (?, 1, ?, ?, ?, ?, ?, 0)
    `;

    await db.promise().query(insertUserQuery, [us_tipo, us_nomb, us_apep, us_apem, us_mail, hashedPassword]);

    res.status(201).json({ message: "✅ Usuario registrado correctamente" });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "❌ Error interno del servidor" });
  }
});

// 🔹 LOGIN DE USUARIO
router.post("/login", async (req, res) => {
  const { us_mail, us_pass } = req.body;

  if (!us_mail || !us_pass) {
    return res.status(400).json({ error: "❌ Correo y contraseña son obligatorios" });
  }

  try {
    const [results] = await db.promise().query("SELECT * FROM usuario WHERE us_mail = ?", [us_mail]);

    if (results.length === 0) {
      return res.status(400).json({ error: "❌ Usuario no encontrado" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(us_pass, user.us_pass);

    if (!isMatch) {
      return res.status(400).json({ error: "❌ Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id_us, email: user.us_mail, tipo: user.us_tipo },
      "secreto_super_seguro",
      { expiresIn: "2h" }
    );

    res.json({
      message: "✅ Inicio de sesión exitoso",
      token,
      user: {
        id: user.id_us,
        nombre: user.us_nomb,
        apellido: user.us_apep,
        email: user.us_mail,
        tipo: user.us_tipo,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "❌ Error interno del servidor" });
  }
});

// 🔹 OBTENER LISTA DE USUARIOS
router.get("/usuarios", async (req, res) => {
  try {
    const [results] = await db.promise().query("SELECT id_us, us_nomb, us_apep, us_mail, us_tipo FROM usuario");
    res.json(results);
  } catch (error) {
    console.error("❌ Error obteniendo usuarios:", error);
    res.status(500).json({ error: "❌ Error en el servidor" });
  }
});

// 🔹 ELIMINAR USUARIO
router.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    await db.promise().query("DELETE FROM usuario WHERE id_us = ?", [id]);
    res.json({ message: "✅ Usuario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error eliminando usuario:", error);
    res.status(500).json({ error: "❌ Error en el servidor" });
  }
});

// 🔹 CAMBIAR ROL DE USUARIO
router.put("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const { us_tipo } = req.body;

  if (!["0", "1"].includes(us_tipo)) {
    return res.status(400).json({ error: "❌ Rol no válido" });
  }

  try {
    await db.promise().query("UPDATE usuario SET us_tipo = ? WHERE id_us = ?", [us_tipo, id]);
    res.json({ message: "✅ Rol actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error cambiando el rol:", error);
    res.status(500).json({ error: "❌ Error en el servidor" });
  }
});

// 🔹 OBTENER UN PRODUCTO POR ID
router.get("/producto/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await db.promise().query("SELECT * FROM producto WHERE prod_id = ?", [id]);

    if (results.length === 0) {
      return res.status(404).json({ error: "❌ Producto no encontrado" });
    }

    console.log("✅ Producto obtenido:", results[0]); // 🔹 LOG PARA DEBUG

    res.json(results[0]);
  } catch (error) {
    console.error("❌ Error obteniendo producto:", error);
    res.status(500).json({ error: "❌ Error en el servidor" });
  }
});


// 🔹 OBTENER CARRITO DEL USUARIO
router.get("/carrito/:userId", async (req, res) => {
  const { userId } = req.params;
  
  try {
    const query = `
      SELECT c.car_id, c.prod_id, c.car_cantidad, 
             p.prod_nom, p.prod_precio, p.prod_img1, p.prod_stock
      FROM carrito c 
      JOIN producto p ON c.prod_id = p.prod_id 
      WHERE c.us_id = ?
    `;

    const [results] = await db.promise().query(query, [userId]);
    res.json(results);
  } catch (error) {
    console.error("❌ Error obteniendo el carrito:", error);
    res.status(500).json({ error: "❌ Error en el servidor" });
  }
});

// 🔹 AGREGAR PRODUCTO AL CARRITO
router.post("/carrito/agregar", async (req, res) => {
  const { userId, prod_id } = req.body;

  if (!userId || !prod_id) {
    return res.status(400).json({ error: "❌ Usuario y producto son obligatorios" });
  }

  try {
    const checkQuery = "SELECT * FROM carrito WHERE us_id = ? AND prod_id = ?";
    const [results] = await db.promise().query(checkQuery, [userId, prod_id]);

    if (results.length > 0) {
      return res.status(400).json({ error: "⚠️ Este producto ya está en el carrito" });
    }

    const insertQuery = "INSERT INTO carrito (us_id, prod_id, car_cantidad) VALUES (?, ?, 1)";
    await db.promise().query(insertQuery, [userId, prod_id]);

    res.status(201).json({ message: "✅ Producto agregado al carrito" });
  } catch (error) {
    console.error("❌ Error al agregar producto al carrito:", error);
    res.status(500).json({ error: "❌ No se pudo agregar el producto" });
  }
});

// 🔹 ELIMINAR PRODUCTO DEL CARRITO
router.delete("/carrito/eliminar/:userId/:prod_id", async (req, res) => {
  const { userId, prod_id } = req.params;

  try {
    const query = "DELETE FROM carrito WHERE us_id = ? AND prod_id = ?";
    await db.promise().query(query, [userId, prod_id]);

    res.json({ message: "✅ Producto eliminado del carrito" });
  } catch (error) {
    console.error("❌ Error eliminando producto del carrito:", error);
    res.status(500).json({ error: "❌ Error en el servidor" });
  }
});

module.exports = router;
