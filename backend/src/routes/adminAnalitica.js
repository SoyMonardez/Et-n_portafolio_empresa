import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { visitaRepo } from '../repositories/visitaRepo.js';

const router = Router();
router.use(requireAuth);

const DIAS_VALIDOS = [7, 30, 90];

router.get('/', asyncHandler(async (req, res) => {
  let dias = parseInt(req.query.dias, 10);
  if (!DIAS_VALIDOS.includes(dias)) dias = 30;

  const [resumen, conversiones] = await Promise.all([
    visitaRepo.resumen(dias),
    visitaRepo.conversiones(dias),
  ]);

  res.json({ ok: true, dias, ...resumen, conversiones });
}));

export default router;
