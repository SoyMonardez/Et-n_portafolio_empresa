import { useEffect, useState } from 'react'
import { obtenerConfig } from '../lib/api.js'

// Cache a nivel de módulo para no pedir la config en cada componente.
let cache = null
let pendiente = null

function cargar() {
  if (cache) return Promise.resolve(cache)
  if (!pendiente) {
    pendiente = obtenerConfig().then((c) => {
      cache = c || {}
      return cache
    })
  }
  return pendiente
}

// Devuelve los datos de contacto y redes administrables desde el panel.
// Empieza vacío y se completa cuando responde el backend.
export default function useConfig() {
  const [config, setConfig] = useState(cache || {})
  useEffect(() => {
    let vivo = true
    cargar().then((c) => { if (vivo) setConfig(c) })
    return () => { vivo = false }
  }, [])
  return config
}
