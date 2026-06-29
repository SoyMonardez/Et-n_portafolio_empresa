import { pool } from '../config/db.js';

export const busquedaRepo = {
  async findPublicas() {
    const { rows } = await pool.query(
      'SELECT id, puesto, lugar, tipo FROM busquedas WHERE activa = true ORDER BY id DESC'
    );
    return rows;
  },

  async findAll() {
    const { rows } = await pool.query('SELECT * FROM busquedas ORDER BY id DESC');
    return rows;
  },

  async create({ puesto, lugar, tipo }) {
    const { rows } = await pool.query(
      'INSERT INTO busquedas (puesto, lugar, tipo) VALUES ($1, $2, $3) RETURNING id',
      [puesto, lugar, tipo]
    );
    return rows[0].id;
  },

  async update(id, { puesto, lugar, tipo, activa }) {
    const { rowCount } = await pool.query(
      'UPDATE busquedas SET puesto = $1, lugar = $2, tipo = $3, activa = $4 WHERE id = $5',
      [puesto, lugar, tipo, activa, id]
    );
    return rowCount;
  },

  async remove(id) {
    const { rowCount } = await pool.query('DELETE FROM busquedas WHERE id = $1', [id]);
    return rowCount;
  },
};
