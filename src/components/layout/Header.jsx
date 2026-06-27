import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import { NAV } from '../../config/rutas.js'
import BotonTema from '../ui/BotonTema.jsx'
import './Header.css'

export default function Header() {
  const [abierto, setAbierto] = useState(false)
  const [scrolleado, setScrolleado] = useState(false)
  const { pathname } = useLocation()
  const cerrar = () => setAbierto(false)

  // En el inicio, el header arranca translúcido sobre el hero y se
  // vuelve sólido al bajar. En el resto de las páginas, siempre sólido.
  const sobreHero = pathname === '/' && !scrolleado && !abierto

  useEffect(() => {
    const onScroll = () => setScrolleado(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header ${sobreHero ? 'header--transparente' : 'header--solido'}`}>
      <div className="contenedor header__fila">
        <Link to="/" className="header__logo" onClick={cerrar}>
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
