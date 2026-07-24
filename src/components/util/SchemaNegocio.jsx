import { useEffect } from 'react'
import useConfig from '../../hooks/useConfig.js'

// Datos estructurados (Schema.org) de la empresa, para que Google entienda
// qué es el sitio y pueda mostrar la ficha de la empresa en los resultados.
export default function SchemaNegocio() {
  const cfg = useConfig()

  useEffect(() => {
    const origin = window.location.origin
    const sameAs = [cfg.instagram, cfg.facebook].filter(Boolean)
    const servicios = [
      'Demolición',
      'Piedra bola',
      'Veredas',
      'Obra civil',
      'Alquiler de maquinaria',
      'Mantenimiento de campamentos mineros',
    ]
    const datos = {
      '@context': 'https://schema.org',
      '@type': 'GeneralContractor',
      '@id': `${origin}/#empresa`,
      name: 'Etán',
      legalName: 'Etán Construcciones',
      url: origin + '/',
      description:
        'Empresa constructora de San Juan, Argentina, especializada en demolición, ' +
        'piedra bola, veredas, obra civil y alquiler de maquinaria. Más de 20 años de trayectoria.',
      image: origin + '/img/og.jpg',
      logo: origin + '/favicon.svg',
      telephone: cfg.telefono || undefined,
      email: cfg.email || undefined,
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: cfg.direccion || undefined,
        addressLocality: 'San Juan',
        addressRegion: 'San Juan',
        addressCountry: 'AR',
      },
      areaServed: {
        '@type': 'State',
        name: 'San Juan',
      },
      foundingDate: '2003',
      knowsAbout: servicios,
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Servicios',
        itemListElement: servicios.map((s) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: s },
        })),
      },
      sameAs: sameAs.length ? sameAs : undefined,
    }

    let tag = document.getElementById('schema-negocio')
    if (!tag) {
      tag = document.createElement('script')
      tag.type = 'application/ld+json'
      tag.id = 'schema-negocio'
      document.head.appendChild(tag)
    }
    tag.textContent = JSON.stringify(datos)
  }, [cfg])

  return null
}
