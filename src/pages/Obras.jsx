import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import Encabezado from '../components/util/Encabezado.jsx'
import Aparecer from '../components/util/Aparecer.jsx'
import useSeo from '../hooks/useSeo.js'
import { PROYECTOS } from '../data/proyectos.js'
import '../styles/catalogo.css'

export default function Obras() {
  useSeo({
    titulo: 'Obras realizadas',
    descripcion:
      'Galería de obras de Etán: demolición, veredas, piedra bola y obra civil ejecutadas en San Juan y San Luis.',
  })

  const categorias = useMemo(
    () => ['Todas', ...new Set(PROYECTOS.map((p) => p.categoria))],
    []
  )
  const [filtro, setFiltro] = useState('Todas')
  const lista = filtro === 'Todas' ? PROYECTOS : PROYECTOS.filter((p) => p.categoria === filtro)

  return (
    <>
      <Encabezado
        titulo="Obras realizadas"
        bajada="Una muestra de los trabajos que llevamos adelante para municipios, empresas y particulares."
      />
      <section className="seccion contenedor">
        <div className="catalogo__filtros">
          {categorias.map((c) => (
            <button
              key={c}
              className={`catalogo__filtro ${filtro === c ? 'catalogo__filtro--on' : ''}`}
              onClick={() => setFiltro(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {lista.length === 0 ? (
          <p className="catalogo__vacio">No hay obras cargadas en esta categoría todavía.</p>
        ) : (
          <div className="catalogo">
            {lista.map((p, i) => (
              <Aparecer key={p.id} delay={i * 0.06}>
                <article className="catalogo-card">
                  <div className="catalogo-card__foto">
                    <img src={p.img} alt={p.titulo} loading="lazy" width="800" height="600" />
                    <span className="catalogo-card__categoria">{p.categoria}</span>
                  </div>
                  <div className="catalogo-card__cuerpo">
                    <h3 className="catalogo-card__titulo">{p.titulo}</h3>
                    <span className="catalogo-card__meta">{p.lugar} · {p.anio}</span>
                  </div>
                </article>
              </Aparecer>
            ))}
          </div>
        )}

        <Aparecer className="cierre" y={24}>
          <div className="cierre__texto">
            <h2 className="cierre__titulo">¿Tenés una obra para hacer?</h2>
            <p className="cierre__bajada">Contanos los detalles y te preparamos un presupuesto sin cargo.</p>
          </div>
          <Link to="/presupuesto" className="boton boton--principal cierre__boton">
            Solicitar presupuesto <FiArrowRight />
          </Link>
        </Aparecer>
      </section>
    </>
  )
}
