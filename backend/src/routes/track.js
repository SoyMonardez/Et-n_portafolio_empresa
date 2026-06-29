import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { trackService } from '../services/trackService.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const router = Router();

// Límite holgado: una visita registra varias rutas, pero evita abuso masivo.
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  // No respondemos error visible: el beacon es "fire and forget".
  handler: (_req, res) => res.status(204).end(),
});

router.post('/', limiter, asyncHandler(async (req, res) => {
  await trackService.registrar(req.body || {}, req.headers);
  res.status(204).end();
}));

export default router;
