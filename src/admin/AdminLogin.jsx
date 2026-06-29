import { useState } from 'react'
import { login, setToken } from '../lib/adminApi.js'

export default function AdminLogin({ onIngreso }) {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const { token } = await login(usuario, password)
      setToken(token)
      onIngreso()
    } catch (err) {
      setError(err.message || 'No pudimos iniciar sesión.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login__caja" onSubmit={enviar}>
        <h1 className="admin-login__titulo">ETÁN</h1>
        <p className="admin-login__bajada">Panel de administración</p>

        <div className="formE__campo">
          <label htmlFor="a-usuario">Usuario</label>
          <input
            id="a-usuario"
            type="text"
            required
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoFocus
          />
        </div>
        <div className="formE__campo">
          <label htmlFor="a-password">Contraseña</label>
          <input
            id="a-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="formE__ayuda" style={{ color: 'var(--error)' }}>{error}</p>}

        <button type="submit" className="boton boton--principal" disabled={cargando} style={{ width: '100%', marginTop: 8 }}>
          {cargando ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}
