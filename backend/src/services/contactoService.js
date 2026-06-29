import { contactoRepo } from '../repositories/contactoRepo.js';
import { texto, email as validarEmail, escapeHtml, esBot } from './validar.js';

export const contactoService = {
  async create(data) {
    if (esBot(data)) return { id: 0 };

    const nombre = texto(data.nombre, { campo: 'nombre', max: 150 });
    const correo = validarEmail(data.email);
    const telefono = texto(data.telefono, { campo: 'teléfono', max: 50, requerido: false });
    const mensaje = texto(data.mensaje, { campo: 'mensaje', max: 5000 });

    const id = await contactoRepo.create({
      nombre: escapeHtml(nombre),
      email: correo,
      telefono,
      mensaje: escapeHtml(mensaje),
    });

    return { id };
  },

  list() {
    return contactoRepo.findAll();
  },
};
