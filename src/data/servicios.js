import {
  FiTool,
  FiTruck,
  FiLayers,
  FiGrid,
  FiHome,
} from 'react-icons/fi'

// Borrador de servicios. Los textos definitivos los confirma la empresa.
// "detalle" se muestra al seleccionar el servicio; "tono" colorea el panel
// ilustrativo mientras no haya foto real.
export const SERVICIOS = [
  {
    id: 'demolicion',
    icono: FiTool,
    titulo: 'Demolición',
    resumen: 'Demolición de estructuras con equipo propio y retiro de escombros.',
    detalle:
      'Demolemos estructuras de todo tipo de forma segura, con maquinaria propia. Incluye el retiro de escombros y la limpieza del predio para dejarlo listo para la próxima etapa.',
    img: '/img/serv-demolicion.jpg',
  },
  {
    id: 'piedra-bola',
    icono: FiGrid,
    titulo: 'Piedra bola',
    resumen: 'Provisión y colocación para defensas y obras de contención.',
    detalle:
      'Proveemos y colocamos piedra bola para defensas, gaviones y obras de contención, protegiendo márgenes y terrenos de la erosión.',
    img: '/img/serv-piedra.jpg',
  },
  {
    id: 'veredas',
    icono: FiLayers,
    titulo: 'Veredas y pavimentos',
    resumen: 'Veredas, cordón cuneta y solados de hormigón.',
    detalle:
      'Construimos y reparamos veredas, cordón cuneta y solados de hormigón, con terminaciones prolijas y durables para espacios públicos y privados.',
    img: '/img/serv-veredas.jpg',
  },
  {
    id: 'obra-civil',
    icono: FiHome,
    titulo: 'Obra civil',
    resumen: 'Movimiento de suelos, excavaciones y obra civil.',
    detalle:
      'Realizamos movimiento de suelos, excavaciones y trabajos de obra civil para municipios, empresas y particulares, con planificación y maquinaria adecuada.',
    img: '/img/serv-obra.jpg',
  },
  {
    id: 'campamentos-mineros',
    icono: FiTruck,
    titulo: 'Mantenimiento de campamentos mineros',
    resumen: 'Infraestructura y mantenimiento para operaciones mineras.',
    detalle:
      'Nuevo servicio: mantenimiento e infraestructura para campamentos y operaciones mineras, con la experiencia de más de 20 años en obra.',
    img: '/img/serv-mineria.jpg',
    nuevo: true,
  },
]
