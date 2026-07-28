import { useEffect, useRef } from 'react'
import { useIdioma } from '../../context/IdiomaContext.jsx'

const CLAVE_CACHE = 'etan-traducciones'
const IGNORAR_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT'])

function cargarCache() {
  try {
    return new Map(JSON.parse(localStorage.getItem(CLAVE_CACHE) || '[]'))
  } catch {
    return new Map()
  }
}

function guardarCache(cache) {
  try {
    localStorage.setItem(CLAVE_CACHE, JSON.stringify([...cache.entries()].slice(-800)))
  } catch {
    /* localStorage lleno o bloqueado: no afecta el funcionamiento */
  }
}

function recolectarNodos(raiz) {
  const nodos = []
  const walker = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, {
    acceptNode(nodo) {
      if (!nodo.nodeValue || !nodo.nodeValue.trim()) return NodeFilter.FILTER_REJECT
      const padre = nodo.parentElement
      if (!padre || IGNORAR_TAGS.has(padre.tagName)) return NodeFilter.FILTER_REJECT
      if (padre.closest('[data-no-traducir]')) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })
  let n
  while ((n = walker.nextNode())) nodos.push(n)
  return nodos
}

// Traduce el sitio público al vuelo, sin tocar cada texto de cada página:
// recorre los nodos de texto ya renderizados, pide al backend lo que no
// tenga en caché (el backend a su vez cachea en la base) y reemplaza el
// contenido. Si algo falla, el texto se queda en español: nunca rompe nada.
export default function Traductor() {
  const { idioma } = useIdioma()
  const cacheRef = useRef(null)
  if (!cacheRef.current) cacheRef.current = cargarCache()
  const originalesRef = useRef(new WeakMap())

  useEffect(() => {
    const raiz = document.getElementById('root')
    if (!raiz) return

    if (idioma !== 'en') {
      // Volvemos a español: restauramos lo que habíamos traducido.
      for (const nodo of recolectarNodos(raiz)) {
        const original = originalesRef.current.get(nodo)
        if (original !== undefined) nodo.nodeValue = original
      }
      return
    }

    const procesados = new WeakSet()
    let enVuelo = false
    let pendiente = false
    let temporizador = null

    async function traducirPendientes() {
      if (enVuelo) {
        pendiente = true
        return
      }
      enVuelo = true
      try {
        const nodos = recolectarNodos(raiz).filter((n) => !procesados.has(n))
        if (!nodos.length) return

        const faltan = new Set()
        for (const nodo of nodos) {
          const clave = nodo.nodeValue.trim()
          if (!cacheRef.current.has(clave)) faltan.add(clave)
        }

        if (faltan.size) {
          const lista = [...faltan]
          try {
            const res = await fetch('/api/ia/traducir-lote', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ textos: lista }),
            })
            if (res.ok) {
              const data = await res.json()
              lista.forEach((texto, i) => {
                const traducido = data.traducciones?.[i]
                if (traducido) cacheRef.current.set(texto, traducido)
              })
              guardarCache(cacheRef.current)
            }
          } catch {
            /* sin conexión a la IA: dejamos el texto original */
          }
        }

        for (const nodo of nodos) {
          const original = nodo.nodeValue
          const traducido = cacheRef.current.get(original.trim())
          if (traducido && traducido !== original.trim()) {
            if (!originalesRef.current.has(nodo)) originalesRef.current.set(nodo, original)
            // Conservamos los espacios de borde originales para no pegar
            // palabras de nodos de texto vecinos (ej. antes de un <em>).
            const prefijo = original.match(/^\s*/)[0]
            const sufijo = original.match(/\s*$/)[0]
            nodo.nodeValue = prefijo + traducido + sufijo
          }
          procesados.add(nodo)
        }
      } finally {
        enVuelo = false
        if (pendiente) {
          pendiente = false
          traducirPendientes()
        }
      }
    }

    function programar() {
      clearTimeout(temporizador)
      temporizador = setTimeout(traducirPendientes, 150)
    }

    programar()
    const observer = new MutationObserver(programar)
    observer.observe(raiz, { childList: true, subtree: true, characterData: true })

    return () => {
      observer.disconnect()
      clearTimeout(temporizador)
    }
  }, [idioma])

  return null
}
