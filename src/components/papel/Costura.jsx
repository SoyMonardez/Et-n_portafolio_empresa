import { useEffect, useRef } from 'react'
import { alCuadro, conMouse, velocidad } from './desplazamiento.js'

// Bordes de papel entre secciones, dibujados en un canvas cuadro a cuadro.
// El borde es un campo de ruido que se mueve lento (papel que respira) y,
// cerca del mouse, se estira hacia el cursor como si lo tironearas.
//  - variante "rasgada": arriba oscuro, abajo papel claro.
//  - variante "linea": solo el trazo de tinta sobre el papel.

// Ruido de valor 2D suave (sin dependencias).
function azar(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}
function suave(t) { return t * t * (3 - 2 * t) }
function ruido(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y)
  const xf = x - xi, yf = y - yi
  const a = azar(xi, yi), b = azar(xi + 1, yi)
  const c = azar(xi, yi + 1), d = azar(xi + 1, yi + 1)
  const u = suave(xf), v = suave(yf)
  return (a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v) * 2 - 1
}
// Varias octavas: ondas largas + dientes chicos del corte.
function campo(x, t) {
  return ruido(x * 1.6, t) * 0.55 + ruido(x * 5.3, t * 1.7 + 9) * 0.25
    + ruido(x * 17, t * 2.3 + 3) * 0.13 + ruido(x * 61, t * 0.5 + 7) * 0.07
}

const NEGRO = '#0f0e0c'

export function Costura({ variante = 'rasgada' }) {
  const caja = useRef(null)
  const lienzo = useRef(null)

  useEffect(() => {
    const el = caja.current
    const cv = lienzo.current
    const ctx = cv.getContext('2d')
    let ancho = 0, alto = 0, dpr = 1, visible = false
    let tiempo = Math.random() * 50
    const mano = { x: -9999, y: -9999, tiron: 0 }

    const medir = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      ancho = el.clientWidth
      alto = el.clientHeight
      cv.width = Math.round(ancho * dpr)
      cv.height = Math.round(alto * dpr)
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { rootMargin: '50% 0px' })
    io.observe(el)

    const mover = (e) => {
      const r = el.getBoundingClientRect()
      mano.x = e.clientX - r.left
      mano.y = e.clientY - r.top
    }
    if (conMouse()) window.addEventListener('pointermove', mover, { passive: true })

    const dibujar = (dt) => {
      if (!visible || !ancho) return
      tiempo += dt * (0.25 + Math.min(Math.abs(velocidad()) / 40, 1.2))
      const r = el.getBoundingClientRect()
      // El tirón se apaga si el mouse se aleja verticalmente de la costura.
      const cerca = mano.y > -alto && mano.y < alto * 2 ? 1 : 0
      mano.tiron += (cerca - mano.tiron) * Math.min(1, dt * 6)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, ancho, alto)
      const mitad = alto / 2
      const amp = alto * (variante === 'linea' ? 0.18 : 0.26)
      const radio = Math.max(140, ancho * 0.1)
      const pasos = Math.ceil(ancho / 3)
      const puntos = []
      for (let i = 0; i <= pasos; i++) {
        const x = (i / pasos) * ancho
        let y = mitad + campo(x / ancho * 3, tiempo * 0.12) * amp
        const dx = (x - mano.x) / radio
        const cercania = Math.exp(-dx * dx) * mano.tiron
        y += (Math.min(Math.max(mano.y, 0), alto) - y) * cercania * 0.55
        puntos.push(x, y)
      }

      ctx.beginPath()
      ctx.moveTo(0, puntos[1])
      for (let i = 2; i < puntos.length; i += 2) ctx.lineTo(puntos[i], puntos[i + 1])
      if (variante === 'linea') {
        ctx.strokeStyle = NEGRO
        ctx.lineWidth = 2
        ctx.lineJoin = 'round'
        ctx.stroke()
        // Fibras sueltas que cuelgan del trazo donde el ruido es más fuerte.
        ctx.lineWidth = 1
        for (let i = 0; i < puntos.length; i += 14) {
          const n = ruido(puntos[i] * 0.05, tiempo * 0.3)
          if (n < 0.35) continue
          ctx.beginPath()
          ctx.moveTo(puntos[i], puntos[i + 1] + 2)
          ctx.lineTo(puntos[i] + n * 3, puntos[i + 1] + 4 + n * 22)
          ctx.stroke()
        }
      } else {
        ctx.lineTo(ancho, 0)
        ctx.lineTo(0, 0)
        ctx.closePath()
        ctx.fillStyle = NEGRO
        ctx.fill()
        // Pelusa del corte: puntitos de tinta que se escapan hacia el papel.
        ctx.fillStyle = NEGRO
        for (let i = 0; i < puntos.length; i += 6) {
          const n = ruido(puntos[i] * 0.09, 4.2)
          if (n < 0.3) continue
          ctx.fillRect(puntos[i], puntos[i + 1] + 2 + n * 9, 1.4, 1.4 + n * 3)
        }
      }
      if (r.bottom < 0) visible = false
    }
    const quitar = alCuadro(dibujar)
    return () => {
      quitar(); ro.disconnect(); io.disconnect()
      window.removeEventListener('pointermove', mover)
    }
  }, [variante])

  return (
    <div ref={caja} className={`pp-costura pp-costura--${variante}`} aria-hidden="true">
      <canvas ref={lienzo} />
    </div>
  )
}

// Nombres anteriores, usados por otras páginas.
export const CosturaRasgada = () => <Costura variante="rasgada" />
export const CosturaGarabato = () => <Costura variante="linea" />
