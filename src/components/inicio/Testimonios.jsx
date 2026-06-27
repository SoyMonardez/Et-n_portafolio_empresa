import { TESTIMONIOS } from '../../data/testimonios.js'
import Aparecer from '../util/Aparecer.jsx'
import './Testimonios.css'

// Lo que dicen los clientes.
export default function Testimonios() {
  return (
    <section className="testi">
      <div className="contenedor">
        <p className="eyebrow">Confianza</p>
        <h2 className="titulo-seccion">Lo que dicen de nosotros</h2>

        <div className="testi__grid">
          {TESTIMONIOS.map((t, i) => (
            <Aparecer key={t.id} delay={i * 0.07}>
              <figure className="testi-card">
                <span className="testi-card__comillas" aria-hidden="true">&ldquo;</span>
                <blockquote className="testi-card__texto">{t.texto}</blockquote>
                <figcaption className="testi-card__pie">
                  <span className="testi-card__autor">{t.autor}</span>
                  <span className="testi-card__cargo">{t.cargo}</span>
                </figcaption>
              </figure>
            </Aparecer>
          ))}
        </div>
      </div>
    </section>
  )
}
