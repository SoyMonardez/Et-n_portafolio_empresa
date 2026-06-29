import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowDown, FiArrowRight } from 'react-icons/fi'
import './Hero.css'

const sube = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Hero() {
  return (
    <section className="heroE">
      <div className="heroE__panel">
        <img
          className="heroE__img"
          src="/img/hero.jpg"
          alt="Equipo de Etán trabajando en una obra en San Juan"
          width="1920"
          height="1080"
          fetchPriority="high"
        />
        <div className="heroE__overlay" />

        <div className="contenedor heroE__inner">
          <motion.span
            className="heroE__eyebrow"
            variants={sube}
            initial="hidden"
            animate="show"
          >
            Empresa constructora · San Juan · desde 2003
          </motion.span>

          <motion.h1
            className="heroE__titulo"
            variants={sube}
            initial="hidden"
            animate="show"
            custom={1}
          >
            Construimos sobre bases <em>firmes</em>
          </motion.h1>

          <motion.p
            className="heroE__sub"
            variants={sube}
            initial="hidden"
            animate="show"
            custom={2}
          >
            Demolición, piedra bola, veredas y obra civil con equipo propio y más
            de 20 años de trayectoria en toda la provincia.
          </motion.p>

          <motion.div
            className="heroE__acciones"
            variants={sube}
            initial="hidden"
            animate="show"
            custom={3}
          >
            <Link to="/obras" className="boton boton--principal">
              Ver proyectos <FiArrowRight />
            </Link>
            <Link to="/presupuesto" className="boton heroE__btn-claro">
              Pedir presupuesto
            </Link>
          </motion.div>

          <motion.div
            className="heroE__chips"
            variants={sube}
            initial="hidden"
            animate="show"
            custom={4}
          >
            <span>Demolición</span>
            <span>Piedra bola</span>
            <span>Veredas</span>
            <span>Obra civil</span>
            <span>Mantenimiento de campamentos mineros</span>
          </motion.div>
        </div>
      </div>

      <a href="#proyectos" className="heroE__scroll" aria-label="Bajar a proyectos">
        <FiArrowDown />
      </a>
    </section>
  )
}
