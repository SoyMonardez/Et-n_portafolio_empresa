import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import { NAV } from '../../config/rutas.js'
import BotonTema from '../ui/BotonTema.jsx'
import BotonIdioma from '../ui/BotonIdioma.jsx'
import './Header.css'

export default function Header() {
  const [abierto, setAbierto] = useState(false)
  const [scrolleado, setScrolleado] = useState(false)
  const [sobreRevelar, setSobreRevelar] = useState(false)
  const navRef = useRef(null)
  const menuRef = useRef(null)
  const { pathname } = useLocation()
  const cerrar = () => setAbierto(false)

  const sobreHero = pathname === '/' && !scrolleado
  const transparente = pathname === '/' && !abierto && (sobreHero || sobreRevelar)

  useEffect(() => {
    const onScroll = () => setScrolleado(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (pathname !== '/') {
      setSobreRevelar(false)
      return undefined
    }

    let raf = 0
    const medir = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const stickyVideo = document.querySelector('.revelar__sticky')
        const cubreVideo = document.querySelector('.revelar__cubre')
        if (!stickyVideo || !cubreVideo) {
          setSobreRevelar(false)
          return
        }

        const stickyRect = stickyVideo.getBoundingClientRect()
        const cubreRect = cubreVideo.getBoundingClientRect()
        const lineaHeader = 72
        setSobreRevelar(
          stickyRect.top <= lineaHeader &&
          stickyRect.bottom > lineaHeader &&
          cubreRect.top > lineaHeader
        )
      })
    }

    medir()
    window.addEventListener('scroll', medir, { passive: true })
    window.addEventListener('resize', medir)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', medir)
      window.removeEventListener('resize', medir)
    }
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = abierto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [abierto])

  useEffect(() => {
    if (!abierto) return undefined

    const cerrarDesdeAfuera = (event) => {
      const objetivo = event.target
      if (navRef.current?.contains(objetivo) || menuRef.current?.contains(objetivo)) return
      setAbierto(false)
    }

    document.addEventListener('pointerdown', cerrarDesdeAfuera, true)
    return () => document.removeEventListener('pointerdown', cerrarDesdeAfuera, true)
  }, [abierto])

  return (
    <header
      className={`header ${transparente ? 'header--transparente' : 'header--solido'} ${sobreRevelar ? 'header--sobre-media' : ''}`}
    >
      <div className="contenedor header__fila">
        <Link to="/" className="header__logo" onClick={cerrar} data-no-traducir>
          <span className="header__logo-marca">ETÁN</span>
          <span className="header__logo-bajada">Construcción</span>
        </Link>

        <nav ref={navRef} className={`header__nav ${abierto ? 'header__nav--abierto' : ''}`}>
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
          <BotonIdioma />
          <BotonTema />
          <button
            ref={menuRef}
            className="header__menu"
            onClick={() => setAbierto((a) => !a)}
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={abierto}
          >
            {abierto ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      <button
        className={`header__backdrop ${abierto ? 'header__backdrop--visible' : ''}`}
        aria-hidden={!abierto}
        tabIndex={-1}
        onClick={cerrar}
      />
    </header>
  )
}
