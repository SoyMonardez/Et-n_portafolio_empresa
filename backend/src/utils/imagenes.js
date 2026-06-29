import multer from 'multer';
import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { env } from '../config/env.js';
import { badRequest } from './httpError.js';

const imgDir = path.resolve(process.cwd(), env.upload.dir, 'img');

// Recibimos el archivo en memoria y lo convertimos nosotros a WebP, así las
// fotos pesan poco y cargan rápido (no guardamos el PNG/JPG pesado original).
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.upload.maxBytes },
  fileFilter: (_req, file, cb) => {
    if (!/^image\/(jpe?g|png|webp|avif)$/.test(file.mimetype)) {
      return cb(badRequest('La imagen debe ser JPG, PNG o WebP'));
    }
    cb(null, true);
  },
});

// Middleware: acepta un campo "imagen" opcional.
export const recibirImagen = upload.single('imagen');

// Convierte el archivo subido a WebP optimizado y devuelve su URL pública.
// Si no se subió nada, devuelve null (para no pisar la imagen existente).
export async function guardarImagen(file) {
  if (!file) return null;
  await fs.mkdir(imgDir, { recursive: true });
  const nombre = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.webp`;
  await sharp(file.buffer)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(path.join(imgDir, nombre));
  return `/uploads/img/${nombre}`;
}
