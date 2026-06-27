import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { SERVICIOS } from '../data/servicios.js'
import Encabezado from '../components/util/Encabezado.jsx'
import Aparecer from '../components/util/Aparecer.jsx'

export default function Servicios() {
  return (
    <>
      <Encabezado
        titulo="Nuestros servicios"
        bajada="Soluciones de construcción y demolición con maquinaria propia y un equipo con experiencia en obra pública y privada."
      />
      <section className="seccion contenedor">
        <div className="servicios-grid">
          {SERVICIOS.map((s, i) => {
            const Icono = s.icono
            return (
              <Aparecer key={s.id} delay={i * 0.06} className="servicio-card">
                {s.nuevo && <span className="servicio-card__nuevo">Nuevo</span>}
                <span className="servicio-card__icono"><Icono /></span>
                <h2 className="servicio-card__titulo">{s.titulo}</h2>
                <p className="servicio-card__texto">{s.resumen}</p>
              </Aparecer>
            )
          })}
        </div>
        <Aparecer className="cta-final" delay={0.1}>
          <div>
            <h2 className="cta-final__titulo">¿No encontrás lo que buscás?</h2>
            <p className="cta-final__texto">Escribinos y vemos cómo ayudarte.</p>
          </div>
          <Link to="/contacto" className="boton boton--principal">
            Contactanos <FiArrowRight />
          </Link>
        </Aparecer>
      </section>
    </>
  )
}
