// Crea (o actualiza la contraseña de) el usuario admin.
// Uso: node scripts/createAdmin.js correo@ejemplo.com unaContraseñaSegura
import bcrypt from 'bcryptjs';
import { adminRepo } from '../src/repositories/adminRepo.js';
import { pool } from '../src/config/db.js';

const [, , email, password] = process.argv;

if (!email || !password) {
  console.error('Uso: node scripts/createAdmin.js correo@ejemplo.com contraseña');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
await adminRepo.crear(email.trim().toLowerCase(), hash);
console.log(`Listo: admin "${email}" creado/actualizado.`);
await pool.end();
