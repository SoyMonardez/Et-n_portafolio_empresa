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

function setLink(rel, href) {
  if (!href) return
  let tag = document.head.querySelector(`link[rel="${rel}"]`)
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', rel)
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
}

// Define el título, la descripción y las URLs canónicas/sociales de cada
// página para Google y redes sociales (SEO). Se llama una vez por página.
// Las URLs salen absolutas usando el origin real (localhost en desarrollo,
// el dominio definitivo en producción) sin tener que tocar el código.
export default function useSeo({ titulo, descripcion, imagen = '/img/og.jpg', noindex = false }) {
  useEffect(() => {
    const origin = window.location.origin
    const url = origin + window.location.pathname
    const imagenAbs = imagen?.startsWith('http') ? imagen : origin + imagen
    const tituloCompleto = titulo ? `${titulo} | ${SITIO}` : SITIO

    document.title = tituloCompleto
    setMeta('description', descripcion)

    // robots: las páginas privadas (admin) y los 404 no deben indexarse.
    // Se setea en cada navegación para no arrastrar el valor entre rutas.
    setMeta(
      'robots',
      noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    )

    // Canónica: evita contenido duplicado y fija la URL preferida de la página.
    setLink('canonical', url)

    // Open Graph (WhatsApp, Facebook)
    setMeta('og:type', 'website', 'property')
    setMeta('og:site_name', SITIO, 'property')
    setMeta('og:locale', 'es_AR', 'property')
    setMeta('og:title', tituloCompleto, 'property')
    setMeta('og:description', descripcion, 'property')
    setMeta('og:url', url, 'property')
    setMeta('og:image', imagenAbs, 'property')

    // Twitter / X
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', tituloCompleto)
    setMeta('twitter:description', descripcion)
    setMeta('twitter:image', imagenAbs)
  }, [titulo, descripcion, imagen, noindex])
}
