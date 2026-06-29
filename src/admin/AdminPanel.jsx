import { useEffect, useState, useCallback } from 'react'
import { FiLogOut } from 'react-icons/fi'
import { obtenerResumen, limpiarToken } from '../lib/adminApi.js'
import AdminBandeja, { BANDEJAS } from './AdminBandeja.jsx'
import AdminContenido, { TIPOS } from './AdminContenido.jsx'
import AdminConfig from './AdminConfig.jsx'
import AdminAnalitica from './AdminAnalitica.jsx'

const SOLICITUDES = Object.entries(BANDEJAS).map(([id, b]) => ({ id, etiqueta: b.etiqueta }))
const CONTENIDO = Object.entries(TIPOS).map(([id, t]) => ({ id, etiqueta: t.etiqueta }))

export default function AdminPanel({ onSalir }) {
  // vista: { grupo: 'solicitudes'|'contenido'|'config', id }
  const [vista, setVista] = useState({ grupo: 'solicitudes', id: 'presupuestos' })
  const [resumen, setResumen] = useState({})

  const cargarResumen = useCallback(async () => {
    try {
      const { resumen } = await obtenerResumen()
      setResumen(resumen)
    } catch { /* el resumen es secundario; si falla, no rompemos el panel */ }
  }, [])

  useEffect(() => { cargarResumen() }, [cargarResumen])

  function salir() {
    limpiarToken()
    onSalir()
  }

  const props = { onSesionVencida: salir, onResumenCambio: cargarResumen }

  return (
    <div className="admin-panel">
      <aside className="admin-panel__menu">
        <h1 className="admin-panel__marca">ETÁN</h1>
        <nav>
          <button
            className={`admin-panel__item ${vista.id === 'analitica' ? 'admin-panel__item--on' : ''}`}
            onClick={() => setVista({ grupo: 'analitica', id: 'analitica' })}
          >
            Visitas y métricas
          </button>

          <p className="admin-panel__grupo">Solicitudes</p>
          {SOLICITUDES.map((b) => (
            <button
              key={b.id}
              className={`admin-panel__item ${vista.id === b.id ? 'admin-panel__item--on' : ''}`}
              onClick={() => setVista({ grupo: 'solicitudes', id: b.id })}
            >
              {b.etiqueta}
              {resumen[b.id]?.nuevos > 0 && <span className="admin-panel__badge">{resumen[b.id].nuevos}</span>}
            </button>
          ))}

          <p className="admin-panel__grupo">Contenido del sitio</p>
          {CONTENIDO.map((c) => (
            <button
              key={c.id}
              className={`admin-panel__item ${vista.id === c.id ? 'admin-panel__item--on' : ''}`}
              onClick={() => setVista({ grupo: 'contenido', id: c.id })}
            >
              {c.etiqueta}
            </button>
          ))}
          <button
            className={`admin-panel__item ${vista.id === 'config' ? 'admin-panel__item--on' : ''}`}
            onClick={() => setVista({ grupo: 'config', id: 'config' })}
          >
            Contacto y redes
          </button>
        </nav>
        <button className="admin-panel__salir" onClick={salir}>
          <FiLogOut /> Cerrar sesión
        </button>
      </aside>

      <main className="admin-panel__contenido">
        {vista.grupo === 'analitica' && <AdminAnalitica {...props} />}
        {vista.grupo === 'solicitudes' && (
          <AdminBandeja key={vista.id} tipo={vista.id} {...props} />
        )}
        {vista.grupo === 'contenido' && (
          <AdminContenido key={vista.id} tipo={vista.id} {...props} />
        )}
        {vista.grupo === 'config' && <AdminConfig {...props} />}
      </main>
    </div>
  )
}
