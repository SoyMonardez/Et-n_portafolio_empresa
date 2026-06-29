import { pool } from '../config/db.js';

export const alquilerRepo = {
  async create({ maquinaNombre, nombre, telefono, email, mensaje }) {
    const { rows } = await pool.query(
      `INSERT INTO alquiler_solicitudes (maquina_nombre, nombre, telefono, email, mensaje)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [maquinaNombre, nombre, telefono, email || null, mensaje || null]
    );
    return rows[0].id;
  },

  async findAll() {
    const { rows } = await pool.query('SELECT * FROM alquiler_solicitudes ORDER BY created_at DESC');
    return rows;
  },
};
