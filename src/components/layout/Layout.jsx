import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { PaperTexture } from '@paper-design/shaders-react'
import Nav from '../papel/Nav.jsx'
import Pie from '../papel/Pie.jsx'
import AvisoPrivacidad from '../util/AvisoPrivacidad.jsx'
import { iniciarDesplazamiento, detenerDesplazamiento, arriba } from '../papel/desplazamiento.js'
import '../papel/papel.css'

// Marco "de papel" de todo el sitio público: textura, barra, pie y scroll suave.
// La textura usa Paper Shaders (Apache 2.0, https://shaders.paper.design).
export default function Layout({ children }) {
  const { pathname } = useLocation()

  useEffect(() => {
    document.documentElement.classList.add('pp-activo')
    iniciarDesplazamiento()
    return () => {
      detenerDesplazamiento()
      document.documentElement.classList.remove('pp-activo')
    }
  }, [])

  // Al cambiar de página, vuelve arriba sin animación.
  useEffect(() => { arriba() }, [pathname])

  return (
    <div className="papel">
      <PaperTexture
        className="pp-hoja"
        colorBack="#ffffff"
        colorPaper="#ffffff"
        colorShadow="#cfc8b8"
        roughness={0.45}
        roughnessSize={0.6}
        fiber={0.35}
        fiberSize={0.4}
        folds={0.18}
        crumples={0.25}
        drops={0.12}
        seed={6}
        fit="cover"
        speed={0}
      />
      <Nav />
      <main>{children}</main>
      <Pie />
      <AvisoPrivacidad />
    </div>
  )
}
