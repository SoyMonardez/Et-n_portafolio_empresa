import { pool } from '../config/db.js';

export const contactoRepo = {
  async create({ nombre, email, telefono, mensaje }) {
    const { rows } = await pool.query(
      `INSERT INTO contactos (nombre, email, telefono, mensaje)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [nombre, email, telefono || null, mensaje]
    );
    return rows[0].id;
  },

  async findAll() {
    const { rows } = await pool.query('SELECT * FROM contactos ORDER BY created_at DESC');
    return rows;
  },
};
