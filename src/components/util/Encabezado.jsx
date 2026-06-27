import Aparecer from './Aparecer.jsx'
import './Encabezado.css'

// Encabezado simple para el tope de cada página interna.
export default function Encabezado({ titulo, bajada }) {
  return (
    <section className="encabezado">
      <div className="contenedor">
        <Aparecer>
          <h1 className="encabezado__titulo">{titulo}</h1>
          {bajada && <p className="encabezado__bajada">{bajada}</p>}
        </Aparecer>
      </div>
    </section>
  )
}
