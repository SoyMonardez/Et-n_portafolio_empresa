import { useState } from 'react'
import { FiCheck, FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi'
import Encabezado from '../components/util/Encabezado.jsx'
import Aparecer from '../components/util/Aparecer.jsx'
import useSeo from '../hooks/useSeo.js'
import useConfig from '../hooks/useConfig.js'
import { enviarContacto } from '../lib/api.js'
import '../styles/formulario.css'
import './Contacto.css'

const VACIO = { nombre: '', email: '', telefono: '', mensaje: '' }

export default function Contacto() {
  useSeo({
    titulo: 'Contacto',
    descripcion: 'Comunicate con Etán: teléfono, email y formulario de contacto.',
  })

  const cfg = useConfig()
  const DATOS_CONTACTO = [
    { icono: FiPhone, etiqueta: 'Teléfono / WhatsApp', valor: cfg.telefono || 'A confirmar' },
    { icono: FiMail, etiqueta: 'Email', valor: cfg.email || 'A confirmar' },
    { icono: FiMapPin, etiqueta: 'Ubicación', valor: cfg.direccion || 'San Juan, Argentina' },
    { icono: FiClock, etiqueta: 'Horario', valor: 'Lunes a viernes, 8 a 18 hs' },
  ]

  const [datos, setDatos] = useState(VACIO)
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
      await enviarContacto(datos)
      setEnviado(true)
    } catch (err) {
      setError(err.message || 'No pudimos enviar tu mensaje. Probá de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <Encabezado titulo="Contacto" bajada="Escribinos y te respondemos a la brevedad." />
      <section className="seccion contenedor contacto__grid">
        <div className="contacto__datos">
          {DATOS_CONTACTO.map(({ icono: Icono, etiqueta, valor }) => (
            <div className="contacto__dato" key={etiqueta}>
              <span className="contacto__dato-icono"><Icono /></span>
              <div>
                <p className="contacto__dato-etiqueta">{etiqueta}</p>
                <p className="contacto__dato-valor">{valor}</p>
              </div>
            </div>
          ))}
        </div>

        <Aparecer>
          {enviado ? (
            <div className="formE__exito">
              <span className="formE__exito-icono"><FiCheck /></span>
              <div>
                <h3>¡Mensaje enviado!</h3>
                <p>Gracias por escribirnos, te respondemos a la brevedad.</p>
              </div>
            </div>
          ) : (
            <form className="formE" onSubmit={enviar}>
              <div className="formE__campo">
                <label htmlFor="c-nombre">Nombre y apellido</label>
                <input
                  id="c-nombre"
                  required
                  value={datos.nombre}
                  onChange={(e) => actualizar('nombre', e.target.value)}
                />
              </div>
              <div className="formE__campo">
                <label htmlFor="c-telefono">Teléfono</label>
                <input
                  id="c-telefono"
                  type="tel"
                  value={datos.telefono}
                  onChange={(e) => actualizar('telefono', e.target.value)}
                />
              </div>
              <div className="formE__campo formE__campo--ancho">
                <label htmlFor="c-email">Email</label>
                <input
                  id="c-email"
                  type="email"
                  required
                  value={datos.email}
                  onChange={(e) => actualizar('email', e.target.value)}
                />
              </div>
              <div className="formE__campo formE__campo--ancho">
                <label htmlFor="c-mensaje">Mensaje</label>
                <textarea
                  id="c-mensaje"
                  required
                  value={datos.mensaje}
                  onChange={(e) => actualizar('mensaje', e.target.value)}
                />
              </div>
              {error && <p className="formE__ayuda" style={{ color: 'var(--error)' }}>{error}</p>}

              <button type="submit" className="boton boton--principal formE__enviar" disabled={enviando}>
                {enviando ? 'Enviando…' : 'Enviar mensaje'}
              </button>
            </form>
          )}
        </Aparecer>
      </section>
    </>
  )
}
