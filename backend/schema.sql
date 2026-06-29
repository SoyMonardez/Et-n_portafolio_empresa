-- Esquema de la base de datos de Etán (PostgreSQL).
-- Se ejecuta una sola vez, al crear el contenedor de la base.

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  usuario TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS presupuestos (
  id SERIAL PRIMARY KEY,
  servicio TEXT NOT NULL,
  ubicacion TEXT NOT NULL,
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT,
  descripcion TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'nuevo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contactos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  mensaje TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'nuevo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS maquinas (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  categoria TEXT NOT NULL,
  detalle TEXT,
  imagen_url TEXT,
  activa BOOLEAN NOT NULL DEFAULT true,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alquiler_solicitudes (
  id SERIAL PRIMARY KEY,
  maquina_id INTEGER REFERENCES maquinas(id) ON DELETE SET NULL,
  maquina_nombre TEXT NOT NULL,
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT,
  mensaje TEXT,
  estado TEXT NOT NULL DEFAULT 'nuevo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS busquedas (
  id SERIAL PRIMARY KEY,
  puesto TEXT NOT NULL,
  lugar TEXT NOT NULL,
  tipo TEXT NOT NULL,
  activa BOOLEAN NOT NULL DEFAULT true,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS postulaciones (
  id SERIAL PRIMARY KEY,
  busqueda_id INTEGER REFERENCES busquedas(id) ON DELETE SET NULL,
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT NOT NULL,
  puesto TEXT,
  mensaje TEXT,
  cv_path TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'nuevo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS obras (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  categoria TEXT NOT NULL,
  lugar TEXT NOT NULL,
  anio TEXT,
  imagen_url TEXT,
  publicada BOOLEAN NOT NULL DEFAULT true,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_config (
  clave TEXT PRIMARY KEY,
  valor TEXT
);

CREATE TABLE IF NOT EXISTS visitas (
  id SERIAL PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  device TEXT,
  browser TEXT,
  country TEXT,
  region TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO site_config (clave, valor) VALUES
  ('telefono', ''),
  ('email', ''),
  ('direccion', 'San Juan, Argentina'),
  ('instagram', ''),
  ('facebook', '')
ON CONFLICT (clave) DO NOTHING;
