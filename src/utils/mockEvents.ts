// Datos mock para eventos relacionados con luna llena

export interface MoonEvent {
  id: string;
  title: string;
  city: string;
  province: string;
  organizer: string;
  date: Date;
  description: string;
  type: 'experiencia' | 'ritual' | 'aventura' | 'comunidad';
}

export const mockEvents: MoonEvent[] = [
  {
    id: '1',
    title: 'Travesía por el río Paraná en paddle surf',
    city: 'Rosario',
    province: 'Santa Fe',
    organizer: 'India Sup Rosario',
    date: new Date('2026-02-21T20:00:00'),
    description: 'Experiencia única navegando bajo la luna llena por el majestuoso río Paraná.',
    type: 'aventura'
  },
  {
    id: '2',
    title: 'Círculo de meditación bajo la luna',
    city: 'Buenos Aires',
    province: 'CABA',
    organizer: 'Luna Consciente',
    date: new Date('2026-02-21T19:30:00'),
    description: 'Meditación grupal en conexión con la energía lunar en los bosques de Palermo.',
    type: 'ritual'
  },
  {
    id: '3',
    title: 'Caminata nocturna de luna llena',
    city: 'San Carlos de Bariloche',
    province: 'Río Negro',
    organizer: 'Senderos Patagónicos',
    date: new Date('2026-02-21T21:00:00'),
    description: 'Trekking nocturno por senderos de montaña iluminados por la luna llena.',
    type: 'aventura'
  },
  {
    id: '4',
    title: 'Ritual de liberación y gratitud',
    city: 'Córdoba',
    province: 'Córdoba',
    organizer: 'Círculo Sagrado',
    date: new Date('2026-02-21T20:30:00'),
    description: 'Ceremonia comunitaria para soltar lo viejo y celebrar lo nuevo.',
    type: 'ritual'
  },
  {
    id: '5',
    title: 'Yoga bajo las estrellas',
    city: 'Mendoza',
    province: 'Mendoza',
    organizer: 'Alma Yoga',
    date: new Date('2026-02-21T20:00:00'),
    description: 'Práctica de yoga restaurativo al aire libre bajo la luz lunar.',
    type: 'experiencia'
  },
  {
    id: '6',
    title: 'Full Moon Beach Party',
    city: 'Mar del Plata',
    province: 'Buenos Aires',
    organizer: 'Costa Eventos',
    date: new Date('2026-02-21T22:00:00'),
    description: 'Fiesta en la playa con música en vivo y fogatas bajo la luna llena.',
    type: 'comunidad'
  },
  {
    id: '7',
    title: 'Observación astronómica lunar',
    city: 'San Juan',
    province: 'San Juan',
    organizer: 'Observatorio Astronómico',
    date: new Date('2026-02-21T21:30:00'),
    description: 'Sesión especial de observación de la luna llena con telescopios profesionales.',
    type: 'experiencia'
  },
  {
    id: '8',
    title: 'Tambores bajo la luna',
    city: 'Salta',
    province: 'Salta',
    organizer: 'Ritmos Ancestrales',
    date: new Date('2026-02-21T20:00:00'),
    description: 'Círculo de tambores y danza ceremonial en las montañas.',
    type: 'ritual'
  },
  {
    id: '9',
    title: 'Kayak nocturno en el Nahuel Huapi',
    city: 'Villa La Angostura',
    province: 'Neuquén',
    organizer: 'Patagonia Aventuras',
    date: new Date('2026-02-21T21:00:00'),
    description: 'Remada nocturna por el lago bajo la luz de la luna llena.',
    type: 'aventura'
  },
  {
    id: '10',
    title: 'Picnic lunar en viñedos',
    city: 'Cafayate',
    province: 'Salta',
    organizer: 'Vinos y Luna',
    date: new Date('2026-02-21T19:30:00'),
    description: 'Cena al aire libre entre viñedos con degustación de vinos locales.',
    type: 'experiencia'
  },
  {
    id: '11',
    title: 'Encuentro de fotografía nocturna',
    city: 'Ushuaia',
    province: 'Tierra del Fuego',
    organizer: 'Fotógrafos del Fin del Mundo',
    date: new Date('2026-02-21T23:00:00'),
    description: 'Salida fotográfica para capturar la luna llena sobre el canal Beagle.',
    type: 'comunidad'
  },
  {
    id: '12',
    title: 'Taller de acuarela lunar',
    city: 'San Miguel de Tucumán',
    province: 'Tucumán',
    organizer: 'Arte y Naturaleza',
    date: new Date('2026-02-21T19:00:00'),
    description: 'Taller de pintura al aire libre inspirado en la luna llena.',
    type: 'experiencia'
  }
];

/**
 * Obtiene eventos para la próxima luna llena
 */
export function getEventsForFullMoon(fullMoonDate: Date): MoonEvent[] {
  // En una aplicación real, esto consultaría una API
  // Por ahora, devolvemos los eventos mock ajustados a la fecha
  return mockEvents.map(event => ({
    ...event,
    date: new Date(fullMoonDate)
  }));
}