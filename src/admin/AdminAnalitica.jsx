import { useEffect, useState, useCallback } from 'react'
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'
import { FiBriefcase, FiMousePointer, FiSend, FiTruck, FiUserCheck, FiUsers, FiZap } from 'react-icons/fi'
import { obtenerAnalitica, analizarMetricas, limpiarToken } from '../lib/adminApi.js'

const PERIODOS = [
  { dias: 7, label: '7 días' },
  { dias: 30, label: '30 días' },
  { dias: 90, label: '90 días' },
]

const COLORES = ['#f2c94c', '#37b6ff', '#36d399', '#ff7a45', '#b78cff', '#f76f8e']

const TARJETAS = [
  { clave: 'visitas', titulo: 'Visitas', tono: 'amarillo', icono: FiMousePointer },
  { clave: 'unicos', titulo: 'Visitantes únicos', tono: 'azul', icono: FiUsers },
  { clave: 'presupuestos', titulo: 'Presupuestos', tono: 'verde', icono: FiSend },
  { clave: 'contactos', titulo: 'Contactos', tono: 'naranja', icono: FiUserCheck },
  { clave: 'alquiler', titulo: 'Alquileres', tono: 'violeta', icono: FiTruck },
  { clave: 'postulaciones', titulo: 'Postulaciones', tono: 'rosa', icono: FiBriefcase },
]

function diaCorto(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
}

export default function AdminAnalitica({ onSesionVencida }) {
  const [dias, setDias] = useState(30)
  const [data, setData] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [analisis, setAnalisis] = useState('')
  const [analizando, setAnalizando] = useState(false)
  const [errorIa, setErrorIa] = useState('')

  async function analizar() {
    setErrorIa('')
    setAnalizando(true)
    try {
      const { texto } = await analizarMetricas(dias)
      setAnalisis(texto)
    } catch (err) {
      setErrorIa(err.message || 'No pudimos generar el análisis.')
    } finally {
      setAnalizando(false)
    }
  }

  const cargar = useCallback(async () => {
    setCargando(true)
    setError('')
    setAnalisis('')
    setErrorIa('')
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
          <div className="ana-cards">
            {TARJETAS.map((tarjeta) => (
              <Card
                key={tarjeta.clave}
                titulo={tarjeta.titulo}
                tono={tarjeta.tono}
                icono={tarjeta.icono}
                valor={
                  tarjeta.clave in data.totales
                    ? data.totales[tarjeta.clave]
                    : data.conversiones[tarjeta.clave]
                }
              />
            ))}
          </div>

          {/* Sugerencias de marketing con IA */}
          <section className="ana-panel ana-ia">
            <div className="ana-ia__cab">
              <h3 className="ana-panel__titulo" style={{ marginBottom: 0 }}>Sugerencias de marketing</h3>
              <button className="boton boton--principal" onClick={analizar} disabled={analizando}>
                <FiZap /> {analizando ? 'Analizando…' : 'Analizar y sugerir'}
              </button>
            </div>
            {errorIa && <p className="formE__ayuda" style={{ color: 'var(--error)' }}>{errorIa}</p>}
            {analisis
              ? <div className="ana-ia__texto">{analisis.split('\n').filter(Boolean).map((l, i) => <p key={i}>{l}</p>)}</div>
              : !errorIa && <p style={{ color: 'var(--text-suave)', fontSize: '0.9rem' }}>
                  Tocá "Analizar y sugerir" y la IA te recomienda, en palabras simples, a qué público apuntar y qué mejorar.
                </p>}
          </section>

          {/* Visitas por día */}
          <Panel titulo="Visitas por día">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={data.porDia.map((d) => ({ ...d, dia: diaCorto(d.dia) }))}>
                <defs>
                  <linearGradient id="gVis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f2c94c" stopOpacity={0.42} />
                    <stop offset="100%" stopColor="#f2c94c" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gUni" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#37b6ff" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#37b6ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 6" stroke="rgba(255,255,255,.1)" vertical={false} />
                <XAxis dataKey="dia" tick={{ fontSize: 12, fill: '#b9c0cc' }} axisLine={{ stroke: 'rgba(255,255,255,.18)' }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#b9c0cc' }} axisLine={{ stroke: 'rgba(255,255,255,.18)' }} tickLine={false} width={34} />
                <Tooltip content={<TooltipAnalitica />} />
                <Area type="monotone" dataKey="visitas" name="Visitas" stroke="#f2c94c" strokeWidth={3} fill="url(#gVis)" dot={{ r: 3, fill: '#f2c94c' }} activeDot={{ r: 5 }} />
                <Area type="monotone" dataKey="unicos" name="Únicos" stroke="#37b6ff" strokeWidth={2} fill="url(#gUni)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>

          <div className="ana-grid2">
            <Panel titulo="De dónde llegan (fuentes)">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={data.fuentes} dataKey="total" nameKey="fuente" innerRadius={46} outerRadius={92} paddingAngle={3}>
                    {data.fuentes.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
                  </Pie>
                  <Tooltip content={<TooltipAnalitica />} />
                </PieChart>
              </ResponsiveContainer>
              <Leyenda items={data.fuentes} campo="fuente" />
            </Panel>

            <Panel titulo="Páginas más vistas">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data.topPaginas} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="4 6" stroke="rgba(255,255,255,.08)" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} hide />
                  <YAxis type="category" dataKey="path" width={120} tick={{ fontSize: 12, fill: '#b9c0cc' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<TooltipAnalitica />} />
                  <Bar dataKey="total" name="Visitas" radius={[0, 6, 6, 0]}>
                    {data.topPaginas.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            <Panel titulo="Dispositivos">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={data.dispositivos} dataKey="total" nameKey="device" innerRadius={50} outerRadius={90}>
                    {data.dispositivos.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
                  </Pie>
                  <Tooltip content={<TooltipAnalitica />} />
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
                    <CartesianGrid strokeDasharray="4 6" stroke="rgba(255,255,255,.08)" vertical={false} />
                    <XAxis dataKey="country" tick={{ fontSize: 12, fill: '#b9c0cc' }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#b9c0cc' }} axisLine={false} tickLine={false} width={34} />
                    <Tooltip content={<TooltipAnalitica />} />
                    <Bar dataKey="total" name="Visitas" radius={[6, 6, 0, 0]}>
                      {data.paises.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
                    </Bar>
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

function Card({ titulo, valor, tono, icono: Icono }) {
  return (
    <div className={`ana-card ana-card--${tono}`}>
      <span className="ana-card__icono"><Icono /></span>
      <span className="ana-card__valor">{valor ?? 0}</span>
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

function TooltipAnalitica({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="ana-tooltip">
      {label && <strong>{label}</strong>}
      {payload.map((p, i) => (
        <span key={`${p.name}-${i}`}>
          <i style={{ background: p.color || COLORES[i % COLORES.length] }} />
          {p.name}: <b>{p.value}</b>
        </span>
      ))}
    </div>
  )
}
