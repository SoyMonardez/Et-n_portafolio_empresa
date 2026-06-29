import { pool } from '../config/db.js';
import { notFound, badRequest } from '../utils/httpError.js';

// Tablas de las 4 bandejas, con su columna de fecha (difiere entre ellas).
const TABLAS = {
  presupuestos: 'created_at',
  contactos: 'created_at',
  alquiler_solicitudes: 'created_at',
  postulaciones: 'created_at',
};

const ESTADOS_VALIDOS = ['nuevo', 'atendido'];

// `tabla` siempre viene de una lista fija en el código (nunca del usuario),
// así que interpolarla en la query es seguro acá.
export async function actualizarEstado(tabla, id, estado) {
  if (!TABLAS[tabla]) throw notFound();
  if (!ESTADOS_VALIDOS.includes(estado)) throw badRequest('Estado inválido');

  const { rowCount } = await pool.query(
    `UPDATE ${tabla} SET estado = $1 WHERE id = $2`,
    [estado, id]
  );
  if (rowCount === 0) throw notFound();
}
