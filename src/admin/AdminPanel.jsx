import { useEffect, useState, useCallback } from 'react'
import { FiLogOut, FiExternalLink } from 'react-icons/fi'
import { obtenerResumen, obtenerBandeja, actualizarEstado, limpiarToken } from '../lib/adminApi.js'

const BANDEJAS = [
  {
    id: 'presupuestos',
    etiqueta: 'Presupuestos',
    columnas: [
      { campo: 'servicio', titulo: 'Servicio' },
      { campo: 'nombre', titulo: 'Nombre' },
      { campo: 'telefono', titulo: 'Teléfono' },
      { campo: 'ubicacion', titulo: 'Ubicación' },
      { campo: 'descripcion', titulo: 'Detalle' },
    ],
  },
  {
    id: 'contactos',
    etiqueta: 'Contactos',
    columnas: [
      { campo: 'nombre', titulo: 'Nombre' },
      { campo: 'email', titulo: 'Email' },
      { campo: 'telefono', titulo: 'Teléfono' },
      { campo: 'mensaje', titulo: 'Mensaje' },
    ],
  },
  {
    id: 'alquiler',
    etiqueta: 'Alquiler de maquinaria',
    columnas: [
      { campo: 'maquina_nombre', titulo: 'Máquina' },
      { campo: 'nombre', titulo: 'Nombre' },
      { campo: 'telefono', titulo: 'Teléfono' },
      { campo: 'mensaje', titulo: 'Mensaje' },
    ],
  },
  {
    id: 'postulaciones',
    etiqueta: 'Postulaciones',
    columnas: [
      { campo: 'nombre', titulo: 'Nombre' },
      { campo: 'telefono', titulo: 'Teléfono' },
      { campo: 'email', titulo: 'Email' },
      { campo: 'puesto', titulo: 'Puesto' },
      {
        campo: 'cv_path',
        titulo: 'CV',
        render: (v) => v
          ? <a href={v} target="_blank" rel="noreferrer" className="admin-link">Ver PDF <FiExternalLink /></a>
          : '—',
      },
    ],
  },
]

function formatearFecha(iso) {
  return new Date(iso).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
}

export default function AdminPanel({ onSalir }) {
  const [activa, setActiva] = useState('presupuestos')
  const [resumen, setResumen] = useState({})
  const [items, setItems] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cargarResumen = useCallback(async () => {
    try {
      const { resumen } = await obtenerResumen()
      setResumen(resumen)
    } catch (err) {
      if (err.message?.includes('autorizado') || err.message?.includes('vencida')) {
        limpiarToken()
        onSalir()
      }
    }
  }, [onSalir])

  const cargarBandeja = useCallback(async (id) => {
    setCargando(true)
    setError('')
    try {
      const { items } = await obtenerBandeja(id)
      setItems(items)
    } catch (err) {
      setError(err.message || 'No pudimos cargar la bandeja.')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { cargarResumen() }, [cargarResumen])
  useEffect(() => { cargarBandeja(activa) }, [activa, cargarBandeja])

  async function cambiarEstado(id, estadoActual) {
    const nuevo = estadoActual === 'nuevo' ? 'atendido' : 'nuevo'
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, estado: nuevo } : it)))
    try {
      await actualizarEstado(activa, id, nuevo)
      cargarResumen()
    } catch {
      cargarBandeja(activa)
    }
  }

  function salir() {
    limpiarToken()
    onSalir()
  }

  const bandeja = BANDEJAS.find((b) => b.id === activa)

  return (
    <div className="admin-panel">
      <aside className="admin-panel__menu">
        <h1 className="admin-panel__marca">ETÁN</h1>
        <nav>
          {BANDEJAS.map((b) => (
            <button
              key={b.id}
              className={`admin-panel__item ${activa === b.id ? 'admin-panel__item--on' : ''}`}
              onClick={() => setActiva(b.id)}
            >
              {b.etiqueta}
              {resumen[b.id]?.nuevos > 0 && <span className="admin-panel__badge">{resumen[b.id].nuevos}</span>}
            </button>
          ))}
        </nav>
        <button className="admin-panel__salir" onClick={salir}>
          <FiLogOut /> Cerrar sesión
        </button>
      </aside>

      <main className="admin-panel__contenido">
        <h2 className="admin-panel__titulo">{bandeja.etiqueta}</h2>

        {error && <p className="formE__ayuda" style={{ color: 'var(--error)' }}>{error}</p>}
        {cargando ? (
          <p style={{ color: 'var(--text-suave)' }}>Cargando…</p>
        ) : items.length === 0 ? (
          <p style={{ color: 'var(--text-suave)' }}>Todavía no llegó ninguna solicitud.</p>
        ) : (
          <div className="admin-tabla-wrap">
            <table className="admin-tabla">
              <thead>
                <tr>
                  <th>Fecha</th>
                  {bandeja.columnas.map((c) => <th key={c.campo}>{c.titulo}</th>)}
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} className={it.estado === 'nuevo' ? 'admin-tabla__fila--nueva' : ''}>
                    <td>{formatearFecha(it.created_at)}</td>
                    {bandeja.columnas.map((c) => (
                      <td key={c.campo}>{c.render ? c.render(it[c.campo]) : (it[c.campo] || '—')}</td>
                    ))}
                    <td>
                      <button
                        className={`admin-estado admin-estado--${it.estado}`}
                        onClick={() => cambiarEstado(it.id, it.estado)}
                      >
                        {it.estado === 'nuevo' ? 'Nuevo' : 'Atendido'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
