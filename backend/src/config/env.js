import 'dotenv/config';

const num = (v, def) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
};

export const env = Object.freeze({
  port: num(process.env.PORT, 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',

  // Todas las rutas actuales son formularios públicos (sin datos sensibles
  // de vuelta ni sesión), así que no hay nada que el CORS proteja todavía.
  // Además, los navegadores mandan el header Origin incluso en POST
  // mismo-origen vía el proxy de Nginx, así que restringir acá bloquearía
  // al propio frontend. Cuando haya endpoints de admin con auth, se
  // restringe con CORS_ORIGINS.
  corsOrigins: (process.env.CORS_ORIGINS || '*')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  db: {
    host: process.env.PGHOST || 'localhost',
    port: num(process.env.PGPORT, 5432),
    user: process.env.PGUSER || 'etan',
    password: process.env.PGPASSWORD || '',
    database: process.env.PGDATABASE || 'etan',
  },

  upload: {
    dir: process.env.UPLOAD_DIR || './uploads',
    maxBytes: num(process.env.UPLOAD_MAX_MB, 5) * 1024 * 1024,
  },

  rateLimit: {
    contactMax: num(process.env.CONTACT_RATE_MAX, 5),
    contactWindowMin: num(process.env.CONTACT_RATE_WINDOW_MIN, 60),
  },
});
