// Crea (o actualiza la contraseña de) el usuario admin.
// Uso: node scripts/createAdmin.js usuario contraseña
import bcrypt from 'bcryptjs';
import { adminRepo } from '../src/repositories/adminRepo.js';
import { pool } from '../src/config/db.js';

const [, , usuario, password] = process.argv;

if (!usuario || !password) {
  console.error('Uso: node scripts/createAdmin.js usuario contraseña');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
await adminRepo.crear(usuario.trim().toLowerCase(), hash);
console.log(`Listo: admin "${usuario}" creado/actualizado.`);
await pool.end();
