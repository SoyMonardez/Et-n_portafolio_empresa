import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { registrarVisita } from '../../lib/api.js'

const CLAVE_COOKIES = 'etan-cookies'
const CLAVE_SESION = 'etan-sesion'

// Id de sesión anónimo (solo para contar visitantes únicos, sin datos personales).
function obtenerSesion() {
  let id = sessionStorage.getItem(CLAVE_SESION)
  if (!id) {
    id = (crypto.randomUUID?.() || String(Date.now() + Math.random())).slice(0, 64)
    sessionStorage.setItem(CLAVE_SESION, id)
  }
  return id
}

// Mide las visitas de cada página, solo si el usuario aceptó las cookies.
// No usa cookies de terceros ni guarda datos personales.
export default function Analitica() {
  const location = useLocation()
  const anterior = useRef(null)

  useEffect(() => {
    if (localStorage.getItem(CLAVE_COOKIES) !== 'aceptadas') return
    // Evita registrar dos veces la misma ruta seguida (StrictMode / remounts).
    if (anterior.current === location.pathname + location.search) return
    anterior.current = location.pathname + location.search

    const params = new URLSearchParams(location.search)
    registrarVisita({
      path: location.pathname,
      referrer: document.referrer || '',
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      session_id: obtenerSesion(),
    })
  }, [location])

  return null
}
