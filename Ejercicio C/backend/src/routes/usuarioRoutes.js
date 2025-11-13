import { Router } from 'express';
import { body } from 'express-validator';
import {
  registrarUsuario,
  loginUsuario,
  obtenerPerfil,
} from '../controllers/usuarioController.js';

import { protegerRuta } from '../middleware/authMiddleware.js';

const router = Router();

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

router.post(
  '/login',
  [
    body('email', 'El email es obligatorio').isEmail(),
    body('contraseña', 'La contraseña es obligatoria').notEmpty(),
  ],
  loginUsuario
);


router.get('/perfil', protegerRuta, obtenerPerfil);

export default router;