import { Link } from 'react-router-dom'
import { FiArrowUpRight, FiArrowRight } from 'react-icons/fi'
import { PROYECTOS } from '../../data/proyectos.js'
import Aparecer from '../util/Aparecer.jsx'
import './Proyectos.css'

// Proyectos destacados con botón "Ver más". Las portadas usan un marcador
// de color hasta que se carguen las fotos reales desde el admin.
export default function Proyectos() {
  return (
    <section className="proys" id="proyectos">
      <div className="contenedor">
        <div className="proys__cabecera">
          <div>
            <p className="eyebrow">Obras</p>
            <h2 className="titulo-seccion">Algunos de nuestros trabajos</h2>
          </div>
          <Link to="/obras" className="boton boton--borde proys__vermas">
            Ver más obras <FiArrowRight />
          </Link>
        </div>

        <div className="proys__grid">
          {PROYECTOS.map((p, i) => (
            <Aparecer key={p.id} delay={i * 0.08}>
              <Link to="/obras" className="proy-card">
                <div className="proy-card__portada" style={{ '--tono': p.tono }}>
                  <span className="proy-card__categoria">{p.categoria}</span>
                  <FiArrowUpRight className="proy-card__flecha" />
                </div>
                <div className="proy-card__pie">
                  <h3 className="proy-card__titulo">{p.titulo}</h3>
                  <span className="proy-card__meta">{p.lugar} · {p.anio}</span>
                </div>
              </Link>
            </Aparecer>
          ))}
        </div>
      </div>
    </section>
  )
}
