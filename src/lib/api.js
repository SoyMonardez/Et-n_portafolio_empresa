// Helper de llamadas al backend. En dev, Vite proxea /api al backend (ver
// vite.config.js); en producción, Nginx hace el mismo proxy.
const BASE = '/api';

async function manejarRespuesta(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'No pudimos enviar el formulario');
  return data;
}

export async function enviarPresupuesto(datos) {
  const res = await fetch(`${BASE}/presupuestos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  return manejarRespuesta(res);
}

export async function enviarContacto(datos) {
  const res = await fetch(`${BASE}/contacto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  return manejarRespuesta(res);
}

export async function enviarAlquiler(datos) {
  const res = await fetch(`${BASE}/alquiler`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  return manejarRespuesta(res);
}

export async function enviarPostulacion(formData) {
  const res = await fetch(`${BASE}/postulaciones`, {
    method: 'POST',
    body: formData,
  });
  return manejarRespuesta(res);
}

// --- Contenido público (gestionado desde el admin) ---
// Si el backend no responde, se devuelve null para que la página use su
// contenido por defecto y nunca quede en blanco.
async function getContenido(ruta) {
  try {
    const res = await fetch(`${BASE}/contenido/${ruta}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function obtenerMaquinas() {
  return (await getContenido('maquinas'))?.items ?? null;
}

export async function obtenerObras() {
  return (await getContenido('obras'))?.items ?? null;
}

export async function obtenerBusquedas() {
  return (await getContenido('busquedas'))?.items ?? null;
}

export async function obtenerConfig() {
  return (await getContenido('config'))?.config ?? null;
}

// Registra una visita (beacon). "Fire and forget": no esperamos respuesta
// ni rompemos nada si falla. Se usa keepalive para que llegue aunque el
// usuario navegue enseguida.
export function registrarVisita(datos) {
  try {
    fetch(`${BASE}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
      keepalive: true,
    }).catch(() => {});
  } catch { /* ignorar */ }
}
