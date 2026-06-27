import Encabezado from '../components/util/Encabezado.jsx'

export default function Contacto() {
  return (
    <>
      <Encabezado
        titulo="Contacto"
        bajada="Escribinos y te respondemos a la brevedad."
      />
      <section className="seccion contenedor">
        <p style={{ color: 'var(--text-suave)' }}>
          Próximamente vas a ver acá el formulario y los datos de contacto.
        </p>
      </section>
    </>
  )
}
