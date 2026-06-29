import 'dotenv/config';

const num = (v, def) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
};

// El JWT_SECRET es lo único que separa a un atacante de firmar sus propios
// tokens de admin. Si falta o es el placeholder, no levantamos en
// producción — fail fast antes de exponer el panel.
{
  const secret = process.env.JWT_SECRET || '';
  const esDebil = secret.length < 32 || /cambiar|change|secret|placeholder|example/i.test(secret);
  if (esDebil) {
    const msg = '[env] JWT_SECRET falta, es débil o es el placeholder. Generá uno con: '
      + 'node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"';
    if (process.env.NODE_ENV === 'production') {
      console.error(msg);
      process.exit(1);
    }
    console.warn(msg + ' (permitido solo en desarrollo)');
  }
}

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

  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-no-usar-en-produccion-cambiar-esto',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // IA (Groq/Llama). El token vive solo acá en el server; el navegador
  // nunca lo ve, habla con nuestro backend que hace de proxy.
  groq: {
    apiKey: process.env.GROQ_API_KEY || '',
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  },
});
