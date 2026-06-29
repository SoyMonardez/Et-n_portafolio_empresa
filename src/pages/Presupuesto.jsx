import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiCheck } from 'react-icons/fi'
import Encabezado from '../components/util/Encabezado.jsx'
import Aparecer from '../components/util/Aparecer.jsx'
import useSeo from '../hooks/useSeo.js'
import { SERVICIOS } from '../data/servicios.js'
import { enviarPresupuesto } from '../lib/api.js'
import '../styles/formulario.css'

const VACIO = { servicio: '', nombre: '', telefono: '', email: '', ubicacion: '', descripcion: '' }

export default function Presupuesto() {
  useSeo({
    titulo: 'Solicitar presupuesto',
    descripcion:
      'Pedí un presupuesto sin cargo a Etán para demolición, piedra bola, veredas, obra civil o alquiler de maquinaria.',
  })

  const [params] = useSearchParams()
  const maquina = params.get('maquina')
  const [datos, setDatos] = useState(() => ({
    ...VACIO,
    descripcion: maquina ? `Quisiera alquilar: ${maquina}.` : '',
  }))
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  function actualizar(campo, valor) {
    setDatos((d) => ({ ...d, [campo]: valor }))
  }

  async function enviar(e) {
    e.preventDefault()
    setError('')
    setEnviando(true)
    try {
      await enviarPresupuesto(datos)
      setEnviado(true)
    } catch (err) {
      setError(err.message || 'No pudimos enviar tu solicitud. Probá de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <>
        <Encabezado titulo="Solicitar presupuesto" />
        <section className="seccion contenedor" style={{ maxWidth: 640 }}>
          <Aparecer className="formE__exito">
            <span className="formE__exito-icono"><FiCheck /></span>
            <div>
              <h3>¡Listo, recibimos tu pedido!</h3>
              <p>Te vamos a contactar a la brevedad para coordinar el presupuesto.</p>
            </div>
          </Aparecer>
        </section>
      </>
    )
  }

  return (
    <>
      <Encabezado
        titulo="Solicitar presupuesto"
        bajada="Contanos qué necesitás y te preparamos un presupuesto sin cargo."
      />
      <section className="seccion contenedor" style={{ maxWidth: 760 }}>
        <Aparecer>
          <form className="formE" onSubmit={enviar}>
            <div className="formE__campo">
              <label htmlFor="servicio">¿Qué necesitás?</label>
              <select
                id="servicio"
                required
                value={datos.servicio}
                onChange={(e) => actualizar('servicio', e.target.value)}
              >
                <option value="" disabled>Elegí una opción</option>
                {SERVICIOS.map((s) => (
                  <option key={s.id} value={s.titulo}>{s.titulo}</option>
                ))}
                <option value="Alquiler de maquinaria">Alquiler de maquinaria</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className="formE__campo">
              <label htmlFor="ubicacion">Ubicación de la obra</label>
              <input
                id="ubicacion"
                type="text"
                placeholder="Ciudad / departamento"
                required
                value={datos.ubicacion}
                onChange={(e) => actualizar('ubicacion', e.target.value)}
              />
            </div>

            <div className="formE__campo">
              <label htmlFor="nombre">Nombre y apellido</label>
              <input
                id="nombre"
                type="text"
                required
                value={datos.nombre}
                onChange={(e) => actualizar('nombre', e.target.value)}
              />
            </div>
            <div className="formE__campo">
              <label htmlFor="telefono">Teléfono / WhatsApp</label>
              <input
                id="telefono"
                type="tel"
                required
                value={datos.telefono}
                onChange={(e) => actualizar('telefono', e.target.value)}
              />
            </div>

            <div className="formE__campo formE__campo--ancho formE__campo--opcional">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={datos.email}
                onChange={(e) => actualizar('email', e.target.value)}
              />
            </div>

            <div className="formE__campo formE__campo--ancho">
              <label htmlFor="descripcion">Contanos los detalles</label>
              <textarea
                id="descripcion"
                required
                placeholder="Tipo de trabajo, medidas aproximadas, plazos, etc."
                value={datos.descripcion}
                onChange={(e) => actualizar('descripcion', e.target.value)}
              />
            </div>

            {error && <p className="formE__ayuda" style={{ color: 'var(--error)' }}>{error}</p>}

            <button type="submit" className="boton boton--principal formE__enviar" disabled={enviando}>
              {enviando ? 'Enviando…' : 'Enviar solicitud'}
            </button>
          </form>
        </Aparecer>
      </section>
    </>
  )
}
