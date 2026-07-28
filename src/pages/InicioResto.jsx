import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import Proyectos from '../components/inicio/Proyectos.jsx'
import CarruselLogos from '../components/inicio/CarruselLogos.jsx'
import Servicios from '../components/inicio/Servicios.jsx'
import Contadores from '../components/inicio/Contadores.jsx'
import LineaTiempo from '../components/inicio/LineaTiempo.jsx'
import RevelarObra from '../components/inicio/RevelarObra.jsx'
import Principios from '../components/inicio/Principios.jsx'
import Testimonios from '../components/inicio/Testimonios.jsx'
import Aparecer from '../components/util/Aparecer.jsx'

// Todo lo que va debajo del hero. Se carga aparte (lazy) para que el hero
// —y su título, que es el LCP— se pinte sin esperar a framer-motion ni al
// resto de las secciones. Al estar bajo el pliegue, su carga no genera CLS.
export default function InicioResto() {
  return (
    <>
      <Proyectos />
      <CarruselLogos />
      <Servicios />
      <Contadores />
      <LineaTiempo />
      <RevelarObra>
        <Principios />
      </RevelarObra>
      <Testimonios />

      {/* Cierre */}
      <section className="contenedor">
        <Aparecer className="cierre">
          <div className="cierre__texto">
            <h2 className="cierre__titulo">¿Tenés una obra en mente?</h2>
            <p className="cierre__bajada">
              Contanos qué necesitás y te preparamos un presupuesto sin cargo.
            </p>
          </div>
          <Link to="/presupuesto" className="boton boton--principal cierre__boton">
            Solicitar presupuesto <FiArrowRight />
          </Link>
        </Aparecer>
      </section>
    </>
  )
}
