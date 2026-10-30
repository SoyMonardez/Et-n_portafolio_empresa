import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { alCuadro } from './desplazamiento.js'

// Piezas chicas que se repiten en todo el sitio.

// Botón negro con texto mono y el cuadradito "+". Al pasar el mouse, la cara
// blanca crece desde el "+" mientras gira media vuelta y deja el botón invertido.
export function BotonPapel({ a, texto, onClick, claro = false, type = 'button', disabled }) {
  const clase = `pp-boton${claro ? ' pp-boton--claro' : ''}`
  const contenido = (
    <>
      <span className="pp-boton__texto">{texto}</span>
      <span className="pp-boton__mas" aria-hidden="true">+</span>
      <span className="pp-boton__cara" aria-hidden="true">
        <span className="pp-boton__jinete">
          <span className="pp-boton__texto">{texto}</span>
          <span className="pp-boton__mas">+</span>
        </span>
      </span>
      <span className="pp-boton__borde" aria-hidden="true" />
    </>
  )
  if (a) return <Link to={a} className={clase}>{contenido}</Link>
  return <button type={type} className={clase} onClick={onClick} disabled={disabled}>{contenido}</button>
}

// Marca cuándo un elemento entra en pantalla (una sola vez).
export function useVisible(margen = '0px 0px -10% 0px') {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Si ya está en pantalla al montarse (p. ej. el título de una página), no espera al observer.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true)
        io.disconnect()
      }
    }, { rootMargin: margen })
    io.observe(el)
    return () => io.disconnect()
  }, [margen])
  return [ref, visible]
}

// Numera las líneas en que quedó partido un texto: cada palabra recibe
// --linea para que todas las de una misma línea suban juntas, en cascada.
function numerarLineas(raiz) {
  const palabras = raiz.querySelectorAll('.pp-revelado__caja')
  let linea = -1
  let tope = -Infinity
  palabras.forEach((p) => {
    const y = p.offsetTop
    if (y > tope + 2) {
      linea++
      tope = y
    }
    p.style.setProperty('--linea', linea)
  })
}

// Texto que aparece línea por línea desde abajo, con máscara.
// Por defecto se dispara al entrar en pantalla; con `activo` se controla de afuera
// (al pasar a false se desvanece y queda listo para volver a entrar).
export function TextoRevelado({
  como: Tag = 'h2',
  className = '',
  children,
  activo,
  duracion = 1.2,
  paso = 0.08,
  retraso = 0,
}) {
  const [refVisible, visible] = useVisible()
  const raiz = useRef(null)
  const controlado = activo !== undefined
  const encendido = controlado ? activo : visible
  const [estado, setEstado] = useState('fuera')

  useEffect(() => {
    if (encendido) {
      // Un cuadro en "fuera" para que la transición arranque desde abajo.
      const id = requestAnimationFrame(() => setEstado('dentro'))
      return () => cancelAnimationFrame(id)
    }
    if (estado === 'fuera') return
    setEstado('saliendo')
    const t = setTimeout(() => setEstado('fuera'), 320)
    return () => clearTimeout(t)
  }, [encendido]) // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    const el = raiz.current
    if (!el) return
    numerarLineas(el)
    const ro = new ResizeObserver(() => numerarLineas(el))
    ro.observe(el)
    document.fonts?.ready.then(() => numerarLineas(el))
    return () => ro.disconnect()
  }, [children])

  const unir = (el) => {
    raiz.current = el
    refVisible.current = el
  }
  const texto = String(children)
  const palabras = texto.split(/\s+/).filter(Boolean)

  return (
    <Tag
      ref={unir}
      className={`pp-revelado pp-revelado--${estado} ${className}`}
      style={{ '--dur': `${duracion}s`, '--paso': `${paso}s`, '--retraso': `${retraso}s` }}
      aria-label={texto}
    >
      {palabras.map((p, i) => (
        <Fragment key={i}>
          <span className="pp-revelado__caja" aria-hidden="true">
            <span className="pp-revelado__palabra">{p}</span>
          </span>
          {i < palabras.length - 1 && ' '}
        </Fragment>
      ))}
    </Tag>
  )
}

// Etiqueta mono en mayúsculas con la línea que corre hasta el borde.
export function Etiqueta({ children }) {
  const [ref, visible] = useVisible()
  return (
    <div ref={ref} className={`pp-etiqueta ${visible ? 'es-visible' : ''}`}>
      <TextoRevelado como="span" className="pp-etiqueta__texto">{children}</TextoRevelado>
      <span className="pp-etiqueta__linea" />
    </div>
  )
}

// Texto gigante que corre de forma infinita, separado por un cuadradito.
// Avanza una "unidad" (texto + separador) cada 18 s, solo mientras se ve.
export function Marquesina({ texto, copias = 5 }) {
  const visor = useRef(null)
  const pista = useRef(null)

  useEffect(() => {
    let unidad = 0
    let x = 0
    let visible = false
    const medir = () => {
      const hijos = pista.current?.children
      if (hijos && hijos.length > 1) unidad = hijos[1].offsetLeft - hijos[0].offsetLeft
    }
    medir()
    document.fonts?.ready.then(medir)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(visor.current)
    const ro = new ResizeObserver(medir)
    ro.observe(pista.current)
    const quitar = alCuadro((dt) => {
      if (!visible || unidad <= 0) return
      x = (x - (unidad / 18) * dt) % unidad
      pista.current.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`
    })
    return () => { quitar(); io.disconnect(); ro.disconnect() }
  }, [])

  return (
    <div ref={visor} className="pp-marquesina" aria-label={texto}>
      <div ref={pista} className="pp-marquesina__pista" aria-hidden="true">
        {Array.from({ length: copias }, (_, i) => (
          <span key={i} className="pp-marquesina__item">
            <span>{texto}</span>
            <span className="pp-marquesina__punto" />
          </span>
        ))}
      </div>
    </div>
  )
}
