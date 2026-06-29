import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { maquinaRepo } from '../repositories/maquinaRepo.js';
import { obraRepo } from '../repositories/obraRepo.js';
import { busquedaRepo } from '../repositories/busquedaRepo.js';
import { configRepo } from '../repositories/configRepo.js';

const router = Router();

router.get('/maquinas', asyncHandler(async (_req, res) => {
  res.json({ ok: true, items: await maquinaRepo.findPublicas() });
}));

router.get('/obras', asyncHandler(async (_req, res) => {
  res.json({ ok: true, items: await obraRepo.findPublicas() });
}));

router.get('/busquedas', asyncHandler(async (_req, res) => {
  res.json({ ok: true, items: await busquedaRepo.findPublicas() });
}));

router.get('/config', asyncHandler(async (_req, res) => {
  res.json({ ok: true, config: await configRepo.getAll() });
}));

export default router;
