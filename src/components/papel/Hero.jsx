import { useEffect, useRef } from 'react'
import { alCuadro, conMouse, resorte } from './desplazamiento.js'

// Portada: el bloque negro y la marca gigante.
// - El bloque es solo el punto de partida: con mouse, el panel de obras
//   (fijo) se dibuja encima y crece desde acá al scrollear.
// - La marca se "corre como tinta" cuando el mouse pasa rápido por encima
//   (filtro SVG de desplazamiento cuya fuerza sigue a la velocidad del mouse).
export default function Hero({ bloqueRef }) {
  const seccion = useRef(null)
  const titulo = useRef(null)
  const ruido = useRef(null)
  const mapa = useRef(null)

  useEffect(() => {
    if (!conMouse()) return
    const fuerza = resorte(0, 0.5)
    let ultimo = null
    let tiempo = 0

    const mover = (e) => {
      const ahora = performance.now()
      if (ultimo) {
        const dt = Math.max(1, ahora - ultimo.t)
        const v = Math.hypot(e.clientX - ultimo.x, e.clientY - ultimo.y) / dt
        fuerza.meta = Math.min(1, v / 2.5)
      }
      ultimo = { x: e.clientX, y: e.clientY, t: ahora }
    }
    const el = seccion.current
    el.addEventListener('pointermove', mover)

    const quitar = alCuadro((dt) => {
      fuerza.meta *= Math.pow(0.02, dt) // se calma solo si el mouse frena
      const f = fuerza.paso(dt)
      tiempo += dt
      const t = titulo.current
      if (f < 0.004) {
        if (t.style.filter) t.style.filter = ''
        return
      }
      if (!t.style.filter) t.style.filter = 'url(#pp-tinta)'
      mapa.current.setAttribute('scale', (f * 36).toFixed(2))
      const a = 0.008 + Math.sin(tiempo * 0.7) * 0.002
      ruido.current.setAttribute('baseFrequency', `${a.toFixed(4)} ${(a * 2.6).toFixed(4)}`)
    })
    return () => { quitar(); el.removeEventListener('pointermove', mover) }
  }, [])

  return (
    <section ref={seccion} className="pp-hero pp-hero--inicio">
      <div className="pp-hero__centro">
        <div ref={bloqueRef} className="pp-hero__bloque" aria-hidden="true" />
        <h1 ref={titulo} className="pp-hero__titulo">Etán</h1>
      </div>
      <svg className="pp-oculto" aria-hidden="true">
        <filter id="pp-tinta" x="-10%" y="-20%" width="120%" height="140%">
          <feTurbulence ref={ruido} type="fractalNoise" baseFrequency="0.008 0.02" numOctaves="2" seed="4" />
          <feDisplacementMap ref={mapa} in="SourceGraphic" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </section>
  )
}
