import { PRINCIPIOS } from '../../data/principios.js'
import Aparecer from '../util/Aparecer.jsx'
import './Principios.css'

// Misión, visión, política de calidad, ambiente, seguridad, valores y RSE.
export default function Principios() {
  return (
    <section className="princ">
      <div className="contenedor">
        <p className="eyebrow">Quiénes somos</p>
        <h2 className="titulo-seccion">Cómo trabajamos</h2>

        <div className="princ__grid">
          {PRINCIPIOS.map((p, i) => (
            <Aparecer key={p.clave} delay={(i % 3) * 0.06}>
              <article className="princ-card">
                <span className="princ-card__indice">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="princ-card__titulo">{p.titulo}</h3>
                <p className="princ-card__texto">{p.texto}</p>
              </article>
            </Aparecer>
          ))}
        </div>
      </div>
    </section>
  )
}
