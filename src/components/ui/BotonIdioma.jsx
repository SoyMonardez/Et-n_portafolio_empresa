import { useIdioma } from '../../context/IdiomaContext.jsx'

export default function BotonIdioma() {
  const { idioma, alternar } = useIdioma()
  const esIngles = idioma === 'en'
  return (
    <button
      className="boton-tema boton-idioma"
      onClick={alternar}
      title={esIngles ? 'Switch to Spanish' : 'Cambiar a inglés'}
      data-no-traducir
    >
      {esIngles ? 'ES' : 'EN'}
    </button>
  )
}
