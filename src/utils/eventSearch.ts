import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getMoonPhase, getNextFullMoon } from '@/utils/moonPhases';

export interface EventDiscoveryResource {
  id: string;
  platform: string;
  title: string;
  description: string;
  url: string;
  accent: string;
}

function buildSearchQuery(city: string, selectedDate: Date): string {
  const phase = getMoonPhase(selectedDate);
  const nextFullMoon = getNextFullMoon(selectedDate).date;
  const month = format(nextFullMoon, 'MMMM', { locale: es });
  const year = nextFullMoon.getFullYear();

  return [
    'eventos luna llena',
    city,
    month,
    year,
    phase.phaseName === 'Luna Llena' ? 'hoy' : 'proxima luna llena',
  ].join(' ');
}

export function getEventSearchResources(city: string, selectedDate: Date): EventDiscoveryResource[] {
  const normalizedCity = city.trim();
  if (!normalizedCity) {
    return [];
  }

  const query = buildSearchQuery(normalizedCity, selectedDate);
  const encoded = encodeURIComponent(query);

  return [
    {
      id: 'google',
      platform: 'Google',
      title: `Buscar en Google`,
      description: `Resultados abiertos sobre actividades, ceremonias, salidas y propuestas en ${normalizedCity}.`,
      url: `https://www.google.com/search?q=${encoded}`,
      accent: 'from-sky-400/30 to-white/10',
    },
    {
      id: 'news',
      platform: 'Google News',
      title: 'Noticias y agenda local',
      description: 'Notas de prensa, agenda cultural y menciones recientes relacionadas con luna llena.',
      url: `https://news.google.com/search?q=${encoded}&hl=es-419&gl=AR&ceid=AR:es-419`,
      accent: 'from-indigo-400/25 to-white/10',
    },
    {
      id: 'instagram',
      platform: 'Instagram',
      title: 'Explorar en Instagram',
      description: 'Ideal para encontrar convocatorias visuales, retiros, ceremonias y experiencias compartidas.',
      url: `https://www.instagram.com/explore/search/keyword/?q=${encoded}`,
      accent: 'from-pink-400/30 to-orange-300/10',
    },
    {
      id: 'facebook',
      platform: 'Facebook',
      title: 'Ver eventos en Facebook',
      description: 'Suele concentrar encuentros presenciales, talleres y grupos abiertos por ciudad.',
      url: `https://www.facebook.com/search/events/?q=${encoded}`,
      accent: 'from-blue-400/30 to-white/10',
    },
    {
      id: 'eventbrite',
      platform: 'Eventbrite',
      title: 'Buscar en Eventbrite',
      description: 'Buen punto de partida para experiencias pagas o con reserva previa.',
      url: `https://www.eventbrite.com/d/argentina--${encodeURIComponent(normalizedCity.toLowerCase())}/all-events/?q=${encoded}`,
      accent: 'from-amber-300/30 to-white/10',
    },
    {
      id: 'meetup',
      platform: 'Meetup',
      title: 'Comunidades y salidas',
      description: 'Sirve para descubrir grupos, observaciones astronómicas y actividades comunitarias.',
      url: `https://www.meetup.com/find/?keywords=${encoded}&source=EVENTS`,
      accent: 'from-emerald-400/30 to-white/10',
    },
  ];
}
