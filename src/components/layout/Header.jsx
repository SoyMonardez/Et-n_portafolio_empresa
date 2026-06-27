import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import { NAV } from '../../config/rutas.js'
import BotonTema from '../ui/BotonTema.jsx'
import './Header.css'

export default function Header() {
  const [abierto, setAbierto] = useState(false)
  const cerrar = () => setAbierto(false)

  return (
    <header className="header">
      <div className="contenedor header__fila">
        <Link to="/" className="header__logo" onClick={cerrar}>
          {/* Placeholder del logo hasta tener el definitivo */}
          <span className="header__logo-marca">ETÁN</span>
          <span className="header__logo-bajada">Construcción</span>
        </Link>

        <nav className={`header__nav ${abierto ? 'header__nav--abierto' : ''}`}>
          {NAV.map((item) => (
            <NavLink
              key={item.ruta}
              to={item.ruta}
              end={item.ruta === '/'}
              className={({ isActive }) =>
                `header__link ${isActive ? 'header__link--activo' : ''}`
              }
              onClick={cerrar}
            >
              {item.texto}
            </NavLink>
          ))}
          <Link to="/presupuesto" className="boton boton--principal header__cta" onClick={cerrar}>
            Pedir presupuesto
          </Link>
        </nav>

        <div className="header__acciones">
          <BotonTema />
          <button
            className="header__menu"
            onClick={() => setAbierto((a) => !a)}
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={abierto}
          >
            {abierto ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
    </header>
  )
}
