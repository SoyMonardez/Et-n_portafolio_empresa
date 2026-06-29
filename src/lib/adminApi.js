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
