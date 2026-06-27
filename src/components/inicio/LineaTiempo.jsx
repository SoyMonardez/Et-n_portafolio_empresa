import { HITOS } from '../../data/hitos.js'
import Aparecer from '../util/Aparecer.jsx'
import './LineaTiempo.css'

// Historia de la empresa en una línea de tiempo vertical.
export default function LineaTiempo() {
  return (
    <section className="linea">
      <div className="contenedor">
        <p className="eyebrow">Nuestra historia</p>
        <h2 className="titulo-seccion">Más de 20 años construyendo</h2>

        <ol className="linea__lista">
          {HITOS.map((h, i) => (
            <Aparecer key={h.anio} delay={i * 0.05}>
              <li className="hito">
                <div className="hito__marca">
                  <span className="hito__punto" />
                </div>
                <div className="hito__cuerpo">
                  <span className="hito__anio">{h.anio}</span>
                  <h3 className="hito__titulo">{h.titulo}</h3>
                  <p className="hito__texto">{h.texto}</p>
                </div>
              </li>
            </Aparecer>
          ))}
        </ol>
      </div>
    </section>
  )
}
