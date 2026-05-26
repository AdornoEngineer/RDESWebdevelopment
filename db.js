const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const databaseDir = path.join(__dirname, "database");

if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir);
}

const dbPath = path.join(databaseDir, "app.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco:", err.message);
    } else {
        console.log("Banco conectado com sucesso.");
    }
});

db.run(`
    CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

module.exports = db;