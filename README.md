# Etán Construcciones — San Juan, Argentina

## El problema

Etán es una constructora de San Juan con más de 20 años de trayectoria (demolición, piedra bola, veredas, obra civil y mantenimiento de campamentos mineros), pero no tenía presencia web. Todo el contacto con clientes nuevos —empresas mineras, municipios, particulares— dependía de referidos y contacto directo. Sin un lugar donde mostrar las obras realizadas, la maquinaria propia y los datos de contacto, perdían oportunidades frente a competidores que sí aparecen en una búsqueda de Google.

Tampoco tenían forma de recibir y ordenar postulaciones laborales ni consultas comerciales: llegaban (o se perdían) por WhatsApp o llamadas sueltas.

## La solución

Un sitio que vende la empresa de entrada —diseño editorial con fotos reales de obras, no una plantilla genérica— y un sistema detrás que la empresa puede operar sola, sin depender de un programador para cada cambio:

- **Captación de clientes:** formularios de contacto y cotización que llegan ordenados al backend, en vez de perderse en chats.
- **Banco de obras y maquinaria editable:** quien atiende el sitio (sin conocimientos técnicos) sube fotos y datos de proyectos terminados y equipos propios desde un panel en español simple, sin tocar código.
- **Postulaciones laborales:** bandeja de candidatos en el admin, en vez de currículums sueltos por WhatsApp.
- **Alcance a clientes mineros/internacionales:** traducción automática ES→EN del contenido (microservicio de IA propio) para no perder leads por idioma.
- **Métricas propias:** analítica con consentimiento de cookies, sin depender de Google Analytics ni ceder los datos a terceros.

## Impacto

- Le da a una PyME real una vidriera profesional que antes no existía, comparable a la de competidores más grandes.
- Reduce la dependencia del dueño/encargado para actualizar el sitio: el admin está pensado para alguien sin perfil técnico.
- Ordena un proceso que antes era informal (consultas y postulaciones por WhatsApp) en un flujo con registro y seguimiento.

## Stack

- **Frontend:** React 19 + Vite + React Router + Framer Motion
- **Backend:** Node.js / Express (ESM)
- **Base de datos:** PostgreSQL
- **IA:** microservicio propio (Groq/Llama) detrás de un proxy backend — traducción, autocompletado de descripciones, sugerencias sobre métricas
- **Infraestructura:** Docker + Nginx

## Desarrollo

```bash
npm install
npm run dev      # frontend (Vite)
cd backend && npm install && npm run dev   # API
```

Requiere PostgreSQL local y variables de entorno (ver `.env.example`).

---

Proyecto real para un cliente, desarrollado de punta a punta: diseño, frontend, backend, base de datos y despliegue.
