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
router.get('/', async (req, res) => {
  try {
    const products = await db.getProducts();
    return res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({ message: 'Error al obtener los productos.' });
  }
});

// POST: Crear nuevo producto (protegido + subida de imagen obligatoria)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  const { name, price, stock, details } = req.body;

  if (!name || !price || !stock) {
    return res.status(400).json({ message: 'Nombre, precio y stock son requeridos.' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'La imagen del producto es requerida.' });
  }

  const tempFilePath = req.file.path;

  try {
    // Leer el archivo subido y convertirlo a Base64
    const fileBuffer = fs.readFileSync(tempFilePath);
    const base64Image = `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`;

    // Guardar en la base de datos con la imagen codificada en Base64
    const info = await db.createProduct(name, price, stock, details || '', base64Image);

    const newProduct = {
      id: info.lastInsertRowid,
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      details,
      imageUrl: base64Image
    };

    // Eliminar el archivo temporal del disco
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }

    return res.status(201).json({
      message: 'Producto creado con éxito.',
      product: newProduct
    });
  } catch (error) {
    console.error('Error al guardar producto:', error);
    // Asegurar que borramos el archivo temporal si ocurre un error
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (err) {
        console.error('Error al borrar archivo temporal:', err);
      }
    }
    return res.status(500).json({ message: 'Error interno al guardar el producto.' });
  }
});

// DELETE: Eliminar producto (protegido)
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar el producto para obtener la ruta del archivo de imagen y borrarlo
    const product = await db.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    // Borrar de la base de datos
    await db.deleteProduct(id);

    // Intentar borrar la imagen física (si no es Base64, por retrocompatibilidad)
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
