import { validationResult } from 'express-validator';
import { conectarDB } from '../config/db.js';

const handleValidationErrors = (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  return null;
};

const verificarExistencia = async (connection, vehiculo_id, conductor_id) => {
  const [vehiculoRows] = await connection.query(
    'SELECT * FROM vehiculo WHERE id = ?',
    [vehiculo_id]
  );
  if (vehiculoRows.length === 0) {
    return { existe: false, msg: 'El vehículo no existe' };
  }

  const [conductorRows] = await connection.query(
    'SELECT * FROM conductor WHERE id = ?',
    [conductor_id]
  );
  if (conductorRows.length === 0) {
    return { existe: false, msg: 'El conductor no existe' };
  }
  return { existe: true };
};

export const crearViaje = async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return validationError;

  const {
    vehiculo_id,
    conductor_id,
    fecha_salida,
    fecha_llegada,
    origen,
    destino,
    kilometros,
    observaciones,
  } = req.body;
  let pool;

  try {
    pool = await conectarDB();
    const connection = await pool.getConnection();

    const { existe, msg } = await verificarExistencia(
      connection,
      vehiculo_id,
      conductor_id
    );
    if (!existe) {
      connection.release();
      return res.status(404).json({ msg });
    }

    const [result] = await connection.query(
      'INSERT INTO viaje (vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        vehiculo_id,
        conductor_id,
        fecha_salida,
        fecha_llegada || null,
        origen,
        destino,
        kilometros,
        observaciones || null,
      ]
    );
    connection.release();

    res.status(201).json({
      msg: 'Viaje creado correctamente',
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    if (pool) {
      res.status(500).send('Error en el servidor');
    }
  }
};

const consultaBaseViajes = `
  SELECT 
    v.id, v.fecha_salida, v.fecha_llegada, v.origen, v.destino, v.kilometros, v.observaciones,
    c.nombre AS conductor_nombre, c.apellido AS conductor_apellido,
    ve.marca AS vehiculo_marca, ve.modelo AS vehiculo_modelo, ve.patente AS vehiculo_patente
  FROM viaje v
  JOIN conductor c ON v.conductor_id = c.id
  JOIN vehiculo ve ON v.vehiculo_id = ve.id
`;

export const obtenerViajes = async (req, res) => {
  let pool;
  try {
    pool = await conectarDB();
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `${consultaBaseViajes} ORDER BY v.fecha_salida DESC`
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error(error);
    if (pool) {
      res.status(500).send('Error en el servidor');
    }
  }
};

export const obtenerViajePorId = async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return validationError;

  const { id } = req.params;
  let pool;

  try {
    pool = await conectarDB();
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `${consultaBaseViajes} WHERE v.id = ?`,
      [id]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Viaje no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    if (pool) {
      res.status(500).send('Error en el servidor');
    }
  }
};

export const actualizarViaje = async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return validationError;

  const { id } = req.params;
  const {
    vehiculo_id,
    conductor_id,
    fecha_salida,
    fecha_llegada,
    origen,
    destino,
    kilometros,
    observaciones,
  } = req.body;
  let pool;

  try {
    pool = await conectarDB();
    const connection = await pool.getConnection();

    const { existe, msg } = await verificarExistencia(
      connection,
      vehiculo_id,
      conductor_id
    );
    if (!existe) {
      connection.release();
      return res.status(404).json({ msg });
    }

    const [result] = await connection.query(
      'UPDATE viaje SET vehiculo_id = ?, conductor_id = ?, fecha_salida = ?, fecha_llegada = ?, origen = ?, destino = ?, kilometros = ?, observaciones = ? WHERE id = ?',
      [
        vehiculo_id,
        conductor_id,
        fecha_salida,
        fecha_llegada || null,
        origen,
        destino,
        kilometros,
        observaciones || null,
        id,
      ]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Viaje no encontrado' });
    }
    res.json({ msg: 'Viaje actualizado correctamente' });
  } catch (error) {
    console.error(error);
    if (pool) {
      res.status(500).send('Error en el servidor');
    }
  }
};

export const eliminarViaje = async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return validationError;

  const { id } = req.params;
  let pool;

  try {
    pool = await conectarDB();
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM viaje WHERE id = ?', [
      id,
    ]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Viaje no encontrado' });
    }
    res.json({ msg: 'Viaje eliminado correctamente' });
  } catch (error) {
    console.error(error);
    if (pool) {
      res.status(500).send('Error en el servidor');
    }
  }
};

export const obtenerViajesPorConductor = async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return validationError;

  const { id } = req.params;
  let pool;
  try {
    pool = await conectarDB();
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `${consultaBaseViajes} WHERE v.conductor_id = ? ORDER BY v.fecha_salida DESC`,
      [id]
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error(error);
    if (pool) {
      res.status(500).send('Error en el servidor');
    }
  }
};

export const obtenerViajesPorVehiculo = async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return validationError;

  const { id } = req.params;
  let pool;
  try {
    pool = await conectarDB();
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `${consultaBaseViajes} WHERE v.vehiculo_id = ? ORDER BY v.fecha_salida DESC`,
      [id]
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error(error);
    if (pool) {
      res.status(500).send('Error en el servidor');
    }
  }
};