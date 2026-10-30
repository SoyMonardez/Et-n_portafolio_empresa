import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import useConfig from '../../hooks/useConfig.js'
import { BotonPapel, TextoRevelado, useVisible } from './Piezas.jsx'
import { ENLACES, Enlace } from './Nav.jsx'
import { alCuadro, limitar } from './desplazamiento.js'

// Pie: el contenido sube a su lugar mientras el pie entra en pantalla, y la
// marca se ajusta exactamente al ancho disponible y aparece letra por letra.
export default function Pie() {
  const cfg = useConfig()
  const interior = useRef(null)
  const [marcaRef, marcaVisible] = useVisible('0px 0px -5% 0px')
  const anio = new Date().getFullYear()

  useEffect(() => {
    const el = interior.current
    return alCuadro(() => {
      const caja = el.parentElement.getBoundingClientRect()
      if (caja.top > window.innerHeight || !caja.height) return
      const p = limitar((window.innerHeight - caja.top) / caja.height)
      el.style.transform = `translate3d(0, ${(-(1 - p) * 50).toFixed(2)}%, 0)`
    })
  }, [])

  // Ajusta el tamaño de la marca para que la tinta ocupe todo el ancho.
  useEffect(() => {
    const el = marcaRef.current
    const ajustar = () => {
      const caja = el.parentElement
      const objetivo = caja.clientWidth
      const css = getComputedStyle(el)
      const base = 100
      const ctx = document.createElement('canvas').getContext('2d')
      ctx.font = `${css.fontWeight} ${base}px ${css.fontFamily}`
      if ('letterSpacing' in ctx) ctx.letterSpacing = `${-0.04 * base}px`
      const m = ctx.measureText(el.textContent)
      const tinta = m.actualBoundingBoxRight + m.actualBoundingBoxLeft
      if (!tinta) return
      // Con una palabra corta, ajustar al ancho la haría enorme: se limita a ~360u.
      const u = Math.min(1.2, Math.max(0.45, window.innerWidth / (window.innerWidth >= 650 ? 1440 : 390)))
      const tam = Math.min((base * objetivo) / tinta, 360 * u)
      el.style.fontSize = `${tam}px`
      el.style.marginLeft = `${(m.actualBoundingBoxLeft * tam) / base}px`
    }
    ajustar()
    document.fonts?.ready.then(ajustar)
    window.addEventListener('resize', ajustar)
    return () => window.removeEventListener('resize', ajustar)
  }, [marcaRef])

  return (
    <footer className="pp-pie">
      <div className="pp-pie__regla" />
      <div ref={interior} className="pp-pie__interior">
        <div className="pp-pie__arriba">
          <div className="pp-pie__grupos">
            <div className="pp-pie__col">
              <TextoRevelado como="span" className="pp-pie__titulo">Navegación</TextoRevelado>
              <div className="pp-pie__links">
                {ENLACES.map((e) => <Enlace key={e.ruta} e={e} />)}
                <Link to="/empleo">Trabajá con nosotros</Link>
              </div>
            </div>
            <div className="pp-pie__col">
              <TextoRevelado como="span" className="pp-pie__titulo">Legal</TextoRevelado>
              <div className="pp-pie__links">
                <Link to="/legal">Privacidad</Link>
                <Link to="/legal">Datos y medición</Link>
              </div>
            </div>
            <div className="pp-pie__col">
              <TextoRevelado como="span" className="pp-pie__titulo">Contacto</TextoRevelado>
              <div className="pp-pie__links">
                {cfg.email && <a href={`mailto:${cfg.email}`}>{cfg.email}</a>}
                {cfg.telefono && <a href={`tel:${cfg.telefono}`}>{cfg.telefono}</a>}
                <span>{cfg.direccion || 'San Juan, Argentina'}</span>
                <Link to="/contacto">Escribinos</Link>
              </div>
            </div>
          </div>
          <div className="pp-pie__derecha">
            <TextoRevelado como="p" className="pp-pie__texto">
              {`${anio} © Etán Construcciones. Demolición, piedra bola, veredas y obra civil en San Juan, desde 2003.`}
            </TextoRevelado>
            <BotonPapel a="/presupuesto" texto="Pedir presupuesto" />
          </div>
        </div>
        <span
          ref={marcaRef}
          className={`pp-pie__marca ${marcaVisible ? 'es-visible' : ''}`}
          aria-label="Etán"
        >
          {'Etán'.split('').map((l, i) => (
            <span key={i} className="pp-pie__letra" aria-hidden="true">
              <span style={{ transitionDelay: `${i * 0.1}s` }}>{l}</span>
            </span>
          ))}
        </span>
      </div>
    </footer>
  )
}
