import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { recibirImagen, guardarImagen } from '../utils/imagenes.js';
import { texto } from '../services/validar.js';
import { notFound } from '../utils/httpError.js';
import { maquinaRepo } from '../repositories/maquinaRepo.js';
import { obraRepo } from '../repositories/obraRepo.js';
import { busquedaRepo } from '../repositories/busquedaRepo.js';
import { configRepo } from '../repositories/configRepo.js';

const router = Router();
router.use(requireAuth);

// FormData manda los booleanos como texto.
const flag = (v, def = true) => (v === undefined ? def : v === 'true' || v === true);

/* ---------------- Maquinaria ---------------- */
router.get('/maquinas', asyncHandler(async (_req, res) => {
  res.json({ ok: true, items: await maquinaRepo.findAll() });
}));

router.post('/maquinas', recibirImagen, asyncHandler(async (req, res) => {
  const imagenUrl = await guardarImagen(req.file);
  const id = await maquinaRepo.create({
    nombre: texto(req.body.nombre, { campo: 'nombre', max: 150 }),
    categoria: texto(req.body.categoria, { campo: 'categoría', max: 100 }),
    detalle: texto(req.body.detalle, { campo: 'detalle', max: 1000, requerido: false }),
    imagenUrl,
  });
  res.json({ ok: true, id });
}));

router.patch('/maquinas/:id', recibirImagen, asyncHandler(async (req, res) => {
  const imagenUrl = await guardarImagen(req.file);
  const n = await maquinaRepo.update(req.params.id, {
    nombre: texto(req.body.nombre, { campo: 'nombre', max: 150 }),
    categoria: texto(req.body.categoria, { campo: 'categoría', max: 100 }),
    detalle: texto(req.body.detalle, { campo: 'detalle', max: 1000, requerido: false }),
    imagenUrl,
    activa: flag(req.body.activa),
  });
  if (!n) throw notFound();
  res.json({ ok: true });
}));

router.delete('/maquinas/:id', asyncHandler(async (req, res) => {
  if (!(await maquinaRepo.remove(req.params.id))) throw notFound();
  res.json({ ok: true });
}));

/* ---------------- Obras ---------------- */
router.get('/obras', asyncHandler(async (_req, res) => {
  res.json({ ok: true, items: await obraRepo.findAll() });
}));

router.post('/obras', recibirImagen, asyncHandler(async (req, res) => {
  const imagenUrl = await guardarImagen(req.file);
  const id = await obraRepo.create({
    titulo: texto(req.body.titulo, { campo: 'título', max: 150 }),
    categoria: texto(req.body.categoria, { campo: 'categoría', max: 100 }),
    lugar: texto(req.body.lugar, { campo: 'lugar', max: 150 }),
    anio: texto(req.body.anio, { campo: 'año', max: 10, requerido: false }),
    imagenUrl,
  });
  res.json({ ok: true, id });
}));

router.patch('/obras/:id', recibirImagen, asyncHandler(async (req, res) => {
  const imagenUrl = await guardarImagen(req.file);
  const n = await obraRepo.update(req.params.id, {
    titulo: texto(req.body.titulo, { campo: 'título', max: 150 }),
    categoria: texto(req.body.categoria, { campo: 'categoría', max: 100 }),
    lugar: texto(req.body.lugar, { campo: 'lugar', max: 150 }),
    anio: texto(req.body.anio, { campo: 'año', max: 10, requerido: false }),
    imagenUrl,
    publicada: flag(req.body.publicada),
  });
  if (!n) throw notFound();
  res.json({ ok: true });
}));

router.delete('/obras/:id', asyncHandler(async (req, res) => {
  if (!(await obraRepo.remove(req.params.id))) throw notFound();
  res.json({ ok: true });
}));

/* ---------------- Búsquedas laborales ---------------- */
router.get('/busquedas', asyncHandler(async (_req, res) => {
  res.json({ ok: true, items: await busquedaRepo.findAll() });
}));

router.post('/busquedas', asyncHandler(async (req, res) => {
  const id = await busquedaRepo.create({
    puesto: texto(req.body.puesto, { campo: 'puesto', max: 150 }),
    lugar: texto(req.body.lugar, { campo: 'lugar', max: 150 }),
    tipo: texto(req.body.tipo, { campo: 'tipo', max: 80 }),
  });
  res.json({ ok: true, id });
}));

router.patch('/busquedas/:id', asyncHandler(async (req, res) => {
  const n = await busquedaRepo.update(req.params.id, {
    puesto: texto(req.body.puesto, { campo: 'puesto', max: 150 }),
    lugar: texto(req.body.lugar, { campo: 'lugar', max: 150 }),
    tipo: texto(req.body.tipo, { campo: 'tipo', max: 80 }),
    activa: flag(req.body.activa),
  });
  if (!n) throw notFound();
  res.json({ ok: true });
}));

router.delete('/busquedas/:id', asyncHandler(async (req, res) => {
  if (!(await busquedaRepo.remove(req.params.id))) throw notFound();
  res.json({ ok: true });
}));

/* ---------------- Configuración del sitio ---------------- */
router.get('/config', asyncHandler(async (_req, res) => {
  res.json({ ok: true, config: await configRepo.getAll() });
}));

router.put('/config', asyncHandler(async (req, res) => {
  await configRepo.setMany(req.body || {});
  res.json({ ok: true, config: await configRepo.getAll() });
}));

export default router;
