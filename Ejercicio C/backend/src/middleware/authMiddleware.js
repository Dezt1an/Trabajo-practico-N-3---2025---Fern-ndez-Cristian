import passport from 'passport';

export const protegerRuta = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, usuario, info) => {
    if (err) {
      return next(err);
    }

    if (!usuario) {
      if (info && info.name === 'JsonWebTokenError') {
        return res.status(401).json({ msg: 'Token no válido' });
      }
      if (info && info.name === 'TokenExpiredError') {
        return res.status(401).json({ msg: 'Token expirado' });
      }
      return res.status(401).json({ msg: 'No autorizado' });
    }

    req.user = usuario;
    next();
  })(req, res, next);
};