import { useEffect, useRef, useState } from 'react'
import { SERVICIOS } from '../../data/servicios.js'
import { TESTIMONIOS } from '../../data/testimonios.js'
import { Etiqueta, TextoRevelado, BotonPapel, Marquesina } from './Piezas.jsx'
import { Costura } from './Costura.jsx'
import { alCuadro, limitar, resorte, snappy } from './desplazamiento.js'

// ---------- Servicios: lista editorial numerada ----------
// En la página de Servicios va sin título propio (lo pone el Encabezado)
// y con el primer servicio abierto de entrada.
export function Servicios({ conTitulo = true }) {
  const [abierto, setAbierto] = useState(conTitulo ? null : SERVICIOS[0].id)
  return (
    <section id="servicios" className={`pp-seccion pp-servicios ${conTitulo ? '' : 'pp-servicios--pagina'}`}>
      {conTitulo && (
        <>
          <Etiqueta>Servicios</Etiqueta>
          <div className="pp-cabeza">
            <TextoRevelado className="pp-h2">Obra de punta a punta.</TextoRevelado>
            <div className="pp-cabeza__lado">
              <TextoRevelado como="p" className="pp-lede">
                Demolición, piedra bola, veredas y obra civil con equipo y maquinaria propia, para municipios, empresas y particulares.
              </TextoRevelado>
            </div>
          </div>
        </>
      )}
      <ol className="pp-servicios__lista">
        {SERVICIOS.map((s, i) => {
          const activo = abierto === s.id
          return (
            <li key={s.id} className={`pp-servicio ${activo ? 'es-activo' : ''}`}>
              <button type="button" className="pp-servicio__fila" onClick={() => setAbierto(activo ? null : s.id)} aria-expanded={activo}>
                <span className="pp-servicio__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="pp-servicio__nombre">{s.titulo}{s.nuevo && <em className="pp-servicio__nuevo">Nuevo</em>}</span>
                <span className="pp-servicio__mas" aria-hidden="true">+</span>
              </button>
              <div className="pp-servicio__detalle">
                <div className="pp-servicio__interior">
                  <img src={s.img} alt="" loading="lazy" />
                  <p>{s.detalle}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

// ---------- Nosotros: texto + dos tiras de fotos ----------
const FOTOS = [
  { src: '/img/maq-excavadora.jpg', forma: 'cuadrada' },
  { src: '/img/serv-demolicion.jpg', forma: 'ancha' },
  { src: '/img/nosotros.jpg', forma: 'alta' },
  { src: '/img/maq-camion.jpg', forma: 'cuadrada' },
  { src: '/img/serv-veredas.jpg', forma: 'ancha' },
  { src: '/img/maq-grua.jpg', forma: 'alta' },
]
const FOTOS_B = [
  { src: '/img/maq-topadora.jpg', forma: 'ancha' },
  { src: '/img/serv-piedra.jpg', forma: 'alta' },
  { src: '/img/proyecto-2.jpg', forma: 'cuadrada' },
  { src: '/img/maq-rodillo.jpg', forma: 'ancha' },
  { src: '/img/serv-mineria.jpg', forma: 'alta' },
  { src: '/img/proyecto-3.jpg', forma: 'cuadrada' },
]

function Tira({ fotos, tiraRef }) {
  return (
    <div ref={tiraRef} className="pp-tira">
      {[0, 1, 2].flatMap((v) => fotos.map((f, i) => (
        <div key={`${v}-${i}`} className={`pp-tira__foto pp-tira__foto--${f.forma}`}>
          <img src={f.src} alt="" loading="lazy" draggable="false" />
        </div>
      )))}
    </div>
  )
}

// Las tiras derivan solas (18 px/s, en sentidos opuestos) y se pueden
// arrastrar con inercia. Mientras se mueven rápido, las fotos se "aprietan"
// un poco. El bloque entero se queda atrás al scrollear (lag).
export function Nosotros() {
  const marco = useRef(null)
  const area = useRef(null)
  const tiraA = useRef(null)
  const tiraB = useRef(null)

  useEffect(() => {
    const arrastre = resorte(0, 0.4)
    const apriete = resorte(0, 0.25)
    let deriva = 0
    let previo = 0
    let visible = false
    let presionado = false
    let inicio = null

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { rootMargin: '50% 0px' })
    io.observe(area.current)

    const vuelta = (tira) => {
      const hijos = tira.children
      const n = hijos.length / 3
      return hijos[n].offsetLeft - hijos[0].offsetLeft
    }
    const ubicar = (tira, x) => {
      const w = vuelta(tira)
      const envuelto = w > 0 ? (((x % w) + w) % w) - w : x
      tira.style.transform = `translate3d(${envuelto.toFixed(2)}px, 0, 0)`
    }

    const bajar = (e) => {
      if (!e.isPrimary || e.button !== 0) return
      presionado = true
      inicio = { x: e.clientX, base: arrastre.meta }
      area.current.setPointerCapture(e.pointerId)
    }
    const mover = (e) => {
      if (!inicio) return
      arrastre.meta = inicio.base + (e.clientX - inicio.x) * 1.4
    }
    const soltar = () => { presionado = false; inicio = null }
    const el = area.current
    el.addEventListener('pointerdown', bajar)
    el.addEventListener('pointermove', mover)
    el.addEventListener('pointerup', soltar)
    el.addEventListener('pointercancel', soltar)

    const quitar = alCuadro((dt) => {
      if (!visible) return
      // Lag: el área baja un poco más lento que el scroll.
      const vh = window.innerHeight
      const tope = Math.min(900, vh * 0.8)
      const b = marco.current.getBoundingClientRect()
      const p = limitar((vh - b.top) / (b.height + vh + tope))
      el.style.transform = `translate3d(0, ${(p * p * tope).toFixed(2)}px, 0)`

      deriva += 18 * dt
      const x = -deriva + arrastre.paso(dt)
      ubicar(tiraA.current, x)
      ubicar(tiraB.current, -x - 200)
      const rapidez = Math.abs(x - previo) / Math.max(dt * 60, 0.25)
      previo = x
      apriete.meta = Math.max(presionado ? 0.35 : 0, Math.min(1, rapidez / 34))
      el.style.setProperty('--apriete', apriete.paso(dt).toFixed(3))
    })
    return () => {
      quitar(); io.disconnect()
      el.removeEventListener('pointerdown', bajar)
      el.removeEventListener('pointermove', mover)
      el.removeEventListener('pointerup', soltar)
      el.removeEventListener('pointercancel', soltar)
    }
  }, [])

  return (
    <section id="nosotros" className="pp-nosotros">
      <div className="pp-seccion">
        <Etiqueta>Nosotros</Etiqueta>
        <div className="pp-cabeza">
          <TextoRevelado className="pp-h2">Tierra, piedra y palabra cumplida.</TextoRevelado>
          <div className="pp-cabeza__lado">
            <TextoRevelado como="p" className="pp-lede pp-lede--suave">
              Empezamos en 2003 como un emprendimiento de obra y demolición. Hoy somos un equipo de cerca de 50 personas con flota propia, trabajando para municipios, empresas y la minería de la región.
            </TextoRevelado>
            <BotonPapel a="/empleo" texto="Trabajá con nosotros" />
          </div>
        </div>
      </div>
      <div ref={marco} className="pp-tiras-marco">
        <div ref={area} className="pp-tiras" aria-hidden="true">
          <Tira fotos={FOTOS} tiraRef={tiraA} />
          <Tira fotos={FOTOS_B} tiraRef={tiraB} />
        </div>
      </div>
    </section>
  )
}

// ---------- Testimonios ----------
// La foto se desliza de costado (con parallax interno) y la cita entra
// línea por línea. La barra se llena en 5 s, pasa al siguiente y se vacía
// hacia la derecha; si tocás una flecha, completa el llenado rápido.
const FOTOS_TESTIMONIO = ['/img/proyecto-1.jpg', '/img/serv-obra.jpg', '/img/proyecto-3.jpg']
const ESPERA = 5
const BARRIDO = 0.5

export function Testimonios() {
  const total = TESTIMONIOS.length
  const [meta, setMeta] = useState(0)
  const recorte = useRef(null)
  const cuadros = useRef([])
  const lleno = useRef(null)
  const vacio = useRef(null)
  const estado = useRef({ u: 0, meta: 0, fase: 'espera', t: 0, desde: 0, visible: false, arrastre: null })

  const ir = (d) => {
    const s = estado.current
    s.meta += d
    setMeta(((s.meta % total) + total) % total)
    if (s.fase === 'espera') {
      s.desde = limitar(s.t / ESPERA)
      s.fase = 'completa'
      s.t = 0
    }
  }

  useEffect(() => {
    const s = estado.current
    const io = new IntersectionObserver(([e]) => { s.visible = e.isIntersecting })
    io.observe(recorte.current)
    const barra = (a, b) => {
      lleno.current.style.transform = `scaleX(${a})`
      vacio.current.style.transform = `scaleX(${b})`
    }

    const el = recorte.current
    const bajar = (e) => {
      if (!e.isPrimary) return
      s.arrastre = { x: e.clientX, u: s.u }
      el.setPointerCapture(e.pointerId)
    }
    const mover = (e) => {
      if (!s.arrastre) return
      const w = el.clientWidth || 1
      s.u = s.arrastre.u - (e.clientX - s.arrastre.x) / w
    }
    const soltar = (e) => {
      if (!s.arrastre) return
      const dx = e.clientX - s.arrastre.x
      s.arrastre = null
      if (Math.abs(dx) > 10) {
        const d = Math.round(s.u - s.meta) || (dx < 0 ? 1 : -1)
        ir(d)
      }
    }
    el.addEventListener('pointerdown', bajar)
    el.addEventListener('pointermove', mover)
    el.addEventListener('pointerup', soltar)
    el.addEventListener('pointercancel', soltar)

    const quitar = alCuadro((dt) => {
      // Deslizamiento de las fotos hacia la meta.
      if (!s.arrastre) s.u += (s.meta - s.u) * (1 - Math.exp(-dt * 7))
      const w = el.clientWidth || 1
      const n = FOTOS_TESTIMONIO.length
      cuadros.current.forEach((c, j) => {
        if (!c) return
        const tramo = n * w
        const x = ((((j - s.u) * w + w) % tramo) + tramo) % tramo - w
        c.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`
        c.firstChild.style.transform = `translate3d(${(-x * 0.35).toFixed(1)}px, 0, 0) scale(1.1)`
      })

      // Barra de progreso.
      if (s.fase === 'espera') {
        if (!s.visible || s.arrastre) return
        s.t += dt
        if (s.t < ESPERA) return barra(s.t / ESPERA, 0)
        barra(1, 0)
        s.meta += 1
        setMeta(((s.meta % total) + total) % total)
        s.fase = 'vacia'
        s.t = 0
        return
      }
      s.t += dt
      const k = snappy(s.t / BARRIDO)
      if (s.fase === 'completa') {
        barra(s.desde + (1 - s.desde) * k, 0)
        if (s.t >= BARRIDO) { s.fase = 'vacia'; s.t = 0 }
        return
      }
      barra(0, 1 - k)
      if (s.t >= BARRIDO) { s.fase = 'espera'; s.t = 0 }
    })
    return () => {
      quitar(); io.disconnect()
      el.removeEventListener('pointerdown', bajar)
      el.removeEventListener('pointermove', mover)
      el.removeEventListener('pointerup', soltar)
      el.removeEventListener('pointercancel', soltar)
    }
  }, [total]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id="testimonios" className="pp-testimonios">
      <Costura variante="linea" />
      <div className="pp-testimonios__cuerpo">
        <div className="pp-seccion pp-seccion--sin-pie">
          <Etiqueta>Testimonios</Etiqueta>
        </div>
        <Marquesina texto="Lo que dicen de nosotros" />
        <div className="pp-seccion">
          <article className="pp-testimonio">
            <div ref={recorte} className="pp-testimonio__foto">
              {FOTOS_TESTIMONIO.map((src, j) => (
                <div key={src} ref={(c) => { cuadros.current[j] = c }} className="pp-testimonio__cuadro">
                  <img src={src} alt="" loading="lazy" draggable="false" />
                </div>
              ))}
            </div>
            <div className="pp-testimonio__cuerpo">
              <div className="pp-testimonio__barra">
                <span className="pp-mono pp-testimonio__contador">
                  {String(meta + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
                </span>
                <span className="pp-testimonio__linea">
                  <span ref={lleno} className="pp-testimonio__lleno" />
                  <span ref={vacio} className="pp-testimonio__vacio" />
                </span>
                <span className="pp-testimonio__flechas">
                  <button type="button" onClick={() => ir(-1)} aria-label="Testimonio anterior">
                    <svg viewBox="0 0 5 8"><path d="M4 1 1 4 4 7" /></svg>
                  </button>
                  <button type="button" onClick={() => ir(1)} aria-label="Testimonio siguiente">
                    <svg viewBox="0 0 5 8"><path d="M1 1 4 4 1 7" /></svg>
                  </button>
                </span>
              </div>
              <div className="pp-testimonio__citas">
                {TESTIMONIOS.map((t, i) => (
                  <blockquote key={t.id} className="pp-testimonio__cita" aria-hidden={i !== meta}>
                    <TextoRevelado como="p" activo={i === meta} duracion={0.65} paso={0.075} retraso={0.15}>
                      {t.texto}
                    </TextoRevelado>
                    <TextoRevelado como="footer" className="pp-mono" activo={i === meta} duracion={0.65} paso={0.075} retraso={0.3}>
                      {`— ${t.autor}, ${t.cargo}`}
                    </TextoRevelado>
                  </blockquote>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
