import { pool } from '../config/db.js';

export const adminRepo = {
  async findByEmail(email) {
    const { rows } = await pool.query(
      'SELECT id, email, password_hash FROM admin_users WHERE email = $1 LIMIT 1',
      [email]
    );
    return rows[0] || null;
  },

  async crear(email, passwordHash) {
    const { rows } = await pool.query(
      `INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
       RETURNING id`,
      [email, passwordHash]
    );
    return rows[0].id;
  },
};
