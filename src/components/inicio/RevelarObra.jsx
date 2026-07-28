import './RevelarObra.css'

// Video auto-hospedado (bajado de Pixabay y comprimido) para no depender de un
// CDN externo ni setear cookies de terceros. Se reemplaza por el video propio
// cuando esté listo.
const VIDEO_OBRA = '/video/obra.mp4'

const POSTER_OBRA = '/img/obra-poster.webp'

// Banda a pantalla completa entre la linea de tiempo y "Quienes somos".
// El video queda fijo mientras la seccion siguiente sube por encima.
export default function RevelarObra({ children }) {
  return (
    <div className="revelar">
      <div className="revelar__sticky">
        <video
          className="revelar__media"
          src={VIDEO_OBRA}
          poster={POSTER_OBRA}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Maquinaria trabajando sobre tierra en una obra de construccion"
        />
      </div>

      <div className="revelar__cubre">{children}</div>
    </div>
  )
}
