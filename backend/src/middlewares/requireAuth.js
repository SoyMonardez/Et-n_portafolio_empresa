import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { unauthorized } from '../utils/httpError.js';

// Verifica el JWT del header Authorization: Bearer <token>.
export function requireAuth(req, _res, next) {
  const raw = req.headers.authorization || '';
  const token = raw.startsWith('Bearer ') ? raw.slice(7) : raw;
  if (!token) return next(unauthorized());

  try {
    req.admin = jwt.verify(token, env.jwt.secret, { algorithms: ['HS256'] });
    next();
  } catch {
    next(unauthorized('Sesión inválida o vencida'));
  }
}
