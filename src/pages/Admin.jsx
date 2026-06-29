import { useState } from 'react'
import AdminLogin from '../admin/AdminLogin.jsx'
import AdminPanel from '../admin/AdminPanel.jsx'
import useSeo from '../hooks/useSeo.js'
import { getToken } from '../lib/adminApi.js'
import '../styles/formulario.css'
import '../admin/Admin.css'

export default function Admin() {
  useSeo({ titulo: 'Panel de administración', descripcion: 'Acceso privado de Etán.' })
  const [autenticado, setAutenticado] = useState(() => Boolean(getToken()))

  return autenticado
    ? <AdminPanel onSalir={() => setAutenticado(false)} />
    : <AdminLogin onIngreso={() => setAutenticado(true)} />
}
