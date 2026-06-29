import { useState } from 'react'
import { FiCheck, FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi'
import Encabezado from '../components/util/Encabezado.jsx'
import Aparecer from '../components/util/Aparecer.jsx'
import useSeo from '../hooks/useSeo.js'
import '../styles/formulario.css'
import './Contacto.css'

const VACIO = { nombre: '', email: '', telefono: '', mensaje: '' }

// Datos de contacto (borrador). Se administran desde site_config en el panel.
const DATOS_CONTACTO = [
  { icono: FiPhone, etiqueta: 'Teléfono / WhatsApp', valor: 'A confirmar' },
  { icono: FiMail, etiqueta: 'Email', valor: 'A confirmar' },
  { icono: FiMapPin, etiqueta: 'Ubicación', valor: 'San Juan, Argentina' },
  { icono: FiClock, etiqueta: 'Horario', valor: 'Lunes a viernes, 8 a 18 hs' },
]

export default function Contacto() {
  useSeo({
    titulo: 'Contacto',
    descripcion: 'Comunicate con Etán: teléfono, email y formulario de contacto.',
  })

  const [datos, setDatos] = useState(VACIO)
  const [enviado, setEnviado] = useState(false)

  function actualizar(campo, valor) {
    setDatos((d) => ({ ...d, [campo]: valor }))
  }

  function enviar(e) {
    e.preventDefault()
    setEnviado(true)
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
              <button type="submit" className="boton boton--principal formE__enviar">
                Enviar mensaje
              </button>
            </form>
          )}
        </Aparecer>
      </section>
    </>
  )
}
