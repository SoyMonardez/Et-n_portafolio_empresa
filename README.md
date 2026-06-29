# Etán — Sitio web para constructora (PyME real)

Sitio web institucional desarrollado para **Etán** (San Juan, Argentina), empresa constructora con 20+ años en el mercado (demolición, piedra bola, veredas, obra civil y mantenimiento de campamentos mineros).

Proyecto real, en producción, para un cliente de la industria de la construcción.

## Stack

- **Frontend:** React 19 + Vite + React Router, Framer Motion para animaciones
- **Backend:** Node.js / Express (ESM)
- **Base de datos:** PostgreSQL
- **IA:** microservicio propio (Groq/Llama) detrás de un proxy backend — traducción ES→EN, autocompletado de descripciones y sugerencias de marketing sobre métricas
- **Infraestructura:** Docker + Nginx

## Features

- Diseño editorial a medida (tipografía, fotografía y espacio en blanco como jerarquía visual), mobile-first y con foco en performance (Lighthouse > 90)
- Panel de administración en español simple para que el cliente edite contenido sin conocimientos técnicos: datos de contacto, redes sociales, obras realizadas y maquinaria
- Formularios de contacto y postulación conectados a backend propio
- Analítica propia con consentimiento de cookies (sin servicios de terceros)
- Carrusel de clientes, línea de tiempo institucional y secciones de misión/visión/valores/RSE
- SEO técnico (metadatos, sitemap) y accesibilidad (`prefers-reduced-motion`)

## Desarrollo

```bash
npm install
npm run dev      # frontend (Vite)
cd backend && npm install && npm run dev   # API
```

Requiere PostgreSQL local y variables de entorno (ver `.env.example`).

---

Desarrollado de punta a punta: diseño, frontend, backend, base de datos y despliegue.
