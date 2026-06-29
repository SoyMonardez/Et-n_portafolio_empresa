import { useState } from 'react'
import { FiCheck, FiMapPin, FiClock, FiUpload } from 'react-icons/fi'
import Encabezado from '../components/util/Encabezado.jsx'
import Aparecer from '../components/util/Aparecer.jsx'
import useSeo from '../hooks/useSeo.js'
import { BUSQUEDAS } from '../data/busquedas.js'
import { enviarPostulacion } from '../lib/api.js'
import '../styles/formulario.css'

const VACIO = { nombre: '', telefono: '', email: '', puesto: '', mensaje: '' }

export default function Empleo() {
  useSeo({
    titulo: 'Trabajá con nosotros',
    descripcion:
      'Búsquedas laborales activas en Etán y formulario para dejar tu CV y postularte a futuras oportunidades en San Juan.',
  })

  const [datos, setDatos] = useState(VACIO)
  const [archivo, setArchivo] = useState(null)
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  function actualizar(campo, valor) {
    setDatos((d) => ({ ...d, [campo]: valor }))
  }

  async function enviar(e) {
    e.preventDefault()
    if (!archivo) {
      setError('Adjuntá tu currículum en PDF.')
      return
    }
    setError('')
    setEnviando(true)
    try {
      const formData = new FormData()
      Object.entries(datos).forEach(([k, v]) => formData.append(k, v))
      formData.append('cv', archivo)
      await enviarPostulacion(formData)
      setEnviado(true)
    } catch (err) {
      setError(err.message || 'No pudimos enviar tu postulación. Probá de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <Encabezado
        titulo="Trabajá con nosotros"
        bajada="Sumate a nuestro equipo. Mirá las búsquedas activas y dejanos tu currículum."
      />

      <section className="seccion contenedor" style={{ maxWidth: 760 }}>
        <h2 className="seccion__titulo" style={{ fontSize: '1.4rem', marginBottom: 20 }}>
          Búsquedas activas
        </h2>
        {BUSQUEDAS.length === 0 ? (
          <p style={{ color: 'var(--text-suave)', marginBottom: 40 }}>
            Por ahora no tenemos búsquedas activas, pero podés dejarnos tu CV para futuras oportunidades.
          </p>
        ) : (
          <div style={{ display: 'grid', gap: 14, marginBottom: 50 }}>
            {BUSQUEDAS.map((b, i) => (
              <Aparecer key={b.id} delay={i * 0.06}>
                <article
                  style={{
                    padding: '20px 22px',
                    borderRadius: 'var(--radio)',
                    border: '1px solid var(--borde)',
                    background: 'var(--surface)',
                  }}
                >
                  <h3 style={{ fontSize: '1.1rem', marginBottom: 8 }}>{b.puesto}</h3>
                  <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', color: 'var(--text-suave)', fontSize: '0.92rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiMapPin /> {b.lugar}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiClock /> {b.tipo}</span>
                  </div>
                </article>
              </Aparecer>
            ))}
          </div>
        )}

        {enviado ? (
          <Aparecer className="formE__exito">
            <span className="formE__exito-icono"><FiCheck /></span>
            <div>
              <h3>¡Gracias por postularte!</h3>
              <p>Guardamos tu postulación y te vamos a contactar si tu perfil encaja con una búsqueda.</p>
            </div>
          </Aparecer>
        ) : (
          <Aparecer>
            <h2 className="seccion__titulo" style={{ fontSize: '1.4rem', marginBottom: 20 }}>
              Dejanos tu CV
            </h2>
            <form className="formE" onSubmit={enviar}>
              <div className="formE__campo">
                <label htmlFor="e-nombre">Nombre y apellido</label>
                <input
                  id="e-nombre"
                  required
                  value={datos.nombre}
                  onChange={(e) => actualizar('nombre', e.target.value)}
                />
              </div>
              <div className="formE__campo">
                <label htmlFor="e-telefono">Teléfono / WhatsApp</label>
                <input
                  id="e-telefono"
                  type="tel"
                  required
                  value={datos.telefono}
                  onChange={(e) => actualizar('telefono', e.target.value)}
                />
              </div>

              <div className="formE__campo">
                <label htmlFor="e-email">Email</label>
                <input
                  id="e-email"
                  type="email"
                  required
                  value={datos.email}
                  onChange={(e) => actualizar('email', e.target.value)}
                />
              </div>
              <div className="formE__campo formE__campo--opcional">
                <label htmlFor="e-puesto">Puesto de interés</label>
                <input
                  id="e-puesto"
                  placeholder="Ej: Operario de maquinaria"
                  value={datos.puesto}
                  onChange={(e) => actualizar('puesto', e.target.value)}
                />
              </div>

              <div className="formE__campo formE__campo--ancho formE__campo--opcional">
                <label htmlFor="e-mensaje">Contanos tu experiencia</label>
                <textarea
                  id="e-mensaje"
                  value={datos.mensaje}
                  onChange={(e) => actualizar('mensaje', e.target.value)}
                />
              </div>

              <div className="formE__campo formE__campo--ancho">
                <label htmlFor="e-cv">Tu currículum (PDF)</label>
                <label
                  htmlFor="e-cv"
                  className="boton boton--borde"
                  style={{ justifyContent: 'flex-start', cursor: 'pointer' }}
                >
                  <FiUpload /> {archivo ? archivo.name : 'Elegir archivo'}
                </label>
                <input
                  id="e-cv"
                  type="file"
                  accept="application/pdf"
                  required
                  style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
                  onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
                />
              </div>

              {error && <p className="formE__ayuda" style={{ color: 'var(--error)' }}>{error}</p>}

              <button type="submit" className="boton boton--principal formE__enviar" disabled={enviando}>
                {enviando ? 'Enviando…' : 'Enviar postulación'}
              </button>
            </form>
          </Aparecer>
        )}
      </section>
    </>
  )
}
