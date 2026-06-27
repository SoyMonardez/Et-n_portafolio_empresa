import { FiSun, FiMoon } from 'react-icons/fi'
import { useTema } from '../../context/ThemeContext.jsx'

export default function BotonTema() {
  const { tema, alternar } = useTema()
  const esOscuro = tema === 'oscuro'
  return (
    <button
      className="boton-tema"
      onClick={alternar}
      aria-label={esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={esOscuro ? 'Modo claro' : 'Modo oscuro'}
    >
      {esOscuro ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  )
}
