import { motion } from 'framer-motion'

// Animación de aparición suave al entrar en pantalla.
// Solo usa opacity y transform (rendimiento) y respeta "reducir movimiento".
// "as" permite renderizar como otra etiqueta (ej. "li" dentro de un <ol>),
// para no romper la estructura válida de listas.
export default function Aparecer({ children, delay = 0, y = 18, className, as = 'div' }) {
  const Etiqueta = motion[as]
  return (
    <Etiqueta
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </Etiqueta>
  )
}
