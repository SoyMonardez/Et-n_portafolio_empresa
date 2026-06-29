import { env } from './config/env.js';
import { buildApp } from './app.js';
import { pingDb } from './config/db.js';

const app = buildApp();

try {
  await pingDb();
  console.log(`[backend] DB OK (${env.db.host}/${env.db.database})`);
} catch (err) {
  console.error('[backend] No se pudo conectar a PostgreSQL:', err.message);
  process.exit(1);
}

app.listen(env.port, () => {
  console.log(`[backend] escuchando en http://localhost:${env.port} (${env.nodeEnv})`);
});
