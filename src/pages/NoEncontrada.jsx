import { BotonPapel } from '../components/papel/Piezas.jsx'
import { CosturaGarabato } from '../components/papel/Costura.jsx'
import useSeo from '../hooks/useSeo.js'

export default function NoEncontrada() {
  useSeo({ titulo: 'Página no encontrada', descripcion: 'La página que buscás no existe o fue movida.' })
  return (
    <section className="pp-hero pp-hero--404">
      <div className="pp-hero__centro">
        <div className="pp-hero__bloque" aria-hidden="true" />
        <h1 className="pp-hero__titulo">404</h1>
      </div>
      <CosturaGarabato semilla={11} />
      <div className="pp-hero__pie pp-hero__pie--404">
        <span>No encontramos la página que buscás.</span>
        <BotonPapel a="/" texto="Volver al inicio" />
      </div>
    </section>
  )
}
