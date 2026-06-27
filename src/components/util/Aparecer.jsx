import { motion } from 'framer-motion'

// Animación de aparición suave al entrar en pantalla.
// Solo usa opacity y transform (rendimiento) y respeta "reducir movimiento".
export default function Aparecer({ children, delay = 0, y = 18, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}
