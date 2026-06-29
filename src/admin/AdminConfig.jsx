import { useEffect, useState } from 'react'
import { FiCheck } from 'react-icons/fi'
import { obtenerConfigAdmin, guardarConfig, limpiarToken } from '../lib/adminApi.js'

const CAMPOS = [
  { id: 'telefono', label: 'Teléfono / WhatsApp', placeholder: '+54 264 ...' },
  { id: 'email', label: 'Email de contacto', placeholder: 'contacto@etan.com.ar' },
  { id: 'direccion', label: 'Dirección / Ubicación', placeholder: 'San Juan, Argentina' },
  { id: 'instagram', label: 'Link de Instagram', placeholder: 'https://instagram.com/...' },
  { id: 'facebook', label: 'Link de Facebook', placeholder: 'https://facebook.com/...' },
]

export default function AdminConfig({ onSesionVencida }) {
  const [valores, setValores] = useState({})
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [ok, setOk] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    obtenerConfigAdmin()
      .then(({ config }) => setValores(config))
      .catch((err) => {
        if (err.message?.includes('autorizad') || err.message?.includes('vencida')) {
          limpiarToken(); onSesionVencida()
        } else setError(err.message)
      })
      .finally(() => setCargando(false))
  }, [onSesionVencida])

  async function enviar(e) {
    e.preventDefault()
    setError('')
    setOk(false)
    setGuardando(true)
    try {
      await guardarConfig(valores)
      setOk(true)
      setTimeout(() => setOk(false), 2500)
    } catch (err) {
      setError(err.message || 'No pudimos guardar.')
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) return <p style={{ color: 'var(--text-suave)' }}>Cargando…</p>

  return (
    <>
      <h2 className="admin-panel__titulo">Datos de contacto y redes</h2>
      <p style={{ color: 'var(--text-suave)', marginBottom: 24, maxWidth: 520 }}>
        Lo que cargues acá aparece en el pie de página y en la página de Contacto del sitio.
      </p>
      <form className="formE" onSubmit={enviar} style={{ maxWidth: 560 }}>
        {CAMPOS.map((c) => (
          <div key={c.id} className="formE__campo formE__campo--ancho">
            <label htmlFor={`cfg-${c.id}`}>{c.label}</label>
            <input
              id={`cfg-${c.id}`}
              value={valores[c.id] || ''}
              placeholder={c.placeholder}
              onChange={(e) => setValores((p) => ({ ...p, [c.id]: e.target.value }))}
            />
          </div>
        ))}

        {error && <p className="formE__ayuda" style={{ color: 'var(--error)' }}>{error}</p>}

        <div className="formE__campo--ancho" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button type="submit" className="boton boton--principal" disabled={guardando}>
            {guardando ? 'Guardando…' : 'Guardar cambios'}
          </button>
          {ok && <span style={{ color: 'var(--ok)', display: 'flex', alignItems: 'center', gap: 6 }}><FiCheck /> Guardado</span>}
        </div>
      </form>
    </>
  )
}
