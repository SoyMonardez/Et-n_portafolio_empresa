import { useEffect } from 'react'

const SITIO = 'Etán Construcciones'

function setMeta(name, content, attr = 'name') {
  if (!content) return
  let tag = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

// Define el título y la descripción de cada página para Google y redes
// sociales (SEO). Se llama una vez al entrar a cada página.
export default function useSeo({ titulo, descripcion }) {
  useEffect(() => {
    const tituloCompleto = titulo ? `${titulo} | ${SITIO}` : SITIO
    document.title = tituloCompleto
    setMeta('description', descripcion)
    setMeta('og:title', tituloCompleto, 'property')
    setMeta('og:description', descripcion, 'property')
  }, [titulo, descripcion])
}
