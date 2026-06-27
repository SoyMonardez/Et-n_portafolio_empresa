import Encabezado from '../components/util/Encabezado.jsx'

export default function Maquinaria() {
  return (
    <>
      <Encabezado
        titulo="Alquiler de maquinaria"
        bajada="Equipos disponibles para alquilar. Elegí la máquina que necesitás y solicitá el alquiler."
      />
      <section className="seccion contenedor">
        <p style={{ color: 'var(--text-suave)' }}>
          Próximamente vas a ver acá el catálogo de maquinaria.
        </p>
      </section>
    </>
  )
}
