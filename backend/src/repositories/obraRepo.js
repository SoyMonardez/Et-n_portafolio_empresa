import { pool } from '../config/db.js';

export const obraRepo = {
  async findPublicas() {
    const { rows } = await pool.query(
      'SELECT id, titulo, categoria, lugar, anio, imagen_url FROM obras WHERE publicada = true ORDER BY id DESC'
    );
    return rows;
  },

  async findAll() {
    const { rows } = await pool.query('SELECT * FROM obras ORDER BY id DESC');
    return rows;
  },

  async create({ titulo, categoria, lugar, anio, imagenUrl }) {
    const { rows } = await pool.query(
      `INSERT INTO obras (titulo, categoria, lugar, anio, imagen_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [titulo, categoria, lugar, anio || null, imagenUrl || null]
    );
    return rows[0].id;
  },

  async update(id, { titulo, categoria, lugar, anio, imagenUrl, publicada }) {
    const { rowCount } = await pool.query(
      `UPDATE obras SET
         titulo = $1, categoria = $2, lugar = $3, anio = $4,
         imagen_url = COALESCE($5, imagen_url),
         publicada = $6
       WHERE id = $7`,
      [titulo, categoria, lugar, anio || null, imagenUrl, publicada, id]
    );
    return rowCount;
  },

  async remove(id) {
    const { rowCount } = await pool.query('DELETE FROM obras WHERE id = $1', [id]);
    return rowCount;
  },
};
