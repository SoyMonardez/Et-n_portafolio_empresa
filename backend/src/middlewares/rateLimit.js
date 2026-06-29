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
