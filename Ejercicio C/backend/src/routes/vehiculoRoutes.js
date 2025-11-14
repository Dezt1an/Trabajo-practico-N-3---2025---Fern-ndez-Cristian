import { Router } from 'express';
import { body, param } from 'express-validator';
import { protegerRuta } from '../middleware/authMiddleware.js';
import {
  crearVehiculo,
  obtenerVehiculos,
  obtenerVehiculoPorId,
  actualizarVehiculo,
  eliminarVehiculo,
} from '../controllers/vehiculoController.js';

const router = Router();

router.use(protegerRuta);

const validacionesVehiculo = [
  body('marca', 'La marca es obligatoria').notEmpty(),
  body('modelo', 'El modelo es obligatorio').notEmpty(),
  body('patente', 'La patente es obligatoria').notEmpty(),
  body('año', 'El año debe ser un número válido').isInt({ min: 1900 }),
  body('capacidad_carga', 'La capacidad debe ser un número').isInt({ min: 1 }),
];

router.post('/', validacionesVehiculo, crearVehiculo);

router.get('/', obtenerVehiculos);

router.get(
  '/:id',
  [param('id', 'ID no válido').isInt()],
  obtenerVehiculoPorId
);

router.put(
  '/:id',
  [param('id', 'ID no válido').isInt(), ...validacionesVehiculo],
  actualizarVehiculo
);

router.delete(
  '/:id',
  [param('id', 'ID no válido').isInt()],
  eliminarVehiculo
);

export default router;