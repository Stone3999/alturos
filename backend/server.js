const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Importar rutas
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Ruta de prueba para verificar si el servidor está funcionando
app.get("/", (req, res) => {
  res.send("🚀 Servidor funcionando correctamente");
});

// Iniciar servidor en el puerto 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
