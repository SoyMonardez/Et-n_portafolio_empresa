import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Al cambiar de página, vuelve al inicio del scroll.
export default function IrArriba() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}
