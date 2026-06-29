import { pool } from '../config/db.js';

export const maquinaRepo = {
  async findPublicas() {
    const { rows } = await pool.query(
      'SELECT id, nombre, categoria, detalle, imagen_url FROM maquinas WHERE activa = true ORDER BY id'
    );
    return rows;
  },

  async findAll() {
    const { rows } = await pool.query('SELECT * FROM maquinas ORDER BY id');
    return rows;
  },

  async create({ nombre, categoria, detalle, imagenUrl }) {
    const { rows } = await pool.query(
      `INSERT INTO maquinas (nombre, categoria, detalle, imagen_url)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [nombre, categoria, detalle || null, imagenUrl || null]
    );
    return rows[0].id;
  },

  async update(id, { nombre, categoria, detalle, imagenUrl, activa }) {
    // Si imagenUrl es null no se pisa la imagen existente (COALESCE).
    const { rowCount } = await pool.query(
      `UPDATE maquinas SET
         nombre = $1, categoria = $2, detalle = $3,
         imagen_url = COALESCE($4, imagen_url),
         activa = $5
       WHERE id = $6`,
      [nombre, categoria, detalle || null, imagenUrl, activa, id]
    );
    return rowCount;
  },

  async remove(id) {
    const { rowCount } = await pool.query('DELETE FROM maquinas WHERE id = $1', [id]);
    return rowCount;
  },
};
