import { Pool } from 'pg';
import { env } from './env.js';

// Pool de conexiones a PostgreSQL — único en toda la app.
export const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  max: 10,
});

export async function pingDb() {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
  } finally {
    client.release();
  }
}
