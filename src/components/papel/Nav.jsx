import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { BotonPapel } from './Piezas.jsx'
import { alDesplazar, irA } from './desplazamiento.js'

// En la portada, los que tienen `ancla` bajan a su sección en vez de cambiar de página.
export const ENLACES = [
  { ruta: '/obras', texto: 'Obras', ancla: 'obras' },
  { ruta: '/servicios', texto: 'Servicios', ancla: 'servicios' },
  { ruta: '/maquinaria', texto: 'Maquinaria' },
  { ruta: '/nosotros', texto: 'Nosotros', ancla: 'nosotros' },
  { ruta: '/contacto', texto: 'Contacto' },
]

export function Enlace({ e, onClick, className }) {
  const enInicio = useLocation().pathname === '/'
  if (enInicio && e.ancla) {
    return (
      <a href={`#${e.ancla}`} className={className} onClick={(ev) => { ev.preventDefault(); onClick?.(); irA(e.ancla) }}>
        {e.texto}
      </a>
    )
  }
  return <NavLink to={e.ruta} className={className} onClick={onClick}>{e.texto}</NavLink>
}

// Barra superior: ancha y transparente arriba de todo; al bajar se
// encoge a una tarjeta blanca centrada (con histéresis para no titilar).
// En el celular los enlaces van en un menú a pantalla completa.
export default function Nav() {
  const [pegada, setPegada] = useState(false)
  const [menu, setMenu] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => alDesplazar((y) => {
    setPegada((p) => (p ? y > 20 : y > 60))
  }), [])

  useEffect(() => { setMenu(false) }, [pathname])

  return (
    <nav className={`pp-nav ${menu ? 'con-menu' : ''}`}>
      <div className={`pp-nav__barra ${pegada || menu ? 'es-pegada' : ''}`}>
        <Link to="/" className="pp-nav__marca">
          Etán<span className="pp-nav__punto">.</span>
        </Link>
        <div className="pp-nav__derecha">
          <div className="pp-nav__enlaces">
            {ENLACES.map((e) => <Enlace key={e.ruta} e={e} />)}
          </div>
          <BotonPapel a="/presupuesto" texto="Pedir presupuesto" />
          <button
            type="button"
            className="pp-nav__menu pp-mono"
            aria-expanded={menu}
            aria-controls="pp-menu"
            onClick={() => setMenu((m) => !m)}
          >
            {menu ? 'Cerrar' : 'Menú'}
          </button>
        </div>
      </div>
      <div id="pp-menu" className="pp-menu" hidden={!menu}>
        {ENLACES.map((e) => (
          <Enlace key={e.ruta} e={e} className="pp-menu__enlace" onClick={() => setMenu(false)} />
        ))}
        <div className="pp-menu__pie">
          <BotonPapel a="/presupuesto" texto="Pedir presupuesto" />
          <Link to="/empleo" className="pp-mono" onClick={() => setMenu(false)}>Trabajá con nosotros</Link>
        </div>
      </div>
    </nav>
  )
}
