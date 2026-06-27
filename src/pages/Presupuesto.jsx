import Encabezado from '../components/util/Encabezado.jsx'

export default function Presupuesto() {
  return (
    <>
      <Encabezado
        titulo="Solicitar presupuesto"
        bajada="Contanos qué necesitás y te preparamos un presupuesto sin cargo."
      />
      <section className="seccion contenedor">
        <p style={{ color: 'var(--text-suave)' }}>
          Próximamente vas a poder cargar tu pedido desde acá.
        </p>
      </section>
    </>
  )
}
