import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

// Limita los formularios públicos por IP para evitar spam/abuso.
export const formRateLimiter = rateLimit({
  windowMs: env.rateLimit.contactWindowMin * 60 * 1000,
  max: env.rateLimit.contactMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Alcanzaste el límite de envíos. Probá de nuevo más tarde.' },
});

// Previene fuerza bruta contra el login del admin.
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Esperá 15 minutos.' },
});
