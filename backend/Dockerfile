FROM node:22-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY . .

RUN mkdir -p uploads/cv

EXPOSE 4000
CMD ["node", "src/server.js"]
