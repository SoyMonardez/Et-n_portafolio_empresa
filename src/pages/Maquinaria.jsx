import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import Encabezado from '../components/util/Encabezado.jsx'
import Aparecer from '../components/util/Aparecer.jsx'
import useSeo from '../hooks/useSeo.js'
import { MAQUINAS } from '../data/maquinas.js'
import '../styles/catalogo.css'

export default function Maquinaria() {
  useSeo({
    titulo: 'Alquiler de maquinaria',
    descripcion:
      'Alquiler de maquinaria pesada en San Juan: excavadoras, topadoras, camiones volcadores, grúas y rodillos compactadores.',
  })

  return (
    <>
      <Encabezado
        titulo="Alquiler de maquinaria"
        bajada="Equipos propios disponibles para alquilar. Elegí la máquina que necesitás y solicitá el alquiler, te contestamos a la brevedad."
      />
      <section className="seccion contenedor">
        <div className="catalogo">
          {MAQUINAS.map((m, i) => (
            <Aparecer key={m.id} delay={i * 0.06}>
              <article className="catalogo-card">
                <div className="catalogo-card__foto">
                  <img src={m.img} alt={m.nombre} loading="lazy" width="800" height="600" />
                  <span className="catalogo-card__categoria">{m.categoria}</span>
                </div>
                <div className="catalogo-card__cuerpo">
                  <h3 className="catalogo-card__titulo">{m.nombre}</h3>
                  <p className="catalogo-card__detalle">{m.detalle}</p>
                  <Link
                    to={`/presupuesto?maquina=${encodeURIComponent(m.nombre)}`}
                    className="boton boton--borde catalogo-card__accion"
                  >
                    Solicitar alquiler <FiArrowRight />
                  </Link>
                </div>
              </article>
            </Aparecer>
          ))}
        </div>
      </section>
    </>
  )
}
