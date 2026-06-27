import {
  FiTool,
  FiTruck,
  FiLayers,
  FiGrid,
  FiHome,
} from 'react-icons/fi'

// Borrador de servicios. Los textos definitivos los confirma la empresa.
export const SERVICIOS = [
  {
    id: 'demolicion',
    icono: FiTool,
    titulo: 'Demolición',
    resumen:
      'Demolición de estructuras de todo tipo con equipo propio, retiro de escombros y limpieza del predio.',
  },
  {
    id: 'piedra-bola',
    icono: FiGrid,
    titulo: 'Piedra bola',
    resumen:
      'Provisión y colocación de piedra bola para defensas, gaviones y obras de contención.',
  },
  {
    id: 'veredas',
    icono: FiLayers,
    titulo: 'Veredas y pavimentos',
    resumen:
      'Construcción y reparación de veredas, cordones cuneta y solados de hormigón.',
  },
  {
    id: 'obra-civil',
    icono: FiHome,
    titulo: 'Obra civil',
    resumen:
      'Movimiento de suelos, excavaciones y trabajos de obra civil para municipios y privados.',
  },
  {
    id: 'campamentos-mineros',
    icono: FiTruck,
    titulo: 'Mantenimiento de campamentos mineros',
    resumen:
      'Servicios de mantenimiento e infraestructura para campamentos y operaciones mineras.',
    nuevo: true,
  },
]
