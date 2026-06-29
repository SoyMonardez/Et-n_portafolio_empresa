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
