import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';
import { postulacionService } from '../services/postulacionService.js';
import { formRateLimiter } from '../middlewares/rateLimit.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { badRequest } from '../utils/httpError.js';
import { env } from '../config/env.js';

const cvDir = path.resolve(process.cwd(), env.upload.dir, 'cv');

const storage = multer.diskStorage({
  destination: cvDir,
  filename: (_req, file, cb) => {
    const nombreSeguro = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.pdf`;
    cb(null, nombreSeguro);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: env.upload.maxBytes },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(badRequest('El currículum debe ser un PDF'));
    }
    cb(null, true);
  },
});

const router = Router();

router.post('/', formRateLimiter, upload.single('cv'), asyncHandler(async (req, res) => {
  const cvPath = req.file ? `/uploads/cv/${req.file.filename}` : null;
  const result = await postulacionService.create(req.body || {}, cvPath);
  res.json({ ok: true, id: result.id });
}));

export default router;
