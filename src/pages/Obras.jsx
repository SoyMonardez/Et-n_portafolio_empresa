import Encabezado from '../components/util/Encabezado.jsx'

export default function Obras() {
  return (
    <>
      <Encabezado
        titulo="Obras realizadas"
        bajada="Una muestra de los trabajos que llevamos adelante. Las fotos se cargan desde el panel de administración."
      />
      <section className="seccion contenedor">
        <p style={{ color: 'var(--text-suave)' }}>
          Próximamente vas a ver acá la galería de obras.
        </p>
      </section>
    </>
  )
}
