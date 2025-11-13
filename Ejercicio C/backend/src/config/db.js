import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool;

export const conectarDB = async () => {
  try {
    if (pool) return pool;

    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'tp3_vehiculos',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    console.log('Base de datos MySQL conectada');
    return pool;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1);
  }
};