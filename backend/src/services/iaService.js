import { env } from '../config/env.js';
import { HttpError, badRequest } from '../utils/httpError.js';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Llama a Groq con un prompt de sistema + uno de usuario y devuelve el texto.
async function pedir({ sistema, usuario, maxTokens = 500, temperatura = 0.6 }) {
  if (!env.groq.apiKey) {
    throw new HttpError(503, 'La IA no está configurada todavía. Falta cargar la API key de Groq.');
  }

  let res;
  try {
    res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.groq.apiKey}`,
      },
      body: JSON.stringify({
        model: env.groq.model,
        temperature: temperatura,
        max_tokens: maxTokens,
        messages: [
          { role: 'system', content: sistema },
          { role: 'user', content: usuario },
        ],
      }),
    });
  } catch {
    throw new HttpError(502, 'No pudimos conectar con el servicio de IA.');
  }

  if (!res.ok) {
    throw new HttpError(502, 'El servicio de IA devolvió un error. Probá de nuevo en un momento.');
  }

  const data = await res.json();
  const texto = data?.choices?.[0]?.message?.content?.trim();
  if (!texto) throw new HttpError(502, 'La IA no devolvió una respuesta.');
  return texto;
}

export const iaService = {
  // Sugiere una descripción profesional para una obra o máquina, en español.
  async sugerirDescripcion({ tipo, nombre, categoria, datos }) {
    if (!nombre) throw badRequest('Falta el nombre para sugerir la descripción');
    const sistema =
      'Sos redactor de una empresa constructora argentina. Escribís descripciones ' +
      'breves (2 a 3 oraciones), claras y profesionales, en español rioplatense, sin ' +
      'exagerar ni usar palabras en inglés. No uses comillas ni títulos, solo el texto.';
    const usuario =
      `Escribí una descripción para ${tipo === 'maquina' ? 'esta máquina en alquiler' : 'esta obra'}:\n` +
      `Nombre: ${nombre}\n` +
      (categoria ? `Categoría: ${categoria}\n` : '') +
      (datos ? `Datos extra: ${datos}\n` : '');
    return pedir({ sistema, usuario, maxTokens: 220 });
  },

  // Analiza las métricas de visitas y sugiere acciones de marketing simples.
  async analizarMetricas(resumen) {
    const sistema =
      'Sos asesor de marketing digital que le explica a alguien sin experiencia. ' +
      'Respondés en español rioplatense, claro y concreto, en 3 a 5 viñetas cortas ' +
      'que empiecen con "- ". Nada de jerga ni inglés. Enfocate en a qué público ' +
      'apuntar, qué canal conviene y qué páginas mejorar.';
    const usuario =
      'Estos son los datos de visitas del sitio de una constructora de San Juan, ' +
      'Argentina. Dame recomendaciones de marketing:\n' +
      JSON.stringify(resumen);
    return pedir({ sistema, usuario, maxTokens: 450, temperatura: 0.5 });
  },

  // Traduce un texto de español a inglés.
  async traducir(texto) {
    const limpio = (texto || '').trim().slice(0, 4000);
    if (!limpio) throw badRequest('Falta el texto a traducir');
    const sistema =
      'You are a professional translator. Translate the text from Spanish to English. ' +
      'Keep the tone and meaning. Return ONLY the translation, no quotes, no notes.';
    return pedir({ sistema, usuario: limpio, maxTokens: 1000, temperatura: 0.2 });
  },
};
