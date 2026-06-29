import { Router } from 'express';
import { authService } from '../services/authService.js';
import { loginRateLimiter } from '../middlewares/rateLimit.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const router = Router();

router.post('/login', loginRateLimiter, asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  const result = await authService.login(email, password);
  res.json({ ok: true, ...result });
}));

export default router;
