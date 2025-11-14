import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { conectarDB } from './config/db.js';

import usuarioRoutes from './routes/usuarioRoutes.js';
import passport from 'passport';
import configurarPassport from './middleware/passport.js';
import vehiculoRoutes from './routes/vehiculoRoutes.js';
import conductorRoutes from './routes/conductorRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

conectarDB();

app.use(passport.initialize());
configurarPassport(passport);

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/conductores', conductorRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});

