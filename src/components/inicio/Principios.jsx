import { useEffect, useState } from 'react'
import {
  FiCheckCircle,
  FiEye,
  FiHeart,
  FiGlobe,
  FiShield,
  FiTarget,
  FiUsers,
  FiX,
} from 'react-icons/fi'
import { PRINCIPIOS } from '../../data/principios.js'
import Aparecer from '../util/Aparecer.jsx'
import './Principios.css'

const ICONOS = [FiTarget, FiEye, FiCheckCircle, FiGlobe, FiShield, FiUsers, FiHeart]

export default function Principios() {
  const [abierto, setAbierto] = useState(null)
  const seleccionado = abierto == null ? null : PRINCIPIOS[abierto]

  useEffect(() => {
    if (!seleccionado) return undefined

    const cerrarConEscape = (event) => {
      if (event.key === 'Escape') setAbierto(null)
    }

    window.addEventListener('keydown', cerrarConEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', cerrarConEscape)
      document.body.style.overflow = ''
    }
  }, [seleccionado])

  return (
    <section className="princ">
      <div className="contenedor">
        <p className="eyebrow">Quiénes somos</p>
        <h2 className="titulo-seccion">Cómo trabajamos</h2>

        <div className="princ__grid">
          {PRINCIPIOS.map((p, i) => {
            const Icono = ICONOS[i] || FiCheckCircle

            return (
              <Aparecer key={p.clave} delay={(i % 3) * 0.06}>
                <button
                  className="princ-card"
                  type="button"
                  onClick={() => setAbierto(i)}
                  aria-label={`Ver detalle de ${p.titulo}`}
                >
                  <span className="princ-card__indice">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="princ-card__icono" aria-hidden="true">
                    <Icono />
                  </span>
                  <h3 className="princ-card__titulo">{p.titulo}</h3>
                  <p className="princ-card__texto">{p.texto}</p>
                </button>
              </Aparecer>
            )
          })}
        </div>
      </div>

      {seleccionado && (
        <div
          className="princ-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="princ-modal-titulo"
        >
          <button
            className="princ-modal__fondo"
            type="button"
            aria-label="Cerrar detalle"
            onClick={() => setAbierto(null)}
          />
          <article className="princ-modal__panel">
            <button
              className="princ-modal__cerrar"
              type="button"
              aria-label="Cerrar detalle"
              onClick={() => setAbierto(null)}
            >
              <FiX />
            </button>
            <span className="princ-modal__indice">
              {String(abierto + 1).padStart(2, '0')}
            </span>
            <h3 id="princ-modal-titulo">{seleccionado.titulo}</h3>
            <p>{seleccionado.texto}</p>
          </article>
        </div>
      )}
    </section>
  )
}

