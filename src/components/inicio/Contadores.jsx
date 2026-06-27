import { useEffect, useRef, useState } from 'react'

const DATOS = [
  { fin: 20, sufijo: '+', etiqueta: 'años de trayectoria' },
  { fin: 150, sufijo: 'mil m²', etiqueta: 'construidos y demolidos' },
  { fin: 50, sufijo: '', etiqueta: 'personas en el equipo' },
  { fin: 4, sufijo: '+', etiqueta: 'municipios atendidos' },
]

function useContador(fin, arrancar) {
  const [valor, setValor] = useState(0)
  useEffect(() => {
    if (!arrancar) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setValor(fin)
      return
    }
    let raf
    const dur = 1400
    const t0 = performance.now()
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setValor(Math.round(fin * ease))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [fin, arrancar])
  return valor
}

function Contador({ fin, sufijo, etiqueta, arrancar }) {
  const valor = useContador(fin, arrancar)
  return (
    <div className="contador">
      <span className="contador__numero">
        {valor}
        <span className="contador__sufijo">{sufijo}</span>
      </span>
      <span className="contador__etiqueta">{etiqueta}</span>
    </div>
  )
}

export default function Contadores() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <section className="contadores" ref={ref}>
      <div className="contenedor contadores__grid">
        {DATOS.map((d) => (
          <Contador key={d.etiqueta} {...d} arrancar={visible} />
        ))}
      </div>
    </section>
  )
}
