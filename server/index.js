import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// Importar base de datos para inicializarla
import './db/database.js';

// Importar rutas
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar CORS para permitir peticiones desde Hostinger y desarrollo local
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3001',
  'https://mundogas.onrender.com',
  // Agrega aquí tu dominio de Hostinger cuando lo tengas, ej: 'https://www.mundogasmanizales.com'
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (Postman, curl, SSR)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // En desarrollo, ser permisivo
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    callback(new Error(`CORS bloqueado: origen ${origin} no permitido.`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir la carpeta de imágenes subidas de forma estática
const uploadsDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Rutas API (deben ir ANTES del static del frontend)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Servir archivos estáticos del frontend compilado de React (en producción)
const distDir = path.resolve(__dirname, '../dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));

  // Catch-all: cualquier ruta no resuelta por la API devuelve el index.html de React.
  // Usamos app.use() sin patrón para evitar errores de path-to-regexp en Express 5.
  app.use((req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

// Manejo de errores básico
app.use((err, req, res, _next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({ message: err.message || 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});
