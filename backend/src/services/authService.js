import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { adminRepo } from '../repositories/adminRepo.js';
import { env } from '../config/env.js';
import { badRequest, unauthorized } from '../utils/httpError.js';

export const authService = {
  async login(usuario, password) {
    if (!usuario || !password) throw badRequest('Faltan credenciales');

    const admin = await adminRepo.findByUsuario(usuario.trim().toLowerCase());
    if (!admin) throw unauthorized('Usuario o contraseña incorrectos');

    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok) throw unauthorized('Usuario o contraseña incorrectos');

    const token = jwt.sign(
      { sub: admin.id, usuario: admin.usuario },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn }
    );

    return { token, user: { usuario: admin.usuario } };
  },
};
