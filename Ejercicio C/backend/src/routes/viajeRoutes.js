import { Router } from 'express';
import { body, param } from 'express-validator';
import { protegerRuta } from '../middleware/authMiddleware.js';
import {
  crearViaje,
  obtenerViajes,
  obtenerViajePorId,
  actualizarViaje,
  eliminarViaje,
  obtenerViajesPorConductor,
  obtenerViajesPorVehiculo,
} from '../controllers/viajeController.js';

const router = Router();

router.use(protegerRuta);

const validacionesViaje = [
  body('vehiculo_id', 'El vehículo es obligatorio').isInt({ min: 1 }),
  body('conductor_id', 'El conductor es obligatorio').isInt({ min: 1 }),
  body('fecha_salida', 'La fecha de salida es inválida').isISO8601(),
  body('origen', 'El origen es obligatorio').notEmpty(),
  body('destino', 'El destino es obligatorio').notEmpty(),
  body('kilometros', 'Los kilómetros deben ser un número válido').isFloat({
    min: 0,
  }),
  body('fecha_llegada')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('La fecha de llegada es inválida')
    .custom((value, { req }) => {
      if (value && new Date(value) < new Date(req.body.fecha_salida)) {
        throw new Error(
          'La fecha de llegada no puede ser anterior a la fecha de salida'
        );
      }
      return true;
    }),
  body('observaciones').optional().isString(),
];

router.post('/', validacionesViaje, crearViaje);

router.get('/', obtenerViajes);

router.get(
  '/conductor/:id',
  [param('id', 'ID de conductor no válido').isInt()],
  obtenerViajesPorConductor
);

router.get(
  '/vehiculo/:id',
  [param('id', 'ID de vehículo no válido').isInt()],
  obtenerViajesPorVehiculo
);

router.get(
  '/:id',
  [param('id', 'ID no válido').isInt()],
  obtenerViajePorId
);

router.put(
  '/:id',
  [param('id', 'ID no válido').isInt(), ...validacionesViaje],
  actualizarViaje
);

router.delete(
  '/:id',
  [param('id', 'ID no válido').isInt()],
  eliminarViaje
);

export default router;