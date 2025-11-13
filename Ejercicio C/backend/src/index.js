import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { conectarDB } from './config/db.js';

import usuarioRoutes from './routes/usuarioRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

conectarDB();

app.use('/api/usuarios', usuarioRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});