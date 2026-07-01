import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/database.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mundogas_super_secret_key_12345!';

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña son requeridos.' });
  }

  try {
    const user = await db.getUserByUsername(username);

    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    // Firmar JWT por 365 días (evita expiraciones molestas)
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '365d',
    });

    return res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

export default router;
