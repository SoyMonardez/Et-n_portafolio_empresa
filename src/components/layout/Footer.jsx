import { Link } from 'react-router-dom'
import { FiInstagram, FiFacebook, FiPhone, FiMail, FiMapPin } from 'react-icons/fi'
import { NAV } from '../../config/rutas.js'
import useConfig from '../../hooks/useConfig.js'
import './Footer.css'

export default function Footer() {
  const anio = new Date().getFullYear()
  const cfg = useConfig()

  return (
    <footer className="footer">
      <div className="contenedor footer__grid">
        <div className="footer__col footer__col--brand">
          <span className="footer__marca" data-no-traducir>ETAN</span>
          <p className="footer__texto">
            Constructora de San Juan con experiencia en demolicion, veredas, obra civil, piedra bola y apoyo con maquinaria para distintos tipos de obra.
          </p>
          <div className="footer__redes">
            {cfg.instagram && (
              <a href={cfg.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="footer__red"><FiInstagram /></a>
            )}
            {cfg.facebook && (
              <a href={cfg.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="footer__red"><FiFacebook /></a>
            )}
          </div>
        </div>

        <div className="footer__col footer__col--nav">
          <h3 className="footer__titulo">Paginas</h3>
          {NAV.map((item) => (
            <Link key={item.ruta} to={item.ruta} className="footer__enlace">
              {item.texto}
            </Link>
          ))}
        </div>

        <div className="footer__col footer__col--contacto">
          <h3 className="footer__titulo">Contacto</h3>
          <p className="footer__dato"><FiPhone /> {cfg.telefono || 'A confirmar'}</p>
          <p className="footer__dato"><FiMail /> {cfg.email || 'A confirmar'}</p>
          <p className="footer__dato"><FiMapPin /> {cfg.direccion || 'San Juan, Argentina'}</p>
        </div>
      </div>

      <div className="contenedor footer__base">
        <span>{`© ${anio} Etan Construcciones`}</span>
        <Link to="/legal" className="footer__legal">Politica de privacidad y cookies</Link>
      </div>
    </footer>
  )
}
