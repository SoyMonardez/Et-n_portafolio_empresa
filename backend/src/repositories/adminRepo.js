import { pool } from '../config/db.js';

export const adminRepo = {
  async findByUsuario(usuario) {
    const { rows } = await pool.query(
      'SELECT id, usuario, password_hash FROM admin_users WHERE usuario = $1 LIMIT 1',
      [usuario]
    );
    return rows[0] || null;
  },

  async crear(usuario, passwordHash) {
    const { rows } = await pool.query(
      `INSERT INTO admin_users (usuario, password_hash) VALUES ($1, $2)
       ON CONFLICT (usuario) DO UPDATE SET password_hash = EXCLUDED.password_hash
       RETURNING id`,
      [usuario, passwordHash]
    );
    return rows[0].id;
  },
};
