import { CLIENTES } from '../../data/clientes.js'
import './CarruselLogos.css'

// Carrusel infinito (marquee) con los logos de los lugares donde trabajó Etán.
// Se duplica la lista para que el desplazamiento sea continuo.
export default function CarruselLogos() {
  // Repetimos varias veces para que cada mitad sea más ancha que la pantalla;
  // así, al desplazar -50%, el loop es continuo y nunca queda un hueco.
  const lista = Array.from({ length: 6 }, () => CLIENTES).flat()
  return (
    <section className="carrusel" aria-label="Dónde trabajamos">
      <p className="carrusel__titulo">Confían en nosotros</p>
      <div className="carrusel__pista-wrap">
        <div className="carrusel__pista">
          {lista.map((c, i) => (
            <div
              className="carrusel__sello"
              key={i}
              aria-hidden={i >= CLIENTES.length}
              tabIndex={i < CLIENTES.length ? 0 : -1}
            >
              <img src={c.logo} alt={c.nombre} loading="lazy" />
              <span className="carrusel__tooltip" role="tooltip">{c.nombre}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
