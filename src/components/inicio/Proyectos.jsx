import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowUpRight, FiArrowRight } from 'react-icons/fi'
import { PROYECTOS } from '../../data/proyectos.js'
import { obtenerObras } from '../../lib/api.js'
import Aparecer from '../util/Aparecer.jsx'
import './Proyectos.css'

const normalizar = (o) => ({
  id: o.id,
  titulo: o.titulo,
  categoria: o.categoria,
  lugar: o.lugar,
  anio: o.anio,
  img: o.imagen_url || o.img,
})

// Muestra las 3 obras más recientes (del admin, con fallback al contenido
// por defecto si el backend no responde) y un botón "Ver más".
export default function Proyectos() {
  const [proyectos, setProyectos] = useState(() => PROYECTOS.map(normalizar))

  useEffect(() => {
    obtenerObras().then((items) => {
      if (items && items.length) setProyectos(items.map(normalizar))
    })
  }, [])

  const destacados = proyectos.slice(0, 3)

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
          {destacados.map((p, i) => (
            <Aparecer key={p.id} delay={i * 0.08}>
              <Link to="/obras" className="proy-card">
                <div className="proy-card__portada">
                  <img
                    src={p.img}
                    alt={p.titulo}
                    width="800"
                    height="600"
                    loading="lazy"
                  />
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
