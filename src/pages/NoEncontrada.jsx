import { Link } from 'react-router-dom'

export default function NoEncontrada() {
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
