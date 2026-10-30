import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PROYECTOS } from '../../data/proyectos.js'
import { Marquesina } from './Piezas.jsx'
import { alCuadro, conMouse, limitar } from './desplazamiento.js'

// Panel oscuro de obras. Con mouse, el panel es una "ventana" fija que al
// principio coincide con el bloque negro de la portada y, a medida que se
// scrollea, interpola su posición y tamaño hasta ocupar el lugar que le toca
// en la página (lo alcanza justo cuando ese lugar llega al tope). Adentro,
// el contenido se contra-desplaza para quedar siempre en su posición real:
// el bloque se abre y deja ver las obras que ya estaban ahí.
// En celular / táctil es un bloque común.
export default function Obras({ desde }) {
  const hueco = useRef(null)
  const panel = useRef(null)
  const mundo = useRef(null)
  const contenido = useRef(null)
  const [estatico, setEstatico] = useState(false)

  useEffect(() => {
    const angosto = window.matchMedia('(max-width: 649px)')
    if (!conMouse() || angosto.matches || !desde.current) {
      setEstatico(true)
      return
    }

    let de = { x: 0, y: 0, w: 0, h: 0 }
    let a = { x: 0, y: 0, w: 0, h: 0 }
    let ultimo = NaN

    const rectDoc = (el) => {
      const r = el.getBoundingClientRect()
      return { x: r.left, y: r.top + window.scrollY, w: r.width, h: r.height }
    }

    const medir = () => {
      if (!contenido.current || !desde.current) return
      hueco.current.style.height = `${contenido.current.offsetHeight}px`
      de = rectDoc(desde.current)
      a = rectDoc(hueco.current)
      mundo.current.style.width = `${a.w}px`
      ultimo = NaN
    }

    const escribir = () => {
      const s = window.scrollY
      if (s === ultimo) return
      ultimo = s
      const p = a.y > 0 ? limitar(s / a.y) : 1
      const x = de.x + (a.x - de.x) * p
      const y = de.y + (a.y - de.y) * p - s
      const w = de.w + (a.w - de.w) * p
      const h = de.h + (a.h - de.h) * p
      const pn = panel.current.style
      pn.transform = `translate3d(${x}px, ${y}px, 0)`
      pn.width = `${w}px`
      pn.height = `${h}px`
      mundo.current.style.transform = `translate3d(${-x}px, ${-y}px, 0)`
      contenido.current.style.transform = `translate3d(0, ${a.y - s}px, 0)`
    }

    medir()
    escribir()
    const quitar = alCuadro(escribir)
    const ro = new ResizeObserver(medir)
    ro.observe(contenido.current)
    ro.observe(desde.current)
    document.fonts?.ready.then(medir)
    window.addEventListener('resize', medir)
    return () => { quitar(); ro.disconnect(); window.removeEventListener('resize', medir) }
  }, [desde])

  // Parallax suave de las tarjetas no cuadradas (se mueven ±7 % de la ventana).
  useEffect(() => {
    if (!window.matchMedia('(min-width: 650px)').matches) return
    const tarjetas = [...contenido.current.querySelectorAll('[data-deriva]')]
    const aplicado = new Map()
    return alCuadro(() => {
      const vh = window.innerHeight
      tarjetas.forEach((el) => {
        const r = el.getBoundingClientRect()
        const mitad = r.top - (aplicado.get(el) || 0) + r.height / 2
        if (mitad < -vh || mitad > vh * 2) return
        const p = limitar((mitad - vh / 2) / ((vh + r.height) / 2), -1, 1)
        const d = p * vh * 0.07
        aplicado.set(el, d)
        el.style.transform = `translate3d(0, ${d.toFixed(2)}px, 0)`
      })
    })
  }, [])

  // Filas de a dos: [cuadrada | 9:8] y después [9:8 | cuadrada].
  const filas = []
  for (let i = 0; i < PROYECTOS.length; i += 2) filas.push(PROYECTOS.slice(i, i + 2))

  return (
    <section id="obras" className={`pp-obras ${estatico ? 'pp-obras--estatico' : ''}`}>
      <div ref={hueco} className="pp-obras__hueco" />
      <div ref={panel} className="pp-obras__panel">
        <div ref={mundo} className="pp-obras__mundo">
          <div ref={contenido} className="pp-obras__contenido">
            <Marquesina texto="Obras destacadas" />
            <div className="pp-obras__grilla">
              {filas.map((fila, f) => (
                <div key={f} className={`pp-obras__fila ${f % 2 ? 'pp-obras__fila--b' : 'pp-obras__fila--a'}`}>
                  {fila.map((p, j) => (
                    <Tarjeta key={p.id} obra={p} cuadrada={(f % 2 === 0) === (j === 0)} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Tarjeta: al pasar el mouse, la placa blanca con el título sube desde abajo
// dentro de la foto mientras el rótulo de abajo se va; la foto se agranda
// hacia donde está el cursor, como una lupa.
function Tarjeta({ obra, cuadrada }) {
  const mover = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', limitar((e.clientX - r.left) / r.width).toFixed(3))
    e.currentTarget.style.setProperty('--my', limitar((e.clientY - r.top) / r.height).toFixed(3))
  }
  return (
    <Link to="/obras" className="pp-tarjeta" data-deriva={cuadrada ? undefined : ''}>
      <div className={`pp-tarjeta__media ${cuadrada ? 'es-cuadrada' : ''}`} onPointerMove={mover}>
        <img src={obra.img} alt={obra.titulo} loading="lazy" draggable="false" />
        <div className="pp-tarjeta__sube">
          <div className="pp-tarjeta__fila">
            <span className="pp-tarjeta__placa" />
            <span className="pp-tarjeta__titulo pp-entra">{obra.titulo}</span>
            <span className="pp-tarjeta__mas pp-sale" aria-hidden="true">+</span>
          </div>
        </div>
      </div>
      <div className="pp-tarjeta__rotulo">
        <div className="pp-tarjeta__cae">
          <span className="pp-tarjeta__titulo pp-entra">{obra.titulo}</span>
          <span className="pp-tarjeta__mas pp-tarjeta__mas--claro pp-sale" aria-hidden="true">+</span>
        </div>
      </div>
    </Link>
  )
}
