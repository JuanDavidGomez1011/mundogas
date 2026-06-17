import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from '../db/database.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Asegurar que la carpeta server/uploads exista
const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración de almacenamiento para Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, webp, gif).'));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
  fileFilter
});

// GET: Obtener todos los productos (público)
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM products ORDER BY id DESC');
    const products = stmt.all();
    return res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({ message: 'Error al obtener los productos.' });
  }
});

// POST: Crear nuevo producto (protegido + subida de imagen obligatoria)
router.post('/', authMiddleware, upload.single('image'), (req, res) => {
  const { name, price, stock, details } = req.body;

  if (!name || !price || !stock) {
    return res.status(400).json({ message: 'Nombre, precio y stock son requeridos.' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'La imagen del producto es requerida.' });
  }

  try {
    // Generar la URL de la imagen relativa al servidor (se sirve estática)
    const imageUrl = `/uploads/${req.file.filename}`;

    const stmt = db.prepare(`
      INSERT INTO products (name, price, stock, details, imageUrl)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(name, parseFloat(price), parseInt(stock), details || '', imageUrl);

    const newProduct = {
      id: info.lastInsertRowid,
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      details,
      imageUrl
    };

    return res.status(201).json({
      message: 'Producto creado con éxito.',
      product: newProduct
    });
  } catch (error) {
    console.error('Error al guardar producto:', error);
    return res.status(500).json({ message: 'Error interno al guardar el producto.' });
  }
});

// DELETE: Eliminar producto (protegido)
router.delete('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;

  try {
    // Buscar el producto para obtener la ruta del archivo de imagen y borrarlo
    const getStmt = db.prepare('SELECT * FROM products WHERE id = ?');
    const product = getStmt.get(id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    // Borrar de la base de datos
    const deleteStmt = db.prepare('DELETE FROM products WHERE id = ?');
    deleteStmt.run(id);

    // Intentar borrar la imagen física
    if (product.imageUrl && product.imageUrl.startsWith('/uploads/')) {
      const filename = product.imageUrl.replace('/uploads/', '');
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    return res.json({ message: 'Producto eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return res.status(500).json({ message: 'Error al eliminar el producto.' });
  }
});

export default router;
