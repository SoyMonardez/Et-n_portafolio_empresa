import { Link } from 'react-router-dom'
import useSeo from '../hooks/useSeo.js'

export default function NoEncontrada() {
  useSeo({ titulo: 'Página no encontrada', descripcion: 'La página que buscás no existe o fue movida.' })
  return (
    <section className="seccion contenedor" style={{ textAlign: 'center', minHeight: '50vh' }}>
      <h1 style={{ fontSize: '4rem', color: 'var(--brand)' }}>404</h1>
      <p style={{ color: 'var(--text-suave)', marginBottom: 24 }}>
        No encontramos la página que buscás.
      </p>
      <Link to="/" className="boton boton--marca">Volver al inicio</Link>
    </section>
  )
}
