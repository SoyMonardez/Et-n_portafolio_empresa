import { postulacionRepo } from '../repositories/postulacionRepo.js';
import { texto, email as validarEmail, escapeHtml, esBot } from './validar.js';
import { badRequest } from '../utils/httpError.js';

export const postulacionService = {
  async create(data, cvPath) {
    if (esBot(data)) return { id: 0 };
    if (!cvPath) throw badRequest('Falta el currículum (PDF)');

    const nombre = texto(data.nombre, { campo: 'nombre', max: 150 });
    const telefono = texto(data.telefono, { campo: 'teléfono', max: 50 });
    const correo = validarEmail(data.email);
    const puesto = texto(data.puesto, { campo: 'puesto', max: 150, requerido: false });
    const mensaje = texto(data.mensaje, { campo: 'mensaje', max: 3000, requerido: false });

    const id = await postulacionRepo.create({
      nombre: escapeHtml(nombre),
      telefono,
      email: correo,
      puesto: puesto ? escapeHtml(puesto) : null,
      mensaje: mensaje ? escapeHtml(mensaje) : null,
      cvPath,
    });

    return { id };
  },

  list() {
    return postulacionRepo.findAll();
  },
};
