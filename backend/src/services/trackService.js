import { visitaRepo } from '../repositories/visitaRepo.js';

// Detecta el tipo de dispositivo a partir del user-agent (sin librerías).
function detectarDevice(ua = '') {
  if (/mobile|iphone|android.*mobile/i.test(ua)) return 'Celular';
  if (/ipad|tablet|android(?!.*mobile)/i.test(ua)) return 'Tablet';
  return 'Computadora';
}

function detectarBrowser(ua = '') {
  if (/edg/i.test(ua)) return 'Edge';
  if (/opr|opera/i.test(ua)) return 'Opera';
  if (/chrome|crios/i.test(ua)) return 'Chrome';
  if (/firefox|fxios/i.test(ua)) return 'Firefox';
  if (/safari/i.test(ua)) return 'Safari';
  return 'Otro';
}

const recortar = (v, n) => (typeof v === 'string' ? v.slice(0, n) : null);

export const trackService = {
  async registrar(body, headers) {
    const ua = headers['user-agent'] || '';
    // País/región: solo si el proxy (Cloudflare/Nginx) los pasa por header.
    // No guardamos la IP: la analítica es anónima.
    const country = recortar(headers['cf-ipcountry'] || headers['x-geo-country'], 4);
    const region = recortar(headers['x-geo-region'], 80);

    await visitaRepo.create({
      path: recortar(body.path, 300) || '/',
      referrer: recortar(body.referrer, 500),
      utmSource: recortar(body.utm_source, 100),
      utmMedium: recortar(body.utm_medium, 100),
      utmCampaign: recortar(body.utm_campaign, 100),
      device: detectarDevice(ua),
      browser: detectarBrowser(ua),
      country: country && country !== 'XX' ? country : null,
      region,
      sessionId: recortar(body.session_id, 64),
    });
  },
};
