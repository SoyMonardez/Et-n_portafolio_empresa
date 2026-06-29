import { pool } from '../config/db.js';

export const visitaRepo = {
  async create(v) {
    await pool.query(
      `INSERT INTO visitas
        (path, referrer, utm_source, utm_medium, utm_campaign, device, browser, country, region, session_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [v.path, v.referrer, v.utmSource, v.utmMedium, v.utmCampaign,
       v.device, v.browser, v.country, v.region, v.sessionId]
    );
  },

  // Todas las métricas del período (últimos N días), en una sola pasada de
  // consultas. `dias` se valida antes (entero), así que es seguro.
  async resumen(dias) {
    const desde = `now() - interval '${dias} days'`;

    const porDia = (await pool.query(
      `SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS dia,
              COUNT(*)::int AS visitas,
              COUNT(DISTINCT session_id)::int AS unicos
       FROM visitas WHERE created_at >= ${desde}
       GROUP BY 1 ORDER BY 1`
    )).rows;

    const topPaginas = (await pool.query(
      `SELECT path, COUNT(*)::int AS total
       FROM visitas WHERE created_at >= ${desde}
       GROUP BY path ORDER BY total DESC LIMIT 8`
    )).rows;

    const dispositivos = (await pool.query(
      `SELECT COALESCE(device, 'desconocido') AS device, COUNT(*)::int AS total
       FROM visitas WHERE created_at >= ${desde}
       GROUP BY 1 ORDER BY total DESC`
    )).rows;

    const paises = (await pool.query(
      `SELECT COALESCE(country, 'desconocido') AS country, COUNT(*)::int AS total
       FROM visitas WHERE created_at >= ${desde}
       GROUP BY 1 ORDER BY total DESC LIMIT 8`
    )).rows;

    // Clasificación de la fuente de tráfico a partir del referrer/UTM.
    const fuentes = (await pool.query(
      `SELECT
         CASE
           WHEN utm_source IS NOT NULL AND utm_source <> '' THEN 'Campaña'
           WHEN referrer IS NULL OR referrer = '' THEN 'Directo'
           WHEN referrer ~* '(google|bing|yahoo|duckduckgo|ecosia)' THEN 'Buscadores'
           WHEN referrer ~* '(instagram|facebook|fb\\.|t\\.co|twitter|x\\.com|linkedin|tiktok|whatsapp|youtube)' THEN 'Redes sociales'
           ELSE 'Otros sitios'
         END AS fuente,
         COUNT(*)::int AS total
       FROM visitas WHERE created_at >= ${desde}
       GROUP BY 1 ORDER BY total DESC`
    )).rows;

    const totales = (await pool.query(
      `SELECT COUNT(*)::int AS visitas, COUNT(DISTINCT session_id)::int AS unicos
       FROM visitas WHERE created_at >= ${desde}`
    )).rows[0];

    return { porDia, topPaginas, dispositivos, paises, fuentes, totales };
  },

  async conversiones(dias) {
    const desde = `now() - interval '${dias} days'`;
    const contar = async (tabla) =>
      (await pool.query(`SELECT COUNT(*)::int AS n FROM ${tabla} WHERE created_at >= ${desde}`)).rows[0].n;
    return {
      presupuestos: await contar('presupuestos'),
      contactos: await contar('contactos'),
      alquiler: await contar('alquiler_solicitudes'),
      postulaciones: await contar('postulaciones'),
    };
  },
};
