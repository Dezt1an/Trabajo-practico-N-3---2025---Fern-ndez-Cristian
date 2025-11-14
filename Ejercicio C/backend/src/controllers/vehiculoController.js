import { validationResult } from 'express-validator';
import { conectarDB } from '../config/db.js';

const handleValidationErrors = (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  return null;
};

export const crearVehiculo = async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return validationError;

  const { marca, modelo, patente, año, capacidad_carga } = req.body;
  let pool;

  try {
    pool = await conectarDB();
    const connection = await pool.getConnection();

    const [rows] = await connection.query(
      'SELECT * FROM vehiculo WHERE patente = ?',
      [patente]
    );
    if (rows.length > 0) {
      connection.release();
      return res.status(400).json({ msg: 'La patente ya está registrada' });
    }

    const [result] = await connection.query(
      'INSERT INTO vehiculo (marca, modelo, patente, año, capacidad_carga) VALUES (?, ?, ?, ?, ?)',
      [marca, modelo, patente, año, capacidad_carga]
    );
    connection.release();

    res.status(201).json({
      msg: 'Vehículo creado correctamente',
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    if (pool) {
      res.status(500).send('Error en el servidor');
    }
  }
};

export const obtenerVehiculos = async (req, res) => {
  let pool;
  try {
    pool = await conectarDB();
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM vehiculo');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error(error);
    if (pool) {
      res.status(500).send('Error en el servidor');
    }
  }
};

export const obtenerVehiculoPorId = async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return validationError;

  const { id } = req.params;
  let pool;

  try {
    pool = await conectarDB();
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM vehiculo WHERE id = ?',
      [id]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Vehículo no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    if (pool) {
      res.status(500).send('Error en el servidor');
    }
  }
};

export const actualizarVehiculo = async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return validationError;

  const { id } = req.params;
  const { marca, modelo, patente, año, capacidad_carga } = req.body;
  let pool;

  try {
    pool = await conectarDB();
    const connection = await pool.getConnection();

    const [patenteRows] = await connection.query(
      'SELECT * FROM vehiculo WHERE patente = ? AND id != ?',
      [patente, id]
    );
    if (patenteRows.length > 0) {
      connection.release();
      return res.status(400).json({ msg: 'La patente ya pertenece a otro vehículo' });
    }

    const [result] = await connection.query(
      'UPDATE vehiculo SET marca = ?, modelo = ?, patente = ?, año = ?, capacidad_carga = ? WHERE id = ?',
      [marca, modelo, patente, año, capacidad_carga, id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Vehículo no encontrado' });
    }
    res.json({ msg: 'Vehículo actualizado correctamente' });
  } catch (error)
  {
    console.error(error);
    if (pool) {
      res.status(500).send('Error en el servidor');
    }
  }
};

export const eliminarVehiculo = async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return validationError;

  const { id } = req.params;
  let pool;

  try {
    pool = await conectarDB();
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'DELETE FROM vehiculo WHERE id = ?',
      [id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Vehículo no encontrado' });
    }
    res.json({ msg: 'Vehículo eliminado correctamente' });
  } catch (error) {
    console.error(error);
    if (pool) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
         return res.status(400).json({ msg: 'No se puede eliminar el vehículo porque tiene viajes asociados' });
      }
      res.status(500).send('Error en el servidor');
    }
  }
};