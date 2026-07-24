import { createHash } from 'node:crypto';
import { pool } from '../config/db.js';

function hashDe(texto) {
  return createHash('md5').update(texto).digest('hex');
}

export const traduccionRepo = {
  hashDe,

  // Devuelve un Map texto_hash -> texto_traducido para los hashes pedidos.
  async buscarVarias(idioma, hashes) {
    if (!hashes.length) return new Map();
    const { rows } = await pool.query(
      `SELECT texto_hash, texto_traducido FROM traducciones
       WHERE idioma = $1 AND texto_hash = ANY($2::text[])`,
      [idioma, hashes]
    );
    return new Map(rows.map((r) => [r.texto_hash, r.texto_traducido]));
  },

  // Guarda traducciones nuevas. Si dos pedidos llegan en paralelo con el
  // mismo texto, el segundo simplemente no pisa nada (ON CONFLICT).
  async guardarVarias(idioma, items) {
    if (!items.length) return;
    const valores = [];
    const params = [];
    items.forEach((item, i) => {
      const base = i * 4;
      valores.push(`($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`);
      params.push(idioma, hashDe(item.original), item.original.slice(0, 4000), item.traducido);
    });
    await pool.query(
      `INSERT INTO traducciones (idioma, texto_hash, texto_original, texto_traducido)
       VALUES ${valores.join(', ')}
       ON CONFLICT (idioma, texto_hash) DO NOTHING`,
      params
    );
  },
};
