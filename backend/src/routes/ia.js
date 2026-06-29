import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../middlewares/requireAuth.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { iaService } from '../services/iaService.js';
import { visitaRepo } from '../repositories/visitaRepo.js';

const router = Router();

// Limita el uso de la IA para no abusar de la cuota del token.
const iaLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados pedidos a la IA. Esperá un momento.' },
});

// Traducción ES→EN (pública: la usa el selector de idioma del sitio).
router.post('/traducir', iaLimiter, asyncHandler(async (req, res) => {
  const texto = await iaService.traducir(req.body?.texto);
  res.json({ ok: true, texto });
}));

// --- Funciones del admin (requieren login) ---
router.post('/sugerir-descripcion', requireAuth, iaLimiter, asyncHandler(async (req, res) => {
  const { tipo, nombre, categoria, datos } = req.body || {};
  const texto = await iaService.sugerirDescripcion({ tipo, nombre, categoria, datos });
  res.json({ ok: true, texto });
}));

router.post('/analizar-metricas', requireAuth, iaLimiter, asyncHandler(async (req, res) => {
  const dias = [7, 30, 90].includes(Number(req.body?.dias)) ? Number(req.body.dias) : 30;
  const [resumen, conversiones] = await Promise.all([
    visitaRepo.resumen(dias),
    visitaRepo.conversiones(dias),
  ]);
  // Le pasamos a la IA un resumen compacto (no datos crudos).
  const texto = await iaService.analizarMetricas({
    dias,
    totales: resumen.totales,
    fuentes: resumen.fuentes,
    paginas: resumen.topPaginas,
    dispositivos: resumen.dispositivos,
    conversiones,
  });
  res.json({ ok: true, texto });
}));

export default router;
