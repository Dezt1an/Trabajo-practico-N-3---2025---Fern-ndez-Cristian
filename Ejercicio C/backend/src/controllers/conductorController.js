import { validationResult } from 'express-validator';
import { conectarDB } from '../config/db.js';

const handleValidationErrors = (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  return null;
};

export const crearConductor = async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return validationError;

  const { nombre, apellido, dni, licencia, fecha_vencimiento_licencia } =
    req.body;
  let pool;

  try {
    pool = await conectarDB();
    const connection = await pool.getConnection();

    const [rows] = await connection.query(
      'SELECT * FROM conductor WHERE dni = ?',
      [dni]
    );
    if (rows.length > 0) {
      connection.release();
      return res.status(400).json({ msg: 'El DNI ya está registrado' });
    }

    const [result] = await connection.query(
      'INSERT INTO conductor (nombre, apellido, dni, licencia, fecha_vencimiento_licencia) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellido, dni, licencia, fecha_vencimiento_licencia]
    );
    connection.release();

    res.status(201).json({
      msg: 'Conductor creado correctamente',
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    if (pool) {
      res.status(500).send('Error en el servidor');
    }
  }
};

export const obtenerConductores = async (req, res) => {
  let pool;
  try {
    pool = await conectarDB();
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM conductor');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error(error);
    if (pool) {
      res.status(500).send('Error en el servidor');
    }
  }
};

export const obtenerConductorPorId = async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return validationError;

  const { id } = req.params;
  let pool;

  try {
    pool = await conectarDB();
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM conductor WHERE id = ?',
      [id]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Conductor no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    if (pool) {
      res.status(500).send('Error en el servidor');
    }
  }
};

export const actualizarConductor = async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return validationError;

  const { id } = req.params;
  const { nombre, apellido, dni, licencia, fecha_vencimiento_licencia } =
    req.body;
  let pool;

  try {
    pool = await conectarDB();
    const connection = await pool.getConnection();

    const [dniRows] = await connection.query(
      'SELECT * FROM conductor WHERE dni = ? AND id != ?',
      [dni, id]
    );
    if (dniRows.length > 0) {
      connection.release();
      return res.status(400).json({ msg: 'El DNI ya pertenece a otro conductor' });
    }

    const [result] = await connection.query(
      'UPDATE conductor SET nombre = ?, apellido = ?, dni = ?, licencia = ?, fecha_vencimiento_licencia = ? WHERE id = ?',
      [nombre, apellido, dni, licencia, fecha_vencimiento_licencia, id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Conductor no encontrado' });
    }
    res.json({ msg: 'Conductor actualizado correctamente' });
  } catch (error) {
    console.error(error);
    if (pool) {
      res.status(500).send('Error en el servidor');
    }
  }
};

export const eliminarConductor = async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return validationError;

  const { id } = req.params;
  let pool;

  try {
    pool = await conectarDB();
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'DELETE FROM conductor WHERE id = ?',
      [id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Conductor no encontrado' });
    }
    res.json({ msg: 'Conductor eliminado correctamente' });
  } catch (error) {
    console.error(error);
    if (pool) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
         return res.status(400).json({ msg: 'No se puede eliminar el conductor porque tiene viajes asociados' });
      }
      res.status(500).send('Error en el servidor');
    }
  }
};