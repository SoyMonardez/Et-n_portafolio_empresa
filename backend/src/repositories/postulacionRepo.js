import { pool } from '../config/db.js';

export const postulacionRepo = {
  async create({ nombre, telefono, email, puesto, mensaje, cvPath }) {
    const { rows } = await pool.query(
      `INSERT INTO postulaciones (nombre, telefono, email, puesto, mensaje, cv_path)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [nombre, telefono, email, puesto || null, mensaje || null, cvPath]
    );
    return rows[0].id;
  },

  async findAll() {
    const { rows } = await pool.query('SELECT * FROM postulaciones ORDER BY created_at DESC');
    return rows;
  },
};
