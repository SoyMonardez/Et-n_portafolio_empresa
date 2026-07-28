// Convierte las fotos estáticas de public/img a WebP livianas (uso único,
// se borra o se deja como herramienta para futuras fotos del sitio).
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const DIR = path.join(__dirname, '..', 'public', 'img')
const MAX_ANCHO = 1600
const CALIDAD = 75

async function main() {
  const archivos = fs.readdirSync(DIR).filter((f) => /\.jpe?g$/i.test(f))
  for (const archivo of archivos) {
    const entrada = path.join(DIR, archivo)
    const salida = path.join(DIR, archivo.replace(/\.jpe?g$/i, '.webp'))
    const meta = await sharp(entrada).metadata()
    const ancho = Math.min(meta.width, MAX_ANCHO)
    await sharp(entrada)
      .resize({ width: ancho, withoutEnlargement: true })
      .webp({ quality: CALIDAD })
      .toFile(salida)
    const antes = fs.statSync(entrada).size
    const despues = fs.statSync(salida).size
    console.log(
      `${archivo}: ${meta.width}x${meta.height} ${(antes / 1024).toFixed(0)}KB -> ${(despues / 1024).toFixed(0)}KB`
    )
  }
}

main()
