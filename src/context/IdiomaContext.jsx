import { createContext, useContext, useEffect, useState } from 'react'

const IdiomaContext = createContext(null)

const CLAVE = 'etan-idioma'

function idiomaInicial() {
  if (typeof window === 'undefined') return 'es'
  return localStorage.getItem(CLAVE) === 'en' ? 'en' : 'es'
}

export function IdiomaProvider({ children }) {
  const [idioma, setIdiomaState] = useState(idiomaInicial)

  useEffect(() => {
    document.documentElement.setAttribute('lang', idioma)
    localStorage.setItem(CLAVE, idioma)
  }, [idioma])

  const alternar = () => setIdiomaState((i) => (i === 'en' ? 'es' : 'en'))

  return (
    <IdiomaContext.Provider value={{ idioma, alternar }}>
      {children}
    </IdiomaContext.Provider>
  )
}

export function useIdioma() {
  const ctx = useContext(IdiomaContext)
  if (!ctx) throw new Error('useIdioma debe usarse dentro de IdiomaProvider')
  return ctx
}
