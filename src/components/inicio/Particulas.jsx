import { useEffect, useRef } from 'react'

// Polvo en suspensión: partículas livianas en canvas para dar atmósfera
// al hero. Se desactiva si el visitante prefiere menos movimiento y se
// pausa cuando no está en pantalla (rendimiento).
export default function Particulas({ className }) {
  const ref = useRef(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let raf
    let activo = true
    let ancho = 0
    let alto = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    // Menos partículas en celular para no afectar el rendimiento.
    const cantidad = window.innerWidth < 768 ? 26 : 54
    let particulas = []

    function medir() {
      ancho = canvas.offsetWidth
      alto = canvas.offsetHeight
      canvas.width = ancho * dpr
      canvas.height = alto * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function crear() {
      particulas = Array.from({ length: cantidad }, () => ({
        x: Math.random() * ancho,
        y: Math.random() * alto,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(Math.random() * 0.35 + 0.08),
        a: Math.random() * 0.5 + 0.1,
      }))
    }

    function dibujar() {
      ctx.clearRect(0, 0, ancho, alto)
      for (const p of particulas) {
        p.x += p.vx
        p.y += p.vy
        if (p.y < -5) {
          p.y = alto + 5
          p.x = Math.random() * ancho
        }
        if (p.x < -5) p.x = ancho + 5
        if (p.x > ancho + 5) p.x = -5
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(242, 167, 27, ${p.a})`
        ctx.fill()
      }
      if (activo) raf = requestAnimationFrame(dibujar)
    }

    medir()
    crear()
    dibujar()

    const onResize = () => {
      medir()
      crear()
    }
    window.addEventListener('resize', onResize)

    // Pausar cuando el hero sale de pantalla.
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !activo) {
          activo = true
          dibujar()
        } else if (!e.isIntersecting) {
          activo = false
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0 },
    )
    io.observe(canvas)

    return () => {
      activo = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      io.disconnect()
    }
  }, [])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
