import Lenis from 'lenis'

// Motor de la landing: un único requestAnimationFrame que mueve Lenis
// (scroll suave, solo con mouse) y después llama a cada sección suscrita.
// Las secciones leen el scroll con `scrollY()` y reciben `dt` en segundos.

let lenis = null
let raf = 0
let previo = 0
const cuadros = new Set()

export const conMouse = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

const reducido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const scrollY = () => (lenis ? lenis.scroll : window.scrollY)
export const velocidad = () => (lenis ? lenis.velocity : 0)

// Curva "snappy": arranque rápido y frenado largo.
export const snappy = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 4)
export const expo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))
export const limitar = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))

export function iniciarDesplazamiento() {
  if (raf) return
  if (conMouse() && !reducido()) lenis = new Lenis({ lerp: 0.11 })
  document.documentElement.classList.add(conMouse() ? 'pp-mouse' : 'pp-tactil')

  const cuadro = (t) => {
    raf = requestAnimationFrame(cuadro)
    const dt = previo ? Math.min((t - previo) / 1000, 1 / 15) : 1 / 60
    previo = t
    lenis?.raf(t)
    cuadros.forEach((fn) => fn(dt))
  }
  raf = requestAnimationFrame(cuadro)
}

export function detenerDesplazamiento() {
  cancelAnimationFrame(raf)
  raf = 0
  previo = 0
  lenis?.destroy()
  lenis = null
}

// Llama a `fn(dt)` en cada cuadro. Devuelve la función para desuscribirse.
export function alCuadro(fn) {
  cuadros.add(fn)
  return () => cuadros.delete(fn)
}

// Compatibilidad: secciones simples que solo necesitan reaccionar al scroll.
export function alDesplazar(fn) {
  let ultimo = NaN
  return alCuadro(() => {
    const y = scrollY()
    if (y === ultimo) return
    ultimo = y
    fn(y)
  })
}

export function arriba() {
  if (lenis) {
    lenis.scrollTo(0, { immediate: true, force: true })
    lenis.resize()
  } else {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
}

export function irA(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 1, easing: snappy })
  else el.scrollIntoView({ behavior: 'smooth' })
}

// Progreso de 0 a 1 de un elemento mientras cruza la ventana.
export function progreso(el, desde = 1, hasta = 0) {
  const r = el.getBoundingClientRect()
  const vh = window.innerHeight
  const inicio = vh * desde
  const fin = vh * hasta - r.height
  return limitar((inicio - r.top) / (inicio - fin))
}

// Resorte críticamente amortiguado (sin rebote), para seguir valores suave.
export function resorte(inicial = 0, respuesta = 0.4) {
  const w = (2 * Math.PI) / respuesta
  const r = { valor: inicial, vel: 0, meta: inicial }
  r.paso = (dt) => {
    const x = r.valor - r.meta
    const a = -w * w * x - 2 * w * r.vel
    r.vel += a * dt
    r.valor += r.vel * dt
    if (Math.abs(r.vel) < 1e-4 && Math.abs(r.valor - r.meta) < 1e-4) {
      r.valor = r.meta
      r.vel = 0
    }
    return r.valor
  }
  return r
}
