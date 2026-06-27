import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowDown, FiArrowRight } from 'react-icons/fi'
import SolDeMayo from '../marca/SolDeMayo.jsx'
import Cordillera from '../marca/Cordillera.jsx'
import Particulas from './Particulas.jsx'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      {/* Fondo: cielo nocturno + sol + polvo + cordillera */}
      <div className="hero__cielo" aria-hidden="true" />
      <SolDeMayo className="hero__sol" size={620} rayos={28} />
      <Particulas className="hero__particulas" />
      <Cordillera className="hero__cordillera" />

      <div className="contenedor hero__contenido">
        <motion.span
          className="hero__eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          San Juan · Argentina · desde 2003
        </motion.span>

        <motion.h1
          className="hero__nombre"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
        >
          ETÁN
        </motion.h1>

        <motion.p
          className="hero__lema"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Demolición, piedra bola, veredas y obra civil.
          <br />
          Construimos sobre bases firmes.
        </motion.p>

        <motion.div
          className="hero__acciones"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32 }}
        >
          <Link to="/obras" className="boton boton--principal">
            Ver proyectos <FiArrowRight />
          </Link>
          <Link to="/presupuesto" className="hero__link-secundario">
            Pedir presupuesto
          </Link>
        </motion.div>
      </div>

      {/* Flecha que rebota indicando scroll */}
      <a href="#proyectos" className="hero__scroll" aria-label="Bajar a proyectos">
        <FiArrowDown />
      </a>
    </section>
  )
}
