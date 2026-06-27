import { CLIENTES } from '../../data/clientes.js'
import './CarruselLogos.css'

// Carrusel infinito (marquee) con los lugares donde trabajó Etán.
// Se duplica la lista para que el desplazamiento sea continuo.
export default function CarruselLogos() {
  const lista = [...CLIENTES, ...CLIENTES]
  return (
    <section className="carrusel" aria-label="Dónde trabajamos">
      <p className="carrusel__titulo">Confían en nosotros</p>
      <div className="carrusel__pista-wrap">
        <div className="carrusel__pista">
          {lista.map((nombre, i) => (
            <span className="carrusel__sello" key={i} aria-hidden={i >= CLIENTES.length}>
              {nombre}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
