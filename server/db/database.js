import Database from 'better-sqlite3';
import pg from 'pg';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isMysql = !!process.env.MYSQL_HOST || (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('mysql:'));
const isPostgres = !isMysql && !!process.env.DATABASE_URL;

let dbSqlite;
let pgPool;
let mysqlPool;

if (isMysql) {
  if (process.env.DATABASE_URL) {
    mysqlPool = mysql.createPool(process.env.DATABASE_URL);
  } else {
    mysqlPool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'mundogas',
      port: Number(process.env.MYSQL_PORT) || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
} else if (isPostgres) {
  pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  const dbPath = path.resolve(__dirname, 'mundogas.db');
  dbSqlite = new Database(dbPath);
  dbSqlite.pragma('foreign_keys = ON');
}

// Inicializar tablas de forma asíncrona
async function initDatabase() {
  if (isMysql) {
    try {
      await mysqlPool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await mysqlPool.query(`
        CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          price DOUBLE NOT NULL,
          stock INT NOT NULL,
          details TEXT,
          imageUrl TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      const [rows] = await mysqlPool.query('SELECT COUNT(*) as count FROM users');
      const count = rows[0]?.count || 0;
      if (count === 0) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync('mundogas2024', salt);
        await mysqlPool.query('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', hashedPassword]);
        console.log('Usuario administrador creado con éxito en MySQL: admin / mundogas2024');
      }
    } catch (err) {
      console.error('Error al inicializar base de datos MySQL:', err);
    }
  } else if (isPostgres) {
    const client = await pgPool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          price DOUBLE PRECISION NOT NULL,
          stock INTEGER NOT NULL,
          details TEXT,
          imageUrl TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      const res = await client.query('SELECT COUNT(*) as count FROM users');
      const count = parseInt(res.rows[0].count, 10);
      if (count === 0) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync('mundogas2024', salt);
        await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', ['admin', hashedPassword]);
        console.log('Usuario administrador creado con éxito en PostgreSQL: admin / mundogas2024');
      }
    } catch (err) {
      console.error('Error al inicializar base de datos PostgreSQL:', err);
    } finally {
      client.release();
    }
  } else {
    // SQLite
    dbSqlite.exec(`
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

    const checkUserStmt = dbSqlite.prepare('SELECT COUNT(*) as count FROM users');
    const { count } = checkUserStmt.get();

    if (count === 0) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync('mundogas2024', salt);
      const insertUserStmt = dbSqlite.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
      insertUserStmt.run('admin', hashedPassword);
      console.log('Usuario administrador creado con éxito en SQLite: admin / mundogas2024');
    }
  }
}

// Ejecutar inicialización
await initDatabase();

const db = {
  async getUserByUsername(username) {
    if (isMysql) {
      const [rows] = await mysqlPool.query('SELECT * FROM users WHERE username = ?', [username]);
      return rows[0] || null;
    } else if (isPostgres) {
      const res = await pgPool.query('SELECT * FROM users WHERE username = $1', [username]);
      return res.rows[0] || null;
    } else {
      return dbSqlite.prepare('SELECT * FROM users WHERE username = ?').get(username) || null;
    }
  },

  async getProducts() {
    if (isMysql) {
      const [rows] = await mysqlPool.query('SELECT * FROM products ORDER BY id DESC');
      return rows.map(row => ({
        ...row,
        imageUrl: row.imageurl || row.imageUrl
      }));
    } else if (isPostgres) {
      const res = await pgPool.query('SELECT * FROM products ORDER BY id DESC');
      return res.rows.map(row => ({
        ...row,
        imageUrl: row.imageurl || row.imageUrl
      }));
    } else {
      return dbSqlite.prepare('SELECT * FROM products ORDER BY id DESC').all();
    }
  },

  async getProductById(id) {
    if (isMysql) {
      const [rows] = await mysqlPool.query('SELECT * FROM products WHERE id = ?', [id]);
      const row = rows[0];
      if (row) {
        return {
          ...row,
          imageUrl: row.imageurl || row.imageUrl
        };
      }
      return null;
    } else if (isPostgres) {
      const res = await pgPool.query('SELECT * FROM products WHERE id = $1', [id]);
      const row = res.rows[0];
      if (row) {
        return {
          ...row,
          imageUrl: row.imageurl || row.imageUrl
        };
      }
      return null;
    } else {
      return dbSqlite.prepare('SELECT * FROM products WHERE id = ?').get(id) || null;
    }
  },

  async createProduct(name, price, stock, details, imageUrl) {
    if (isMysql) {
      const [result] = await mysqlPool.query(
        'INSERT INTO products (name, price, stock, details, imageUrl) VALUES (?, ?, ?, ?, ?)',
        [name, parseFloat(price), parseInt(stock), details || '', imageUrl]
      );
      return { lastInsertRowid: result.insertId };
    } else if (isPostgres) {
      const res = await pgPool.query(
        'INSERT INTO products (name, price, stock, details, imageUrl) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [name, parseFloat(price), parseInt(stock), details || '', imageUrl]
      );
      return { lastInsertRowid: res.rows[0].id };
    } else {
      const info = dbSqlite.prepare(
        'INSERT INTO products (name, price, stock, details, imageUrl) VALUES (?, ?, ?, ?, ?)'
      ).run(name, parseFloat(price), parseInt(stock), details || '', imageUrl);
      return { lastInsertRowid: info.lastInsertRowid };
    }
  },

  async deleteProduct(id) {
    if (isMysql) {
      await mysqlPool.query('DELETE FROM products WHERE id = ?', [id]);
    } else if (isPostgres) {
      await pgPool.query('DELETE FROM products WHERE id = $1', [id]);
    } else {
      dbSqlite.prepare('DELETE FROM products WHERE id = ?').run(id);
    }
  }
};

export default db;
