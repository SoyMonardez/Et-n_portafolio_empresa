import { useEffect, useState, useCallback } from 'react'
import {
  FiActivity,
  FiBriefcase,
  FiEdit3,
  FiFileText,
  FiImage,
  FiInbox,
  FiLogOut,
  FiMail,
  FiSettings,
  FiTruck,
  FiUsers,
} from 'react-icons/fi'
import { obtenerResumen, limpiarToken } from '../lib/adminApi.js'
import AdminBandeja, { BANDEJAS } from './AdminBandeja.jsx'
import AdminContenido, { TIPOS } from './AdminContenido.jsx'
import AdminConfig from './AdminConfig.jsx'
import AdminAnalitica from './AdminAnalitica.jsx'

const SOLICITUDES = Object.entries(BANDEJAS).map(([id, b]) => ({ id, etiqueta: b.etiqueta }))
const CONTENIDO = Object.entries(TIPOS).map(([id, t]) => ({ id, etiqueta: t.etiqueta }))

const ICONOS = {
  analitica: FiActivity,
  presupuestos: FiFileText,
  contactos: FiMail,
  alquiler: FiTruck,
  postulaciones: FiUsers,
  maquinaria: FiTruck,
  obras: FiImage,
  busquedas: FiBriefcase,
  config: FiSettings,
}

function NavItem({ activo, icono: Icono = FiInbox, children, badge, ...props }) {
  return (
    <button
      className={`admin-panel__item ${activo ? 'admin-panel__item--on' : ''}`}
      {...props}
    >
      <span className="admin-panel__item-main">
        <span className="admin-panel__icono"><Icono /></span>
        <span>{children}</span>
      </span>
      {badge > 0 && <span className="admin-panel__badge">{badge}</span>}
    </button>
  )
}

export default function AdminPanel({ onSalir }) {
  // vista: { grupo: 'solicitudes'|'contenido'|'config', id }
  const [vista, setVista] = useState({ grupo: 'analitica', id: 'analitica' })
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
        <div className="admin-panel__marca">
          <strong>ETÁN</strong>
          <span>Panel interno</span>
        </div>
        <nav className="admin-panel__nav" aria-label="Administración">
          <NavItem
            activo={vista.id === 'analitica'}
            icono={ICONOS.analitica}
            onClick={() => setVista({ grupo: 'analitica', id: 'analitica' })}
          >
            Visitas y métricas
          </NavItem>

          <p className="admin-panel__grupo">Solicitudes</p>
          {SOLICITUDES.map((b) => (
            <NavItem
              key={b.id}
              activo={vista.id === b.id}
              icono={ICONOS[b.id]}
              badge={resumen[b.id]?.nuevos}
              onClick={() => setVista({ grupo: 'solicitudes', id: b.id })}
            >
              {b.etiqueta}
            </NavItem>
          ))}

          <p className="admin-panel__grupo">Contenido del sitio</p>
          {CONTENIDO.map((c) => (
            <NavItem
              key={c.id}
              activo={vista.id === c.id}
              icono={ICONOS[c.id] || FiEdit3}
              onClick={() => setVista({ grupo: 'contenido', id: c.id })}
            >
              {c.etiqueta}
            </NavItem>
          ))}
          <NavItem
            activo={vista.id === 'config'}
            icono={ICONOS.config}
            onClick={() => setVista({ grupo: 'config', id: 'config' })}
          >
            Contacto y redes
          </NavItem>
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
