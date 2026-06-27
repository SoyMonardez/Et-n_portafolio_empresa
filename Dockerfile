# ---- Etapa 1: construir el sitio ----
FROM node:22-alpine AS build
WORKDIR /app

# Instalar dependencias (se cachea si package.json no cambia)
COPY package.json package-lock.json ./
RUN npm ci

# Copiar el resto y generar el build de producción
COPY . .
RUN npm run build

# ---- Etapa 2: servir con Nginx ----
FROM nginx:alpine AS produccion

# Configuración propia (rutas de React + compresión + caché)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Archivos estáticos generados en la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
