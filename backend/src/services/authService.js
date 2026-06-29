import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { adminRepo } from '../repositories/adminRepo.js';
import { env } from '../config/env.js';
import { badRequest, unauthorized } from '../utils/httpError.js';

export const authService = {
  async login(email, password) {
    if (!email || !password) throw badRequest('Faltan credenciales');

    const admin = await adminRepo.findByEmail(email.trim().toLowerCase());
    if (!admin) throw unauthorized('Email o contraseña incorrectos');

    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok) throw unauthorized('Email o contraseña incorrectos');

    const token = jwt.sign(
      { sub: admin.id, email: admin.email },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn }
    );

    return { token, user: { email: admin.email } };
  },
};
