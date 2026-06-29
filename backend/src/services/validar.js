import { badRequest } from '../utils/httpError.js';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function texto(valor, { campo, max = 5000, requerido = true }) {
  const limpio = typeof valor === 'string' ? valor.trim().slice(0, max) : '';
  if (requerido && !limpio) throw badRequest(`Falta el campo: ${campo}`);
  return limpio;
}

export function email(valor, { requerido = true } = {}) {
  const limpio = typeof valor === 'string' ? valor.trim().slice(0, 150) : '';
  if (!limpio) {
    if (requerido) throw badRequest('Falta el email');
    return '';
  }
  if (!EMAIL_RE.test(limpio)) throw badRequest('Email inválido');
  return limpio;
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Honeypot: campo invisible que solo llenan los bots.
export function esBot(data) {
  return Boolean(data.website || data.honeypot);
}
