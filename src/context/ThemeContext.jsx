import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

const CLAVE = 'etan-tema'

function temaInicial() {
  if (typeof window === 'undefined') return 'claro'
  const guardado = localStorage.getItem(CLAVE)
  if (guardado === 'claro' || guardado === 'oscuro') return guardado
  // Si el sistema del visitante está en oscuro, arrancamos en oscuro.
  const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefiereOscuro ? 'oscuro' : 'claro'
}

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(temaInicial)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema)
    localStorage.setItem(CLAVE, tema)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', tema === 'oscuro' ? '#13201f' : '#0d4f4a')
  }, [tema])

  const alternar = () => setTema((t) => (t === 'oscuro' ? 'claro' : 'oscuro'))

  return (
    <ThemeContext.Provider value={{ tema, alternar }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTema() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTema debe usarse dentro de ThemeProvider')
  return ctx
}
