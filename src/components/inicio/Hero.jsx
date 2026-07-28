import { FiArrowDown } from 'react-icons/fi'
import './Hero.css'

const LETRAS = ['E', 'T', '\u00C1', 'N']

export default function Hero() {
  return (
    <section className="heroE">
      <h1 className="heroE__sr">
        Etan: demolicion, piedra bola, veredas y obra civil con equipo propio en San Juan
      </h1>

      <div className="heroE__marco">
        <div className="heroE__escena">
          <div className="heroE__marca" aria-hidden="true">
            <div className="heroE__palabra">
              {LETRAS.map((letra, index) => (
                <span
                  key={`${letra}-${index}`}
                  className="heroE__letra"
                  style={{ '--i': index }}
                >
                  {letra}
                </span>
              ))}
            </div>
          </div>

          <img
            className="heroE__recorte"
            src="/img/edificio-obra.webp"
            alt="Estructura de obra en construccion de Etan"
            width="900"
            height="1083"
            fetchPriority="high"
          />
        </div>
      </div>

      <a href="#proyectos" className="heroE__scroll" aria-label="Bajar a proyectos">
        <FiArrowDown />
      </a>
    </section>
  )
}


