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

// Middleware para aceptar múltiples imágenes o una sola
const uploadMiddleware = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Error al procesar las imágenes.' });
    }
    next();
  });
};

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

// POST: Crear nuevo producto (protegido + subida de una o varias imágenes)
router.post('/', authMiddleware, uploadMiddleware, async (req, res) => {
  const { name, price, stock, details } = req.body;

  if (!name || !price || !stock) {
    return res.status(400).json({ message: 'Nombre, precio y stock son requeridos.' });
  }

  const files = req.files || (req.file ? [req.file] : []);

  if (files.length === 0) {
    return res.status(400).json({ message: 'Al menos una imagen del producto es requerida.' });
  }

  const tempFilePaths = files.map(f => f.path);

  try {
    // Convertir todas las imágenes a Base64
    const base64Images = [];
    for (const file of files) {
      const fileBuffer = fs.readFileSync(file.path);
      const base64 = `data:${file.mimetype};base64,${fileBuffer.toString('base64')}`;
      base64Images.push(base64);

      // Eliminar archivo temporal
      if (fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
        } catch (err) {}
      }
    }

    const primaryImage = base64Images[0];

    // Guardar en la base de datos con imagen principal y arreglo de imágenes
    const info = await db.createProduct(name, price, stock, details || '', primaryImage, base64Images);

    const newProduct = {
      id: info.lastInsertRowid,
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      details,
      imageUrl: primaryImage,
      images: base64Images
    };

    return res.status(201).json({
      message: 'Producto creado con éxito.',
      product: newProduct
    });
  } catch (error) {
    console.error('Error al guardar producto:', error);
    // Limpiar archivos temporales en caso de fallo
    for (const filePath of tempFilePaths) {
      if (filePath && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {}
      }
    }
    return res.status(500).json({ message: 'Error interno al guardar el producto.' });
  }
// PUT: Actualizar producto existente (protegido + opcionalmente nuevas fotos)
router.put('/:id', authMiddleware, uploadMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, details } = req.body;

  if (!name || !price || !stock) {
    return res.status(400).json({ message: 'Nombre, precio y stock son requeridos.' });
  }

  const files = req.files || (req.file ? [req.file] : []);
  const tempFilePaths = files.map(f => f.path);

  try {
    const existing = await db.getProductById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    let primaryImage = null;
    let base64Images = null;

    if (files.length > 0) {
      base64Images = [];
      for (const file of files) {
        const fileBuffer = fs.readFileSync(file.path);
        const base64 = `data:${file.mimetype};base64,${fileBuffer.toString('base64')}`;
        base64Images.push(base64);

        if (fs.existsSync(file.path)) {
          try {
            fs.unlinkSync(file.path);
          } catch (err) {}
        }
      }
      primaryImage = base64Images[0];
    }

    await db.updateProduct(id, name, price, stock, details || '', primaryImage, base64Images);

    const updated = await db.getProductById(id);

    return res.json({
      message: 'Producto actualizado con éxito.',
      product: updated
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    for (const filePath of tempFilePaths) {
      if (filePath && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {}
      }
    }
    return res.status(500).json({ message: 'Error interno al actualizar el producto.' });
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
