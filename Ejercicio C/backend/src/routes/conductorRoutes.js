import { Router } from 'express';
import { body, param } from 'express-validator';
import { protegerRuta } from '../middleware/authMiddleware.js';
import {
  crearConductor,
  obtenerConductores,
  obtenerConductorPorId,
  actualizarConductor,
  eliminarConductor,
} from '../controllers/conductorController.js';

const router = Router();

router.use(protegerRuta);

const validacionesConductor = [
  body('nombre', 'El nombre es obligatorio').notEmpty(),
  body('apellido', 'El apellido es obligatorio').notEmpty(),
  body('dni', 'El DNI es obligatorio').notEmpty(),
  body('licencia', 'La licencia es obligatoria').notEmpty(),
  body('fecha_vencimiento_licencia', 'Fecha de vencimiento inválida')
    .isISO8601()
    .isAfter(),
];

router.post('/', validacionesConductor, crearConductor);

router.get('/', obtenerConductores);

router.get(
  '/:id',
  [param('id', 'ID no válido').isInt()],
  obtenerConductorPorId
);

router.put(
  '/:id',
  [param('id', 'ID no válido').isInt(), ...validacionesConductor],
  actualizarConductor
);

router.delete(
  '/:id',
  [param('id', 'ID no válido').isInt()],
  eliminarConductor
);

export default router;