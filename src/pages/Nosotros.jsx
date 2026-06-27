import Encabezado from '../components/util/Encabezado.jsx'
import Aparecer from '../components/util/Aparecer.jsx'

export default function Nosotros() {
  return (
    <>
      <Encabezado
        titulo="Sobre Etán"
        bajada="Más de 20 años construyendo en San Juan."
      />
      <section className="seccion contenedor" style={{ maxWidth: 760 }}>
        <Aparecer>
          {/* Texto provisional. La empresa define la versión final. */}
          <p style={{ color: 'var(--text-suave)', marginBottom: 18 }}>
            Etán es una empresa constructora familiar de San Juan que comenzó su
            actividad en 2003. A lo largo de los años creció hasta conformar un
            equipo de alrededor de 50 personas, con maquinaria propia y experiencia
            en obra pública y privada.
          </p>
          <p style={{ color: 'var(--text-suave)', marginBottom: 18 }}>
            Trabajamos en demolición, piedra bola, veredas y obra civil para
            municipios de la provincia como Capital, San Luis, Albardón y Chimbas,
            y hoy ampliamos nuestros servicios hacia el mantenimiento de campamentos
            mineros.
          </p>
          <p style={{ color: 'var(--text-suave)' }}>
            Nuestro nombre, Etán, significa "fuerte y firme": los valores con los
            que encaramos cada obra.
          </p>
        </Aparecer>
      </section>
    </>
  )
}
