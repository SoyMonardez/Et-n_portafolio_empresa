import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import Hero from '../components/inicio/Hero.jsx'
import Proyectos from '../components/inicio/Proyectos.jsx'
import CarruselLogos from '../components/inicio/CarruselLogos.jsx'
import Servicios from '../components/inicio/Servicios.jsx'
import Contadores from '../components/inicio/Contadores.jsx'
import LineaTiempo from '../components/inicio/LineaTiempo.jsx'
import Principios from '../components/inicio/Principios.jsx'
import Testimonios from '../components/inicio/Testimonios.jsx'
import Aparecer from '../components/util/Aparecer.jsx'
import useSeo from '../hooks/useSeo.js'
import './Inicio.css'

export default function Inicio() {
  useSeo({
    titulo: 'Empresa constructora en San Juan',
    descripcion:
      'Etán: empresa constructora de San Juan desde 2003. Demolición, piedra bola, veredas, obra civil y alquiler de maquinaria para municipios y empresas.',
  })
  return (
    <>
      <Hero />
      <Proyectos />
      <CarruselLogos />
      <Servicios />
      <Contadores />
      <LineaTiempo />
      <Principios />
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
