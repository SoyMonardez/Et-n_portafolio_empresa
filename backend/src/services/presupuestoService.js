import { presupuestoRepo } from '../repositories/presupuestoRepo.js';
import { texto, email as validarEmail, escapeHtml, esBot } from './validar.js';

export const presupuestoService = {
  async create(data) {
    if (esBot(data)) return { id: 0 };

    const servicio = texto(data.servicio, { campo: 'servicio', max: 150 });
    const ubicacion = texto(data.ubicacion, { campo: 'ubicación', max: 150 });
    const nombre = texto(data.nombre, { campo: 'nombre', max: 150 });
    const telefono = texto(data.telefono, { campo: 'teléfono', max: 50 });
    const descripcion = texto(data.descripcion, { campo: 'descripción', max: 5000 });
    const correo = validarEmail(data.email, { requerido: false });

    const id = await presupuestoRepo.create({
      servicio: escapeHtml(servicio),
      ubicacion: escapeHtml(ubicacion),
      nombre: escapeHtml(nombre),
      telefono,
      email: correo,
      descripcion: escapeHtml(descripcion),
    });

    return { id };
  },

  list() {
    return presupuestoRepo.findAll();
  },
};
