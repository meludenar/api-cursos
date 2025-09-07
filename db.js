// db.js
const sqlite3 = require("sqlite3").verbose();

// Conectar a la base de datos (se crea si no existe)
const db = new sqlite3.Database("cursos.sqlite", (err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err.message);
  } else {
    console.log("Conectado a la base de datos SQLite.");
  }
});

// Crear tabla cursos
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS cursos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      creditos INTEGER
    )
  `, (err) => {
    if (err) {
      console.error("Error al crear la tabla:", err.message);
    } else {
      console.log("Tabla cursos creada con éxito.");
    }
  });
});

// Cerrar conexión (opcional si solo se usa para crear la tabla)
db.close((err) => {
  if (err) {
    console.error("Error al cerrar la base de datos:", err.message);
  } else {
    console.log("Conexión cerrada.");
  }
});
