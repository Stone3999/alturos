const mysql = require("mysql2");

// Configurar la conexión a MySQL
const db = mysql.createConnection({
  host: 'sql3.freesqldatabase.com',
  user: 'sql3767184',
  password: 'ZCNm4KR2mH',
  database: 'sql3767184',
  port: 3306,
  connectTimeout: 20000 // Aumentar el tiempo de espera
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error("❌ Error conectando a la base de datos:", err);
    return;
  }
  console.log("✅ Conectado a la base de datos MySQL");
});

module.exports = db;
