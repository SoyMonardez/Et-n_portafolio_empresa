import { pool } from '../config/db.js';

export const presupuestoRepo = {
  async create({ servicio, ubicacion, nombre, telefono, email, descripcion }) {
    const { rows } = await pool.query(
      `INSERT INTO presupuestos (servicio, ubicacion, nombre, telefono, email, descripcion)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [servicio, ubicacion, nombre, telefono, email || null, descripcion]
    );
    return rows[0].id;
  },

  async findAll() {
    const { rows } = await pool.query('SELECT * FROM presupuestos ORDER BY created_at DESC');
    return rows;
  },
};
