import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import Encabezado from '../components/util/Encabezado.jsx'
import Servicios from '../components/inicio/Servicios.jsx'
import Aparecer from '../components/util/Aparecer.jsx'

export default function ServiciosPagina() {
  return (
    <>
      <Encabezado
        titulo="Nuestros servicios"
        bajada="Soluciones de construcción y demolición con maquinaria propia y un equipo con experiencia en obra pública y privada."
      />
      <Servicios />
      <section className="contenedor" style={{ paddingBottom: '90px' }}>
        <Aparecer className="cierre">
          <div className="cierre__texto">
            <h2 className="cierre__titulo">¿No encontrás lo que buscás?</h2>
            <p className="cierre__bajada">Escribinos y vemos cómo ayudarte.</p>
          </div>
          <Link to="/contacto" className="boton boton--principal cierre__boton">
            Contactanos <FiArrowRight />
          </Link>
        </Aparecer>
      </section>
    </>
  )
}
