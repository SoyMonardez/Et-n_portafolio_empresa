import { Suspense, lazy } from 'react'
import Hero from '../components/inicio/Hero.jsx'
import useSeo from '../hooks/useSeo.js'
import './Inicio.css'

// El hero se carga de entrada (es lo primero que se ve y define el LCP).
// El resto de las secciones se cargan aparte para no demorar ese primer
// pintado; al estar debajo del pliegue, su llegada no provoca CLS.
const InicioResto = lazy(() => import('./InicioResto.jsx'))

export default function Inicio() {
  useSeo({
    titulo: 'Empresa constructora en San Juan',
    descripcion:
      'Etán: empresa constructora de San Juan desde 2003. Demolición, piedra bola, veredas, obra civil y alquiler de maquinaria para municipios y empresas.',
  })
  return (
    <div className="inicio-revelar">
      <div className="inicio-revelar__sticky">
        <Hero />
      </div>
      <div className="inicio-revelar__cubre">
        <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
          <InicioResto />
        </Suspense>
      </div>
    </div>
  )
}
