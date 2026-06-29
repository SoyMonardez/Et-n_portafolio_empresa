import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'node:path';

import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

import presupuestosRouter from './routes/presupuestos.js';
import contactoRouter from './routes/contacto.js';
import alquilerRouter from './routes/alquiler.js';
import postulacionesRouter from './routes/postulaciones.js';

export function buildApp() {
  const app = express();
  app.set('trust proxy', 1);

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  app.use(cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (env.corsOrigins.includes('*')) return cb(null, true);
      if (env.corsOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origen no permitido (${origin})`));
    },
  }));

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Sirve los CV subidos. En producción Nginx puede servirlos directo desde
  // el volumen, pero esto alcanza para dev y para mantenerlo simple.
  const uploadAbs = path.resolve(process.cwd(), env.upload.dir);
  app.use('/uploads', express.static(uploadAbs));

  app.get('/health', (_req, res) => res.json({ ok: true, env: env.nodeEnv }));

  app.use('/presupuestos', presupuestosRouter);
  app.use('/contacto', contactoRouter);
  app.use('/alquiler', alquilerRouter);
  app.use('/postulaciones', postulacionesRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
