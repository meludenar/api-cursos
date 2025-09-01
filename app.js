const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 8000;

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a la base de datos
const db = new sqlite3.Database("cursos.sqlite", (err) => {
  if (err) {
    console.error("Error conectando a SQLite:", err.message);
  } else {
    console.log("Conectado a SQLite.");
  }
});

// Crear tabla si no existe
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS cursos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      creditos INTEGER NOT NULL
    )
  `);
});

// ------------------- RUTAS -------------------

// GET y POST /cursos
app.route("/cursos")
  .get((req, res) => {
    db.all("SELECT * FROM cursos", [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  })
  .post((req, res) => {
    const { nombre, creditos } = req.body;
    if (!nombre || !creditos) {
      return res.status(400).json({ error: "Nombre y créditos son obligatorios" });
    }

    const sql = "INSERT INTO cursos (nombre, creditos) VALUES (?, ?)";
    db.run(sql, [nombre, creditos], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        id: this.lastID,
        nombre,
        creditos
      });
    });
  });

// GET, PUT, DELETE /curso/:id
app.route("/curso/:id")
  .get((req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM cursos WHERE id = ?", [id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "Curso no encontrado" });
      res.json(row);
    });
  })
  .put((req, res) => {
    const { id } = req.params;
    const { nombre, creditos } = req.body;

    if (!nombre || !creditos) {
      return res.status(400).json({ error: "Nombre y créditos son obligatorios" });
    }

    const sql = "UPDATE cursos SET nombre = ?, creditos = ? WHERE id = ?";
    db.run(sql, [nombre, creditos, id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Curso no encontrado" });

      res.json({ id, nombre, creditos });
    });
  })
  .delete((req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM cursos WHERE id = ?", [id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Curso no encontrado" });

      res.json({ message: `El curso con id ${id} fue eliminado.` });
    });
  });

// Iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor escuchando en http://0.0.0.0:${PORT}`);
});
