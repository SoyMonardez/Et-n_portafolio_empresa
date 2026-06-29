import { pool } from '../config/db.js';

export const configRepo = {
  async getAll() {
    const { rows } = await pool.query('SELECT clave, valor FROM site_config');
    return Object.fromEntries(rows.map((r) => [r.clave, r.valor ?? '']));
  },

  // Guarda varios pares clave/valor. Solo se aceptan claves ya existentes
  // (se siembran en schema.sql), así nadie inventa claves desde el form.
  async setMany(pares) {
    const entradas = Object.entries(pares);
    for (const [clave, valor] of entradas) {
      await pool.query(
        `UPDATE site_config SET valor = $1 WHERE clave = $2`,
        [String(valor ?? '').slice(0, 500), clave]
      );
    }
  },
};
