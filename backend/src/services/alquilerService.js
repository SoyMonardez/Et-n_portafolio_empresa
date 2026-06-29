import { alquilerRepo } from '../repositories/alquilerRepo.js';
import { texto, email as validarEmail, escapeHtml, esBot } from './validar.js';

export const alquilerService = {
  async create(data) {
    if (esBot(data)) return { id: 0 };

    const maquinaNombre = texto(data.maquinaNombre, { campo: 'máquina', max: 150 });
    const nombre = texto(data.nombre, { campo: 'nombre', max: 150 });
    const telefono = texto(data.telefono, { campo: 'teléfono', max: 50 });
    const correo = validarEmail(data.email, { requerido: false });
    const mensaje = texto(data.mensaje, { campo: 'mensaje', max: 2000, requerido: false });

    const id = await alquilerRepo.create({
      maquinaNombre: escapeHtml(maquinaNombre),
      nombre: escapeHtml(nombre),
      telefono,
      email: correo,
      mensaje: mensaje ? escapeHtml(mensaje) : null,
    });

    return { id };
  },

  list() {
    return alquilerRepo.findAll();
  },
};
