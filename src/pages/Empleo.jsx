import { useEffect, useState } from 'react'
import { FiBriefcase, FiCheck, FiClock, FiFileText, FiMapPin, FiUpload } from 'react-icons/fi'
import Aparecer from '../components/util/Aparecer.jsx'
import useSeo from '../hooks/useSeo.js'
import { BUSQUEDAS } from '../data/busquedas.js'
import { enviarPostulacion, obtenerBusquedas } from '../lib/api.js'
import '../styles/formulario.css'
import './Empleo.css'

const VACIO = { nombre: '', telefono: '', email: '', puesto: '', mensaje: '' }

export default function Empleo() {
  useSeo({
    titulo: 'Trabajá con nosotros',
    descripcion:
      'Búsquedas laborales activas en Etán y formulario para dejar tu CV y postularte a futuras oportunidades en San Juan.',
  })

  const [busquedas, setBusquedas] = useState(BUSQUEDAS)
  const [datos, setDatos] = useState(VACIO)
  const [archivo, setArchivo] = useState(null)
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    obtenerBusquedas().then((items) => {
      if (items) setBusquedas(items)
    })
  }, [])

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
      <section className="empleo-hero">
        <div className="contenedor empleo-hero__inner">
          <Aparecer>
            <p className="eyebrow">Equipo Etán</p>
            <h1 className="empleo-hero__titulo">Trabajá con nosotros</h1>
            <p className="empleo-hero__bajada">
              Sumate a obras reales en San Juan. Revisá las búsquedas activas o dejanos tu CV para futuras incorporaciones.
            </p>
            <div className="empleo-hero__chips" aria-label="Datos de postulación">
              <span><FiBriefcase /> {busquedas.length || 'Sin'} búsquedas</span>
              <span><FiFileText /> CV en PDF</span>
              <span><FiMapPin /> San Juan</span>
            </div>
          </Aparecer>
        </div>
      </section>

      <section className="empleo contenedor">
        <div className="empleo__layout">
          <div className="empleo__bloque">
            <div className="empleo__cab">
              <p className="empleo__kicker">Oportunidades</p>
              <h2>Búsquedas activas</h2>
            </div>

            {busquedas.length === 0 ? (
              <p className="empleo__vacio">
                Por ahora no tenemos búsquedas activas, pero podés dejarnos tu CV para futuras oportunidades.
              </p>
            ) : (
              <div className="empleo__busquedas">
                {busquedas.map((b, i) => (
                  <Aparecer key={b.id} delay={i * 0.06}>
                    <article className="empleo-card">
                      <div className="empleo-card__icono"><FiBriefcase /></div>
                      <div className="empleo-card__cuerpo">
                        <span className="empleo-card__estado">Activa</span>
                        <h3>{b.puesto}</h3>
                        <div className="empleo-card__meta">
                          <span><FiMapPin /> {b.lugar}</span>
                          <span><FiClock /> {b.tipo}</span>
                        </div>
                      </div>
                    </article>
                  </Aparecer>
                ))}
              </div>
            )}
          </div>

          <div className="empleo__bloque empleo__bloque--form">
            {enviado ? (
              <Aparecer className="formE__exito empleo__exito">
                <span className="formE__exito-icono"><FiCheck /></span>
                <div>
                  <h3>¡Gracias por postularte!</h3>
                  <p>Guardamos tu postulación y te vamos a contactar si tu perfil encaja con una búsqueda.</p>
                </div>
              </Aparecer>
            ) : (
              <Aparecer>
                <div className="empleo__cab">
                  <p className="empleo__kicker">Postulación</p>
                  <h2>Dejanos tu CV</h2>
                </div>

                <form className="formE empleo-form" onSubmit={enviar}>
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
                    <label htmlFor="e-cv" className="empleo-upload">
                      <span className="empleo-upload__icono"><FiUpload /></span>
                      <span>
                        <strong>{archivo ? archivo.name : 'Elegir archivo'}</strong>
                        <small>PDF hasta 10 MB</small>
                      </span>
                    </label>
                    <input
                      id="e-cv"
                      type="file"
                      accept="application/pdf"
                      required
                      className="empleo-upload__input"
                      onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
                    />
                  </div>

                  {error && <p className="formE__ayuda empleo-form__error">{error}</p>}

                  <button type="submit" className="boton boton--principal formE__enviar empleo-form__enviar" disabled={enviando}>
                    {enviando ? 'Enviando…' : 'Enviar postulación'}
                  </button>
                </form>
              </Aparecer>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
