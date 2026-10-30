import { Etiqueta, TextoRevelado } from '../papel/Piezas.jsx'
import './Encabezado.css'

// Encabezado de cada página interna: etiqueta mono, título gigante
// que aparece palabra por palabra y la bajada a la derecha.
export default function Encabezado({ titulo, bajada, etiqueta = 'Etán' }) {
  return (
    <section className="encabezado">
      <Etiqueta>{etiqueta}</Etiqueta>
      <div className="pp-grilla">
        <TextoRevelado como="h1" className="encabezado__titulo">{titulo}</TextoRevelado>
        {bajada && <p className="pp-lede encabezado__bajada">{bajada}</p>}
      </div>
    </section>
  )
}
