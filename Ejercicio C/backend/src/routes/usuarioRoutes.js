import { Router } from 'express';
import { body } from 'express-validator';
import {
  registrarUsuario,
  loginUsuario,
} from '../controllers/usuarioController.js';

const router = Router();

// POST /api/usuarios/registrar
router.post(
  '/registrar',
  [
    body('nombre', 'El nombre es obligatorio').notEmpty(),
    body('email', 'El email no es válido').isEmail(),
    body('contraseña', 'La contraseña debe tener al menos 6 caracteres').isLength({
      min: 6,
    }),
  ],
  registrarUsuario
);

// POST /api/usuarios/login
router.post(
  '/login',
  [
    body('email', 'El email es obligatorio').isEmail(),
    body('contraseña', 'La contraseña es obligatoria').notEmpty(),
  ],
  loginUsuario
);

export default router;