import { Router } from 'express';
import { alquilerService } from '../services/alquilerService.js';
import { formRateLimiter } from '../middlewares/rateLimit.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const router = Router();

router.post('/', formRateLimiter, asyncHandler(async (req, res) => {
  const result = await alquilerService.create(req.body || {});
  res.json({ ok: true, id: result.id });
}));

export default router;
