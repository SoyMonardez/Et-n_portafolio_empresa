import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { presupuestoService } from '../services/presupuestoService.js';
import { contactoService } from '../services/contactoService.js';
import { alquilerService } from '../services/alquilerService.js';
import { postulacionService } from '../services/postulacionService.js';
import { actualizarEstado } from '../repositories/estadoRepo.js';

const router = Router();
router.use(requireAuth);

const BANDEJAS = {
  presupuestos: { servicio: presupuestoService, tabla: 'presupuestos' },
  contactos: { servicio: contactoService, tabla: 'contactos' },
  alquiler: { servicio: alquilerService, tabla: 'alquiler_solicitudes' },
  postulaciones: { servicio: postulacionService, tabla: 'postulaciones' },
};

router.get('/resumen', asyncHandler(async (_req, res) => {
  const entradas = await Promise.all(
    Object.entries(BANDEJAS).map(async ([nombre, { servicio }]) => {
      const items = await servicio.list();
      return [nombre, { total: items.length, nuevos: items.filter((i) => i.estado === 'nuevo').length }];
    })
  );
  res.json({ ok: true, resumen: Object.fromEntries(entradas) });
}));

for (const [nombre, { servicio, tabla }] of Object.entries(BANDEJAS)) {
  router.get(`/${nombre}`, asyncHandler(async (_req, res) => {
    res.json({ ok: true, items: await servicio.list() });
  }));

  router.patch(`/${nombre}/:id`, asyncHandler(async (req, res) => {
    const { estado } = req.body || {};
    await actualizarEstado(tabla, req.params.id, estado);
    res.json({ ok: true });
  }));
}

export default router;
