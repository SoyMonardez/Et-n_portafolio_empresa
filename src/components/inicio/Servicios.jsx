import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SERVICIOS } from '../../data/servicios.js'
import SolDeMayo from '../marca/SolDeMayo.jsx'
import './Servicios.css'

// Servicios con íconos. Al seleccionar uno se muestra un panel ilustrativo
// con su descripción. En el panel va una foto real cuando esté disponible.
export default function Servicios() {
  const [activo, setActivo] = useState(SERVICIOS[0].id)
  const sel = SERVICIOS.find((s) => s.id === activo)
  const Icono = sel.icono

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
                  onClick={() => setActivo(s.id)}
                >
                  <span className="serv__item-icono"><Ic /></span>
                  <span className="serv__item-texto">
                    <span className="serv__item-titulo">
                      {s.titulo}
                      {s.nuevo && <span className="serv__nuevo">Nuevo</span>}
                    </span>
                    <span className="serv__item-resumen">{s.resumen}</span>
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
                <div
                  className="serv__imagen"
                  style={{ '--tono': sel.tono }}
                >
                  <SolDeMayo size={150} className="serv__imagen-sol" />
                  <Icono className="serv__imagen-icono" />
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
