import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SERVICIOS } from '../../data/servicios.js'
import './Servicios.css'

const DURACION_MS = 5000

// Servicios con íconos. Avanza solo cada DURACION_MS (con una barrita de
// tiempo bajo el ítem activo) hasta que el usuario elige uno a mano, momento
// en el que se detiene el avance automático.
export default function Servicios() {
  const [activo, setActivo] = useState(SERVICIOS[0].id)
  const [automatico, setAutomatico] = useState(true)
  const indice = SERVICIOS.findIndex((s) => s.id === activo)
  const sel = SERVICIOS[indice]

  useEffect(() => {
    if (!automatico) return
    const id = setTimeout(() => {
      setActivo(SERVICIOS[(indice + 1) % SERVICIOS.length].id)
    }, DURACION_MS)
    return () => clearTimeout(id)
  }, [activo, automatico, indice])

  function elegir(id) {
    setAutomatico(false)
    setActivo(id)
  }

  return (
    <section className="serv">
      <div className="contenedor">
        <p className="eyebrow">Lo que hacemos</p>
        <h2 className="titulo-seccion">Servicios</h2>

        <div className="serv__grid">
          {/* Lista de íconos seleccionables */}
          <div className="serv__lista" role="tablist" aria-label="Servicios">
            {SERVICIOS.map((s) => {
              const Ic = s.icono
              const on = s.id === activo
              return (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={on}
                  className={`serv__item ${on ? 'serv__item--on' : ''}`}
                  onClick={() => elegir(s.id)}
                >
                  <span className="serv__item-icono"><Ic /></span>
                  <span className="serv__item-texto">
                    <span className="serv__item-titulo">
                      {s.titulo}
                      {s.nuevo && <span className="serv__nuevo">Nuevo</span>}
                    </span>
                    <span className="serv__item-resumen">{s.resumen}</span>
                    <span className="serv__progreso">
                      {on && automatico && (
                        <span
                          key={activo}
                          className="serv__progreso-relleno"
                          style={{ animationDuration: `${DURACION_MS}ms` }}
                        />
                      )}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

          {/* Panel ilustrativo del servicio seleccionado */}
          <div className="serv__panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={sel.id}
                className="serv__detalle"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32 }}
              >
                <div className="serv__imagen">
                  <img src={sel.img} alt={sel.titulo} loading="lazy" />
                </div>
                <h3 className="serv__detalle-titulo">{sel.titulo}</h3>
                <p className="serv__detalle-texto">{sel.detalle}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
