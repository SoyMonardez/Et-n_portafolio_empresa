import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowDown, FiArrowRight } from 'react-icons/fi'
import './Hero.css'

const sube = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Hero() {
  return (
    <section className="heroE">
      <div className="contenedor">
        {/* Etiquetas superiores, estilo editorial */}
        <motion.div
          className="heroE__labels"
          variants={sube}
          initial="hidden"
          animate="show"
        >
          <span>San Juan · Argentina</span>
          <span>Construcción &amp; demolición</span>
          <span>Desde 2003</span>
        </motion.div>

        {/* Nombre gigante + foto superpuesta */}
        <div className="heroE__stage">
          <motion.h1
            className="heroE__word"
            variants={sube}
            initial="hidden"
            animate="show"
            custom={1}
          >
            ETÁN
          </motion.h1>

          <motion.figure
            className="heroE__media"
            variants={sube}
            initial="hidden"
            animate="show"
            custom={2}
          >
            <img
              src="/img/hero.jpg"
              alt="Obra de construcción de Etán en San Juan"
              width="1600"
              height="1000"
              fetchPriority="high"
            />
            <div className="heroE__media-pies">
              <div className="heroE__chips">
                <span>Demolición</span>
                <span>Veredas</span>
                <span>Obra civil</span>
              </div>
              <span className="heroE__lugar">San Juan, AR</span>
            </div>
          </motion.figure>
        </div>

        {/* Bajada con acentos en serif itálica + acciones */}
        <div className="heroE__abajo">
          <motion.p
            className="heroE__lema"
            variants={sube}
            initial="hidden"
            animate="show"
            custom={3}
          >
            Espacios donde la ciudad <em>trabaja</em>, <em>crece</em> y{' '}
            <em>perdura</em>.
          </motion.p>
          <motion.div
            className="heroE__acciones"
            variants={sube}
            initial="hidden"
            animate="show"
            custom={4}
          >
            <Link to="/obras" className="boton boton--principal">
              Ver proyectos <FiArrowRight />
            </Link>
            <Link to="/presupuesto" className="heroE__link">
              Pedir presupuesto
            </Link>
          </motion.div>
        </div>
      </div>

      <a href="#proyectos" className="heroE__scroll" aria-label="Bajar a proyectos">
        <FiArrowDown />
      </a>
    </section>
  )
}
