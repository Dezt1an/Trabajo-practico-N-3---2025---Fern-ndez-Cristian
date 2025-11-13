import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { conectarDB } from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

export default (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      let pool;
      try {
        pool = await conectarDB();
        const connection = await pool.getConnection();
        const [rows] = await connection.query(
          'SELECT id, nombre, email FROM usuario WHERE id = ?',
          [jwt_payload.id]
        );
        connection.release();

        if (rows.length > 0) {
          const usuario = rows[0];
          return done(null, usuario);
        } else {
          return done(null, false);
        }
      } catch (error) {
        console.error(error);
        return done(error, false);
      }
    })
  );
};