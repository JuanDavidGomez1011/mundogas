import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Asegurar que la ruta a la base de datos esté bien construida
const dbPath = path.resolve(__dirname, 'mundogas.db');
const db = new Database(dbPath);

// Habilitar claves foráneas
db.pragma('foreign_keys = ON');

// Crear tablas si no existen
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER NOT NULL,
    details TEXT,
    imageUrl TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insertar usuario administrador por defecto si la tabla está vacía
const checkUserStmt = db.prepare('SELECT COUNT(*) as count FROM users');
const { count } = checkUserStmt.get();

if (count === 0) {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync('mundogas2024', salt);
  const insertUserStmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
  insertUserStmt.run('admin', hashedPassword);
  console.log('Usuario administrador creado con éxito: admin / mundogas2024');
}

export default db;
