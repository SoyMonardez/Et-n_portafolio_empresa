// Carga el contenido inicial (maquinaria, obras, búsquedas) en la base, una
// sola vez. Las imágenes apuntan a las fotos estáticas que ya están en el
// sitio; desde el admin se reemplazan por fotos subidas cuando se quiera.
// Uso: node scripts/seedContenido.js
import { pool } from '../src/config/db.js';

const MAQUINAS = [
  ['Excavadora hidráulica', 'Movimiento de suelo', 'Para excavaciones, zanjeo y carga de material en obra.', '/img/maq-excavadora.jpg'],
  ['Pala cargadora frontal', 'Movimiento de suelo', 'Carga y traslado de áridos, tierra y escombros dentro de la obra.', '/img/maq-topadora.jpg'],
  ['Camión volcador', 'Transporte', 'Traslado de áridos, escombros y materiales a granel.', '/img/maq-camion.jpg'],
  ['Grúa', 'Izaje', 'Elevación y montaje de estructuras y materiales pesados.', '/img/maq-grua.jpg'],
  ['Rodillo compactador', 'Compactación', 'Compactación de suelo y bases para veredas y pavimentos.', '/img/maq-rodillo.jpg'],
];

const OBRAS = [
  ['Demolición y retiro — Capital', 'Demolición', 'Ciudad de San Juan', '2023', '/img/proyecto-1.jpg'],
  ['Veredas y cordón cuneta', 'Veredas', 'Chimbas', '2022', '/img/proyecto-2.jpg'],
  ['Defensa con piedra bola', 'Piedra bola', 'Albardón', '2021', '/img/proyecto-3.jpg'],
  ['Movimiento de suelos y obra civil', 'Obra civil', 'San Luis', '2023', '/img/serv-obra.jpg'],
  ['Demolición de galpón industrial', 'Demolición', 'Ciudad de San Juan', '2022', '/img/serv-demolicion.jpg'],
  ['Cordón cuneta y solados', 'Veredas', 'Capital', '2024', '/img/serv-veredas.jpg'],
];

const BUSQUEDAS = [
  ['Operario de maquinaria pesada', 'San Juan (Capital y alrededores)', 'Tiempo completo'],
  ['Ayudante de obra', 'San Juan', 'Tiempo completo'],
];

async function sembrar(tabla, contador, insertar) {
  const { rows } = await pool.query(`SELECT COUNT(*)::int AS n FROM ${tabla}`);
  if (rows[0].n > 0) {
    console.log(`- ${tabla}: ya tiene datos (${rows[0].n}), se omite.`);
    return;
  }
  await insertar();
  console.log(`- ${tabla}: sembrada (${contador}).`);
}

await sembrar('maquinas', MAQUINAS.length, async () => {
  for (const [nombre, categoria, detalle, img] of MAQUINAS) {
    await pool.query(
      'INSERT INTO maquinas (nombre, categoria, detalle, imagen_url) VALUES ($1,$2,$3,$4)',
      [nombre, categoria, detalle, img]
    );
  }
});

await sembrar('obras', OBRAS.length, async () => {
  for (const [titulo, categoria, lugar, anio, img] of OBRAS) {
    await pool.query(
      'INSERT INTO obras (titulo, categoria, lugar, anio, imagen_url) VALUES ($1,$2,$3,$4,$5)',
      [titulo, categoria, lugar, anio, img]
    );
  }
});

await sembrar('busquedas', BUSQUEDAS.length, async () => {
  for (const [puesto, lugar, tipo] of BUSQUEDAS) {
    await pool.query(
      'INSERT INTO busquedas (puesto, lugar, tipo) VALUES ($1,$2,$3)',
      [puesto, lugar, tipo]
    );
  }
});

console.log('Listo.');
await pool.end();
