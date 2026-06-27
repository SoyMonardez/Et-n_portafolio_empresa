import { Link } from 'react-router-dom'
import { FiArrowRight, FiCheck } from 'react-icons/fi'
import { SERVICIOS } from '../data/servicios.js'
import Aparecer from '../components/util/Aparecer.jsx'
import './Inicio.css'

const ZONAS = ['Capital', 'San Luis', 'Albardón', 'Chimbas']

const CIFRAS = [
  { numero: '+20', texto: 'años de trayectoria' },
  { numero: '~50', texto: 'personas en el equipo' },
  { numero: '+4', texto: 'municipios atendidos' },
]

export default function Inicio() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="contenedor hero__contenido">
          <Aparecer>
            <span className="hero__etiqueta">Empresa constructora · San Juan</span>
            <h1 className="hero__titulo">
              Construimos sobre bases <span className="hero__resalte">firmes</span>
            </h1>
            <p className="hero__bajada">
              Demolición, piedra bola, veredas y obra civil con equipo propio y más
              de 20 años de experiencia. Trabajamos para municipios, empresas y
              particulares de toda la provincia.
            </p>
            <div className="hero__acciones">
              <Link to="/presupuesto" className="boton boton--principal">
                Pedir presupuesto <FiArrowRight />
              </Link>
              <Link to="/servicios" className="boton boton--borde">
                Ver servicios
              </Link>
            </div>
            <ul className="hero__zonas">
              {ZONAS.map((z) => (
                <li key={z}><FiCheck /> {z}</li>
              ))}
            </ul>
          </Aparecer>
        </div>
      </section>

      {/* CIFRAS */}
      <section className="contenedor cifras">
        {CIFRAS.map((c, i) => (
          <Aparecer key={c.texto} delay={i * 0.08} className="cifra">
            <span className="cifra__numero">{c.numero}</span>
            <span className="cifra__texto">{c.texto}</span>
          </Aparecer>
        ))}
      </section>

      {/* SERVICIOS */}
      <section className="seccion contenedor">
        <Aparecer>
          <h2 className="seccion__titulo">Lo que hacemos</h2>
          <p className="seccion__bajada">
            Servicios de construcción y demolición con maquinaria propia y un equipo
            con experiencia en obra pública y privada.
          </p>
        </Aparecer>
        <div className="servicios-grid">
          {SERVICIOS.map((s, i) => {
            const Icono = s.icono
            return (
              <Aparecer key={s.id} delay={i * 0.06} className="servicio-card">
                {s.nuevo && <span className="servicio-card__nuevo">Nuevo</span>}
                <span className="servicio-card__icono"><Icono /></span>
                <h3 className="servicio-card__titulo">{s.titulo}</h3>
                <p className="servicio-card__texto">{s.resumen}</p>
              </Aparecer>
            )
          })}
        </div>
      </section>

      {/* LLAMADO FINAL */}
      <section className="contenedor">
        <Aparecer className="cta-final">
          <div>
            <h2 className="cta-final__titulo">¿Tenés una obra en mente?</h2>
            <p className="cta-final__texto">
              Contanos qué necesitás y te preparamos un presupuesto sin cargo.
            </p>
          </div>
          <Link to="/presupuesto" className="boton boton--marca">
            Solicitar presupuesto <FiArrowRight />
          </Link>
        </Aparecer>
      </section>
    </>
  )
}
