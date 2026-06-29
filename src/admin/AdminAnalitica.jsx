import { useEffect, useState, useCallback } from 'react'
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'
import { obtenerAnalitica, limpiarToken } from '../lib/adminApi.js'

const PERIODOS = [
  { dias: 7, label: '7 días' },
  { dias: 30, label: '30 días' },
  { dias: 90, label: '90 días' },
]

// Colores derivados de los tokens del sitio (tinta + grises).
const COLORES = ['#16161a', '#6e6e70', '#9a9a9c', '#c4c3bd', '#e0dfda']

function diaCorto(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
}

export default function AdminAnalitica({ onSesionVencida }) {
  const [dias, setDias] = useState(30)
  const [data, setData] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cargar = useCallback(async () => {
    setCargando(true)
    setError('')
    try {
      const d = await obtenerAnalitica(dias)
      setData(d)
    } catch (err) {
      if (err.message?.includes('autorizad') || err.message?.includes('vencida')) {
        limpiarToken(); onSesionVencida(); return
      }
      setError(err.message || 'No pudimos cargar las métricas.')
    } finally {
      setCargando(false)
    }
  }, [dias, onSesionVencida])

  useEffect(() => { cargar() }, [cargar])

  return (
    <>
      <div className="admin-cab">
        <h2 className="admin-panel__titulo">Visitas y métricas</h2>
        <div className="ana-periodos">
          {PERIODOS.map((p) => (
            <button
              key={p.dias}
              className={`catalogo__filtro ${dias === p.dias ? 'catalogo__filtro--on' : ''}`}
              onClick={() => setDias(p.dias)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="formE__ayuda" style={{ color: 'var(--error)' }}>{error}</p>}
      {cargando || !data ? (
        <p style={{ color: 'var(--text-suave)' }}>Cargando…</p>
      ) : data.totales.visitas === 0 ? (
        <p style={{ color: 'var(--text-suave)' }}>
          Todavía no hay visitas registradas en este período. Las visitas se miden cuando
          los usuarios aceptan las cookies.
        </p>
      ) : (
        <div className="ana">
          {/* Tarjetas resumen */}
          <div className="ana-cards">
            <Card titulo="Visitas" valor={data.totales.visitas} />
            <Card titulo="Visitantes únicos" valor={data.totales.unicos} />
            <Card titulo="Presupuestos" valor={data.conversiones.presupuestos} />
            <Card titulo="Contactos" valor={data.conversiones.contactos} />
            <Card titulo="Alquileres" valor={data.conversiones.alquiler} />
            <Card titulo="Postulaciones" valor={data.conversiones.postulaciones} />
          </div>

          {/* Visitas por día */}
          <Panel titulo="Visitas por día">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={data.porDia.map((d) => ({ ...d, dia: diaCorto(d.dia) }))}>
                <defs>
                  <linearGradient id="gVis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16161a" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#16161a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--borde)" vertical={false} />
                <XAxis dataKey="dia" tick={{ fontSize: 12 }} stroke="var(--text-suave)" />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="var(--text-suave)" width={28} />
                <Tooltip />
                <Area type="monotone" dataKey="visitas" name="Visitas" stroke="#16161a" strokeWidth={2} fill="url(#gVis)" />
                <Area type="monotone" dataKey="unicos" name="Únicos" stroke="#9a9a9c" strokeWidth={1.5} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>

          <div className="ana-grid2">
            <Panel titulo="De dónde llegan (fuentes)">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={data.fuentes} dataKey="total" nameKey="fuente" outerRadius={90} label>
                    {data.fuentes.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <Leyenda items={data.fuentes} campo="fuente" />
            </Panel>

            <Panel titulo="Páginas más vistas">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data.topPaginas} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" allowDecimals={false} hide />
                  <YAxis type="category" dataKey="path" width={120} tick={{ fontSize: 12 }} stroke="var(--text-suave)" />
                  <Tooltip />
                  <Bar dataKey="total" name="Visitas" fill="#16161a" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            <Panel titulo="Dispositivos">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={data.dispositivos} dataKey="total" nameKey="device" innerRadius={50} outerRadius={90}>
                    {data.dispositivos.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <Leyenda items={data.dispositivos} campo="device" />
            </Panel>

            <Panel titulo="Ubicación">
              {data.paises.length === 0 ? (
                <p style={{ color: 'var(--text-suave)', fontSize: '0.9rem' }}>
                  Sin datos de ubicación (se completa cuando el sitio está publicado con dominio).
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={data.paises}>
                    <XAxis dataKey="country" tick={{ fontSize: 12 }} stroke="var(--text-suave)" />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="var(--text-suave)" width={28} />
                    <Tooltip />
                    <Bar dataKey="total" name="Visitas" fill="#16161a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Panel>
          </div>
        </div>
      )}
    </>
  )
}

function Card({ titulo, valor }) {
  return (
    <div className="ana-card">
      <span className="ana-card__valor">{valor}</span>
      <span className="ana-card__titulo">{titulo}</span>
    </div>
  )
}

function Panel({ titulo, children }) {
  return (
    <section className="ana-panel">
      <h3 className="ana-panel__titulo">{titulo}</h3>
      {children}
    </section>
  )
}

function Leyenda({ items, campo }) {
  return (
    <ul className="ana-leyenda">
      {items.map((it, i) => (
        <li key={i}>
          <span className="ana-leyenda__punto" style={{ background: COLORES[i % COLORES.length] }} />
          {it[campo]} <strong>{it.total}</strong>
        </li>
      ))}
    </ul>
  )
}
