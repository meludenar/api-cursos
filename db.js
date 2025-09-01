// Importar librería sqlite3
const sqlite3 = require('sqlite3').verbose();

// Crear/conectar base de datos (cursos.sqlite)
const db = new sqlite3.Database('cursos.sqlite', (err) => {
  if (err) {
    console.error('Error al abrir la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
  }
});

// Crear tabla CURSOS si no existe
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS cursos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      creditos INTEGER NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error("Error creando la tabla:", err.message);
    } else {
      console.log("Tabla 'cursos' lista.");
    }
  });
});

// Exportar la conexión para usar en otras partes (API, etc.)
module.exports = db;
