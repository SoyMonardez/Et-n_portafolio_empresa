import Encabezado from '../components/util/Encabezado.jsx'

export default function Empleo() {
  return (
    <>
      <Encabezado
        titulo="Trabajá con nosotros"
        bajada="Sumate a nuestro equipo. Mirá las búsquedas activas y dejanos tu currículum."
      />
      <section className="seccion contenedor">
        <p style={{ color: 'var(--text-suave)' }}>
          Próximamente vas a ver las búsquedas laborales y el formulario para postularte.
        </p>
      </section>
    </>
  )
}
