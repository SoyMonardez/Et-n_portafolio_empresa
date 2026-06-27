import { Link } from 'react-router-dom'
import { FiInstagram, FiFacebook, FiPhone, FiMail, FiMapPin } from 'react-icons/fi'
import { NAV } from '../../config/rutas.js'
import './Footer.css'

export default function Footer() {
  const anio = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="contenedor footer__grid">
        <div className="footer__col">
          <span className="footer__marca">ETÁN</span>
          <p className="footer__texto">
            Empresa constructora de San Juan. Demolición, piedra bola, veredas,
            obra civil y alquiler de maquinaria. Más de 20 años de trayectoria.
          </p>
          <div className="footer__redes">
            {/* Los enlaces reales se cargarán desde el panel de administración */}
            <a href="#" aria-label="Instagram" className="footer__red"><FiInstagram /></a>
            <a href="#" aria-label="Facebook" className="footer__red"><FiFacebook /></a>
          </div>
        </div>

        <div className="footer__col">
          <h3 className="footer__titulo">Páginas</h3>
          {NAV.map((item) => (
            <Link key={item.ruta} to={item.ruta} className="footer__enlace">
              {item.texto}
            </Link>
          ))}
        </div>

        <div className="footer__col">
          <h3 className="footer__titulo">Contacto</h3>
          <p className="footer__dato"><FiPhone /> A confirmar</p>
          <p className="footer__dato"><FiMail /> A confirmar</p>
          <p className="footer__dato"><FiMapPin /> San Juan, Argentina</p>
        </div>
      </div>

      <div className="contenedor footer__base">
        <span>© {anio} Etán. Todos los derechos reservados.</span>
        <Link to="/legal" className="footer__legal">Política de privacidad y cookies</Link>
      </div>
    </footer>
  )
}
