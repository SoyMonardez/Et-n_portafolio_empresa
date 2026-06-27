import Encabezado from '../components/util/Encabezado.jsx'
import Aparecer from '../components/util/Aparecer.jsx'

export default function Legal() {
  return (
    <>
      <Encabezado
        titulo="Política de privacidad y cookies"
        bajada="Te contamos en palabras simples qué información usamos y para qué."
      />
      <section className="seccion contenedor" style={{ maxWidth: 760 }}>
        <Aparecer>
          <div className="texto-legal">
            <h2>¿Qué datos recogemos?</h2>
            <p>
              Cuando completás un formulario (presupuesto, contacto, alquiler o
              postulación), guardamos los datos que nos dejás para poder
              responderte. Además, medimos de forma anónima las visitas a la
              página para saber qué contenido es más útil.
            </p>

            <h2>¿Para qué los usamos?</h2>
            <p>
              Únicamente para responder tus consultas, gestionar tu pedido y
              mejorar el sitio. No vendemos ni compartimos tus datos con terceros.
            </p>

            <h2>Cookies</h2>
            <p>
              Usamos cookies propias para recordar tus preferencias (por ejemplo, el
              modo claro u oscuro) y, si lo aceptás, para medir las visitas de forma
              anónima. Podés rechazarlas y el sitio funciona igual.
            </p>

            <h2>Tus derechos</h2>
            <p>
              Podés pedirnos en cualquier momento que actualicemos o borremos tus
              datos escribiéndonos por la página de contacto.
            </p>
          </div>
        </Aparecer>
      </section>
    </>
  )
}
