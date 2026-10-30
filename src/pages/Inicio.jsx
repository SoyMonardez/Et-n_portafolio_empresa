import { useRef } from 'react'
import Hero from '../components/papel/Hero.jsx'
import Obras from '../components/papel/Obras.jsx'
import { Servicios, Nosotros, Testimonios } from '../components/papel/Secciones.jsx'
import { Costura } from '../components/papel/Costura.jsx'
import useSeo from '../hooks/useSeo.js'

// Landing "de papel". La barra, el pie y la textura los pone el Layout.
// El bloque negro de la portada es el punto de partida del panel de obras.
export default function Inicio() {
  useSeo({
    titulo: 'Empresa constructora en San Juan',
    descripcion:
      'Etán: empresa constructora de San Juan desde 2003. Demolición, piedra bola, veredas, obra civil y alquiler de maquinaria para municipios y empresas.',
  })
  const bloque = useRef(null)

  return (
    <>
      <Hero bloqueRef={bloque} />
      <Obras desde={bloque} />
      <Costura variante="rasgada" />
      <Nosotros />
      <Servicios />
      <Testimonios />
    </>
  )
}
