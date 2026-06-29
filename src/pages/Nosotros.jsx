import { FiTarget, FiEye, FiShield, FiUsers } from 'react-icons/fi'
import Encabezado from '../components/util/Encabezado.jsx'
import Aparecer from '../components/util/Aparecer.jsx'
import useSeo from '../hooks/useSeo.js'
import './Nosotros.css'

const PUNTOS = [
  { icono: FiTarget, titulo: 'Misión', texto: 'Ejecutar obras con calidad y plazos confiables, cuidando a cada cliente como si fuera propio.' },
  { icono: FiEye, titulo: 'Visión', texto: 'Ser la constructora de referencia en San Juan para obra pública, privada e infraestructura minera.' },
  { icono: FiShield, titulo: 'Seguridad', texto: 'Trabajamos con protocolos de seguridad e higiene en cada obra, cuidando a nuestro equipo.' },
  { icono: FiUsers, titulo: 'Equipo', texto: 'Más de 50 personas con experiencia en obra pública y privada, y maquinaria propia.' },
]

export default function Nosotros() {
  useSeo({
    titulo: 'Sobre nosotros',
    descripcion: 'Etán: más de 20 años construyendo en San Juan, con un equipo de más de 50 personas y maquinaria propia.',
  })

  return (
    <>
      <Encabezado titulo="Sobre Etán" bajada="Más de 20 años construyendo en San Juan." />

      <section className="seccion contenedor nosotros__intro">
        <Aparecer className="nosotros__foto">
          <img src="/img/nosotros.jpg" alt="Equipo de Etán en obra" loading="lazy" />
        </Aparecer>
        <Aparecer className="nosotros__texto" delay={0.1}>
          <p className="eyebrow">Nuestra historia</p>
          <p>
            Etán es una empresa constructora familiar de San Juan que comenzó su
            actividad en <strong>2003</strong>. A lo largo de los años creció hasta
            conformar un equipo de alrededor de <strong>50 personas</strong>, con
            maquinaria propia y experiencia en obra pública y privada.
          </p>
          <p>
            Trabajamos en demolición, piedra bola, veredas y obra civil para
            municipios de la provincia como Capital, San Luis, Albardón y Chimbas,
            y hoy ampliamos nuestros servicios hacia el mantenimiento de
            campamentos mineros.
          </p>
          <p>
            Nuestro nombre, <em>Etán</em>, significa "fuerte y firme": los valores
            con los que encaramos cada obra.
          </p>
        </Aparecer>
      </section>

      <section className="seccion contenedor">
        <div className="nosotros__puntos">
          {PUNTOS.map(({ icono: Icono, titulo, texto }, i) => (
            <Aparecer key={titulo} delay={i * 0.06} className="nosotros__punto">
              <span className="nosotros__punto-icono"><Icono /></span>
              <h3>{titulo}</h3>
              <p>{texto}</p>
            </Aparecer>
          ))}
        </div>
      </section>
    </>
  )
}
