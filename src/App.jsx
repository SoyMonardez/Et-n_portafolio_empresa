import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import Inicio from './pages/Inicio.jsx'
import IrArriba from './components/util/IrArriba.jsx'
import Analitica from './components/util/Analitica.jsx'

// La home (página de aterrizaje) se carga de entrada para que no haya un
// estado intermedio "Cargando…" que provoque un salto de layout (CLS) ni
// demore el LCP. El resto de las páginas sí se cargan solo al visitarlas.
const Servicios = lazy(() => import('./pages/Servicios.jsx'))
const Obras = lazy(() => import('./pages/Obras.jsx'))
const Maquinaria = lazy(() => import('./pages/Maquinaria.jsx'))
const Presupuesto = lazy(() => import('./pages/Presupuesto.jsx'))
const Empleo = lazy(() => import('./pages/Empleo.jsx'))
const Nosotros = lazy(() => import('./pages/Nosotros.jsx'))
const Contacto = lazy(() => import('./pages/Contacto.jsx'))
const Legal = lazy(() => import('./pages/Legal.jsx'))
const Admin = lazy(() => import('./pages/Admin.jsx'))
const NoEncontrada = lazy(() => import('./pages/NoEncontrada.jsx'))

// Reserva el alto de la pantalla para que, al navegar a otra página, el footer
// no salte mientras se descarga el contenido (evita CLS).
function Cargando() {
  return (
    <div className="cargando" aria-busy="true" style={{ minHeight: '100vh' }}>
      Cargando…
    </div>
  )
}

export default function App() {
  const location = useLocation()

  // El panel admin es una app aparte: sin header/footer/cookies del sitio público.
  if (location.pathname.startsWith('/admin')) {
    return (
      <Suspense fallback={<Cargando />}>
        <Admin />
      </Suspense>
    )
  }

  return (
    <Layout>
      <IrArriba />
      <Analitica />
      <Suspense fallback={<Cargando />}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/obras" element={<Obras />} />
          <Route path="/maquinaria" element={<Maquinaria />} />
          <Route path="/presupuesto" element={<Presupuesto />} />
          <Route path="/empleo" element={<Empleo />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}
