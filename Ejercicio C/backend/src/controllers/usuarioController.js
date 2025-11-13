import { validationResult } from 'express-validator';
import { conectarDB } from '../config/db.js';
import bcrypt from 'bcrypt';
import { generarJWT } from '../utils/generarJWT.js';

export const registrarUsuario = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { nombre, email, contraseña } = req.body;
  let pool;

  try {
    pool = await conectarDB();
    const connection = await pool.getConnection();

    const [rows] = await connection.query(
      'SELECT * FROM usuario WHERE email = ?',
      [email]
    );

    if (rows.length > 0) {
      connection.release();
      return res.status(400).json({ msg: 'El email ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const contraseñaHasheada = await bcrypt.hash(contraseña, salt);

    const [result] = await connection.query(
      'INSERT INTO usuario (nombre, email, contraseña) VALUES (?, ?, ?)',
      [nombre, email, contraseñaHasheada]
    );

    const nuevoUsuarioId = result.insertId;
    connection.release();

    const token = generarJWT(nuevoUsuarioId);

    res.status(201).json({
      msg: 'Usuario creado correctamente',
      token: token,
      usuario: {
        id: nuevoUsuarioId,
        nombre: nombre,
        email: email,
      },
    });
  } catch (error) {
    console.error(error);
    if (pool) {
      res.status(500).send('Error en el servidor al registrar el usuario');
    }
  }
};

export const loginUsuario = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { email, contraseña } = req.body;
  let pool;
  let connection;

  try {
    pool = await conectarDB();
    connection = await pool.getConnection();

    const [rows] = await connection.query(
      'SELECT * FROM usuario WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      connection.release();
      return res.status(401).json({ msg: 'Email o contraseña incorrectos' });
    }

    const usuario = rows[0];
    connection.release();

    const passCorrecto = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!passCorrecto) {
      return res.status(401).json({ msg: 'Email o contraseña incorrectos' });
    }

    const token = generarJWT(usuario.id);

    res.status(200).json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error(error);
    if (pool) {
      res.status(500).send('Error en el servidor al iniciar sesión');
    }
  }
};