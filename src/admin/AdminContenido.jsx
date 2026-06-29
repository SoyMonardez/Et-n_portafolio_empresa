import { useEffect, useState, useCallback } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiZap } from 'react-icons/fi'
import { listarContenido, guardarContenido, borrarContenido, sugerirDescripcion, limpiarToken } from '../lib/adminApi.js'

// Configuración de cada tipo gestionable: qué campos tiene, si lleva imagen,
// y cuál es el campo de "visible/activo".
export const TIPOS = {
  maquinas: {
    etiqueta: 'Maquinaria',
    singular: 'máquina',
    imagen: true,
    visible: 'activa',
    titulo: (x) => x.nombre,
    campos: [
      { id: 'nombre', label: 'Nombre', req: true },
      { id: 'categoria', label: 'Categoría', req: true },
      { id: 'detalle', label: 'Descripción', tipo: 'area' },
    ],
  },
  obras: {
    etiqueta: 'Obras',
    singular: 'obra',
    imagen: true,
    visible: 'publicada',
    titulo: (x) => x.titulo,
    campos: [
      { id: 'titulo', label: 'Título', req: true },
      { id: 'categoria', label: 'Categoría', req: true },
      { id: 'lugar', label: 'Lugar', req: true },
      { id: 'anio', label: 'Año' },
    ],
  },
  busquedas: {
    etiqueta: 'Búsquedas laborales',
    singular: 'búsqueda',
    imagen: false,
    visible: 'activa',
    titulo: (x) => x.puesto,
    campos: [
      { id: 'puesto', label: 'Puesto', req: true },
      { id: 'lugar', label: 'Lugar', req: true },
      { id: 'tipo', label: 'Tipo (ej: Tiempo completo)', req: true },
    ],
  },
}

export default function AdminContenido({ tipo, onSesionVencida }) {
  const cfg = TIPOS[tipo]
  const [items, setItems] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [editando, setEditando] = useState(null) // null = nada, {} = nuevo, {...} = editar

  const cargar = useCallback(async () => {
    setCargando(true)
    setError('')
    try {
      const { items } = await listarContenido(tipo)
      setItems(items)
    } catch (err) {
      if (err.message?.includes('autorizad') || err.message?.includes('vencida')) {
        limpiarToken(); onSesionVencida(); return
      }
      setError(err.message || 'No pudimos cargar el contenido.')
    } finally {
      setCargando(false)
    }
  }, [tipo, onSesionVencida])

  useEffect(() => { cargar() }, [cargar])
  useEffect(() => { setEditando(null) }, [tipo])

  async function eliminar(id) {
    if (!window.confirm('¿Seguro que querés borrarlo? No se puede deshacer.')) return
    await borrarContenido(tipo, id)
    cargar()
  }

  return (
    <>
      <div className="admin-cab">
        <h2 className="admin-panel__titulo">{cfg.etiqueta}</h2>
        <button className="boton boton--principal" onClick={() => setEditando({})}>
          <FiPlus /> Agregar
        </button>
      </div>

      {error && <p className="formE__ayuda" style={{ color: 'var(--error)' }}>{error}</p>}

      {editando !== null && (
        <FormularioContenido
          cfg={cfg}
          tipo={tipo}
          inicial={editando}
          onCerrar={() => setEditando(null)}
          onGuardado={() => { setEditando(null); cargar() }}
        />
      )}

      {cargando ? (
        <p style={{ color: 'var(--text-suave)' }}>Cargando…</p>
      ) : items.length === 0 ? (
        <p style={{ color: 'var(--text-suave)' }}>Todavía no cargaste ninguna {cfg.singular}.</p>
      ) : (
        <div className="admin-items">
          {items.map((it) => (
            <article key={it.id} className="admin-item">
              {cfg.imagen && (
                <div className="admin-item__foto">
                  {it.imagen_url
                    ? <img src={it.imagen_url} alt="" />
                    : <span className="admin-item__sinfoto">Sin foto</span>}
                </div>
              )}
              <div className="admin-item__cuerpo">
                <h3>{cfg.titulo(it)}</h3>
                <p className="admin-item__meta">
                  {it.categoria || it.lugar}
                  {!it[cfg.visible] && <span className="admin-item__oculto">Oculto</span>}
                </p>
              </div>
              <div className="admin-item__acciones">
                <button onClick={() => setEditando(it)} aria-label="Editar"><FiEdit2 /></button>
                <button onClick={() => eliminar(it.id)} aria-label="Borrar"><FiTrash2 /></button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}

function FormularioContenido({ cfg, tipo, inicial, onCerrar, onGuardado }) {
  const esNuevo = !inicial.id
  const [valores, setValores] = useState(() => {
    const base = {}
    cfg.campos.forEach((c) => { base[c.id] = inicial[c.id] || '' })
    base[cfg.visible] = inicial.id ? Boolean(inicial[cfg.visible]) : true
    return base
  })
  const [archivo, setArchivo] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [sugiriendo, setSugiriendo] = useState(false)

  const campoArea = cfg.campos.find((c) => c.tipo === 'area')

  function set(campo, v) {
    setValores((prev) => ({ ...prev, [campo]: v }))
  }

  async function sugerir() {
    if (!valores.nombre) {
      setError('Escribí primero el nombre para que la IA sugiera una descripción.')
      return
    }
    setError('')
    setSugiriendo(true)
    try {
      const { texto } = await sugerirDescripcion({
        tipo: tipo === 'maquinas' ? 'maquina' : 'obra',
        nombre: valores.nombre,
        categoria: valores.categoria,
      })
      set(campoArea.id, texto)
    } catch (err) {
      setError(err.message || 'No pudimos generar la descripción.')
    } finally {
      setSugiriendo(false)
    }
  }

  async function enviar(e) {
    e.preventDefault()
    setError('')
    setGuardando(true)
    try {
      const fd = new FormData()
      cfg.campos.forEach((c) => fd.append(c.id, valores[c.id]))
      fd.append(cfg.visible, String(valores[cfg.visible]))
      if (archivo) fd.append('imagen', archivo)
      await guardarContenido(tipo, inicial.id, fd)
      onGuardado()
    } catch (err) {
      setError(err.message || 'No pudimos guardar.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="admin-form">
      <div className="admin-form__cab">
        <h3>{esNuevo ? `Nueva ${cfg.singular}` : `Editar ${cfg.singular}`}</h3>
        <button onClick={onCerrar} aria-label="Cerrar"><FiX /></button>
      </div>
      <form className="formE" onSubmit={enviar}>
        {cfg.campos.map((c) => (
          <div key={c.id} className={`formE__campo ${c.tipo === 'area' ? 'formE__campo--ancho' : ''}`}>
            <label htmlFor={`f-${c.id}`}>
              {c.label}
              {c.tipo === 'area' && (
                <button type="button" className="admin-ia-btn" onClick={sugerir} disabled={sugiriendo}>
                  <FiZap /> {sugiriendo ? 'Generando…' : 'Sugerir con IA'}
                </button>
              )}
            </label>
            {c.tipo === 'area' ? (
              <textarea id={`f-${c.id}`} value={valores[c.id]} required={c.req}
                onChange={(e) => set(c.id, e.target.value)} />
            ) : (
              <input id={`f-${c.id}`} value={valores[c.id]} required={c.req}
                onChange={(e) => set(c.id, e.target.value)} />
            )}
          </div>
        ))}

        {cfg.imagen && (
          <div className="formE__campo formE__campo--ancho formE__campo--opcional">
            <label htmlFor="f-imagen">Foto {!esNuevo && '(dejá vacío para mantener la actual)'}</label>
            <input id="f-imagen" type="file" accept="image/*"
              onChange={(e) => setArchivo(e.target.files?.[0] ?? null)} />
          </div>
        )}

        <label className="admin-check formE__campo--ancho">
          <input type="checkbox" checked={valores[cfg.visible]}
            onChange={(e) => set(cfg.visible, e.target.checked)} />
          Mostrar en el sitio
        </label>

        {error && <p className="formE__ayuda" style={{ color: 'var(--error)' }}>{error}</p>}

        <div className="formE__campo--ancho" style={{ display: 'flex', gap: 10 }}>
          <button type="submit" className="boton boton--principal" disabled={guardando}>
            {guardando ? 'Guardando…' : 'Guardar'}
          </button>
          <button type="button" className="boton boton--borde" onClick={onCerrar}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}
