const BASE = '/api'
const CLAVE_TOKEN = 'etan-admin-token'

export function getToken() {
  return localStorage.getItem(CLAVE_TOKEN)
}

export function setToken(token) {
  localStorage.setItem(CLAVE_TOKEN, token)
}

export function limpiarToken() {
  localStorage.removeItem(CLAVE_TOKEN)
}

async function manejar(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Error al comunicarse con el servidor')
  return data
}

export async function login(usuario, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, password }),
  })
  return manejar(res)
}

function conAuth() {
  return { Authorization: `Bearer ${getToken()}` }
}

export async function obtenerResumen() {
  const res = await fetch(`${BASE}/admin/resumen`, { headers: conAuth() })
  return manejar(res)
}

export async function obtenerBandeja(nombre) {
  const res = await fetch(`${BASE}/admin/${nombre}`, { headers: conAuth() })
  return manejar(res)
}

export async function actualizarEstado(nombre, id, estado) {
  const res = await fetch(`${BASE}/admin/${nombre}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...conAuth() },
    body: JSON.stringify({ estado }),
  })
  return manejar(res)
}

// --- Gestión de contenido (maquinaria, obras, búsquedas, config) ---
const C = `${BASE}/admin-contenido`

export async function listarContenido(tipo) {
  const res = await fetch(`${C}/${tipo}`, { headers: conAuth() })
  return manejar(res)
}

// Crea/edita usando FormData (soporta subir imagen en el mismo envío).
export async function guardarContenido(tipo, id, formData) {
  const url = id ? `${C}/${tipo}/${id}` : `${C}/${tipo}`
  const res = await fetch(url, {
    method: id ? 'PATCH' : 'POST',
    headers: conAuth(),
    body: formData,
  })
  return manejar(res)
}

export async function borrarContenido(tipo, id) {
  const res = await fetch(`${C}/${tipo}/${id}`, { method: 'DELETE', headers: conAuth() })
  return manejar(res)
}

export async function obtenerConfigAdmin() {
  const res = await fetch(`${C}/config`, { headers: conAuth() })
  return manejar(res)
}

export async function guardarConfig(config) {
  const res = await fetch(`${C}/config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...conAuth() },
    body: JSON.stringify(config),
  })
  return manejar(res)
}
