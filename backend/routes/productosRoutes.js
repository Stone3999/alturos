const express = require("express");
const router = express.Router();
const db = require("../database");  // Asegúrate de que el archivo de base de datos esté bien configurado

// Ruta para obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const query = "SELECT * FROM vista_productos"; // Cambia 'vista_productos_admin' si es necesario
    const [productos] = await db.promise().query(query);
    res.json(productos);
  } catch (error) {
    console.error("Error obteniendo productos:", error.message);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});



// Ruta para obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const query = "SELECT * FROM vista_productos_admin"; // Cambia 'vista_productos_admin' si es necesario
    const [productos] = await db.promise().query(query);
    res.json(productos);
  } catch (error) {
    console.error("Error obteniendo productos:", error.message);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});


// Ruta para obtener todos los productos desde la vista vista_productos
router.get("/", async (req, res) => {
  try {
    const query = "SELECT * FROM vista_productos";  // Usamos la vista para obtener los productos
    const [productos] = await db.promise().query(query);  // Ejecutamos la consulta
    res.json(productos);  // Enviamos los resultados como respuesta
  } catch (error) {
    console.error("Error obteniendo productos:", error.message);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Ruta para obtener un producto específico por su ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = "SELECT * FROM vista_productos WHERE prod_id = ?";
    const [producto] = await db.promise().query(query, [id]);

    if (producto.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(producto[0]);  // Enviamos los datos del producto
  } catch (error) {
    console.error("Error obteniendo el producto:", error.message);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

// Ruta para agregar un producto al carrito
router.post("/carrito", async (req, res) => {
  const { us_id, prod_id, car_cantidad } = req.body;

  try {
    const query = `
      INSERT INTO Carrito (us_id, prod_id, car_cantidad)
      VALUES (?, ?, ?)
    `;
    await db.promise().query(query, [us_id, prod_id, car_cantidad]);
    res.status(201).json({ message: "Producto agregado al carrito correctamente" });
  } catch (error) {
    console.error("Error al agregar al carrito:", error.message);
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
});





module.exports = router;