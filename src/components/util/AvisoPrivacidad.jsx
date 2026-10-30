import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './AvisoPrivacidad.css'

const CLAVE = 'etan-cookies'

// Cartel de cookies. Mientras no se acepten, no se activa ninguna medición
// de visitas (ver Legal). La elección queda guardada en este navegador.
export default function AvisoPrivacidad() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(CLAVE)) setVisible(true)
  }, [])

  function elegir(valor) {
    localStorage.setItem(CLAVE, valor)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="aviso-datos" role="dialog" aria-label="Aviso de cookies">
      <div className="aviso-datos__caja">
        <p className="aviso-datos__texto">
          Usamos cookies propias para que el sitio funcione bien y, si lo
          aceptás, para medir visitas de forma anónima y mejorar el contenido.{' '}
          <Link to="/legal">Más información</Link>.
        </p>
        <div className="aviso-datos__botones">
          <button className="boton boton--borde" onClick={() => elegir('rechazadas')}>
            Rechazar
          </button>
          <button className="boton boton--principal" onClick={() => elegir('aceptadas')}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
