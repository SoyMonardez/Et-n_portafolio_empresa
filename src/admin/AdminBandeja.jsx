import { useEffect, useState, useCallback } from 'react'
import { FiExternalLink } from 'react-icons/fi'
import { obtenerBandeja, actualizarEstado, limpiarToken } from '../lib/adminApi.js'

export const BANDEJAS = {
  presupuestos: {
    etiqueta: 'Presupuestos',
    columnas: [
      { campo: 'servicio', titulo: 'Servicio' },
      { campo: 'nombre', titulo: 'Nombre' },
      { campo: 'telefono', titulo: 'Teléfono' },
      { campo: 'ubicacion', titulo: 'Ubicación' },
      { campo: 'descripcion', titulo: 'Detalle' },
    ],
  },
  contactos: {
    etiqueta: 'Contactos',
    columnas: [
      { campo: 'nombre', titulo: 'Nombre' },
      { campo: 'email', titulo: 'Email' },
      { campo: 'telefono', titulo: 'Teléfono' },
      { campo: 'mensaje', titulo: 'Mensaje' },
    ],
  },
  alquiler: {
    etiqueta: 'Alquiler de maquinaria',
    columnas: [
      { campo: 'maquina_nombre', titulo: 'Máquina' },
      { campo: 'nombre', titulo: 'Nombre' },
      { campo: 'telefono', titulo: 'Teléfono' },
      { campo: 'mensaje', titulo: 'Mensaje' },
    ],
  },
  postulaciones: {
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
}

function formatearFecha(iso) {
  return new Date(iso).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
}

export default function AdminBandeja({ tipo, onResumenCambio, onSesionVencida }) {
  const bandeja = BANDEJAS[tipo]
  const [items, setItems] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cargar = useCallback(async () => {
    setCargando(true)
    setError('')
    try {
      const { items } = await obtenerBandeja(tipo)
      setItems(items)
    } catch (err) {
      if (err.message?.includes('autorizad') || err.message?.includes('vencida')) {
        limpiarToken()
        onSesionVencida()
        return
      }
      setError(err.message || 'No pudimos cargar la bandeja.')
    } finally {
      setCargando(false)
    }
  }, [tipo, onSesionVencida])

  useEffect(() => { cargar() }, [cargar])

  async function cambiarEstado(id, estadoActual) {
    const nuevo = estadoActual === 'nuevo' ? 'atendido' : 'nuevo'
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, estado: nuevo } : it)))
    try {
      await actualizarEstado(tipo, id, nuevo)
      onResumenCambio?.()
    } catch {
      cargar()
    }
  }

  return (
    <>
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
    </>
  )
}
