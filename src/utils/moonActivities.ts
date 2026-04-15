import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export interface MoonActivity {
  id: string;
  title: string;
  city: string;
  province: string;
  date: string;
  type: 'observacion' | 'comunidad' | 'agenda';
  summary: string;
  tips: string[];
  note?: string;
  sourceName: string;
  sourceUrl?: string;
}

export const moonActivities: MoonActivity[] = [
  {
    id: 'cordoba-observatorio-verano-2026',
    title: 'Noches de observación en el Observatorio de Córdoba',
    city: 'Córdoba',
    province: 'Córdoba',
    date: '2026-01-10T20:00:00-03:00',
    type: 'observacion',
    summary:
      'El Observatorio Astronómico de Córdoba abrió su sede histórica de Laprida 854 de lunes a sábados, de 20 a 23, con observaciones con telescopio ecuatorial, recorridos guiados y museo para público general.',
    tips: [
      'Conviene llegar temprano para sumarse a los primeros grupos.',
      'Las observaciones dependen del clima, así que el cielo despejado suma mucho.',
      'La propuesta está pensada para todo público y no requiere reserva previa.',
    ],
    note: 'La UNC informó además que la entrada general es paga para mayores de 12 años y gratuita para menores.',
    sourceName: 'Universidad Nacional de Córdoba',
    sourceUrl: 'https://www.unc.edu.ar/comunicaci%C3%B3n/un-verano-para-mirar-el-cielo-desde-el-coraz%C3%B3n-de-c%C3%B3rdoba',
  },
  {
    id: 'rosario-atardeceres-cientificos-2026',
    title: 'Atardeceres Científicos en el Planetario de Rosario',
    city: 'Rosario',
    province: 'Santa Fe',
    date: '2026-02-20T19:00:00-03:00',
    type: 'comunidad',
    summary:
      'El Complejo Astronómico Municipal confirmó una edición de Atardeceres Científicos con charlas, observaciones del cielo, proyecciones fulldome y peña astronómica al aire libre.',
    tips: [
      'Llevá reposera o manta para instalarte con más comodidad.',
      'Las entradas para proyecciones se retiran el mismo día en boletería.',
      'Las actividades del parque son abiertas y no requieren reserva previa.',
    ],
    note: 'El formato mezcla ciencia, arte, música y telescopios, ideal para ir en grupo o en familia.',
    sourceName: 'Rosario la Ciudad',
    sourceUrl: 'https://rosariolaciudad.com.ar/vuelven-los-atardeceres-cientificos-al-planetario-de-rosario/',
  },
  {
    id: 'caba-saturno-luna-planetario-2026',
    title: 'Saturno y la Luna en conjunción al anochecer',
    city: 'Buenos Aires',
    province: 'CABA',
    date: '2026-02-19T20:15:00-03:00',
    type: 'agenda',
    summary:
      'El Planetario Galileo Galilei destacó la conjunción entre Saturno y una Luna creciente fina, visible baja sobre el horizonte oeste al anochecer.',
    tips: [
      'Buscá un horizonte oeste lo más despejado posible.',
      'Si tenés binoculares, la escena gana mucho.',
      'Conviene estar listo apenas cae el sol porque el fenómeno sucede a baja altura.',
    ],
    note: 'El propio Planetario remarcó que una visual libre de obstáculos es clave para no perderla.',
    sourceName: 'Planetario Galileo Galilei',
    sourceUrl: 'https://planetario.buenosaires.gob.ar/vistas-y-efemerides-0',
  },
  {
    id: 'la-plata-eclipse-total-luna-2026',
    title: 'Eclipse total de Luna visible en Argentina',
    city: 'La Plata',
    province: 'Buenos Aires',
    date: '2026-03-03T05:44:00-03:00',
    type: 'observacion',
    summary:
      'El calendario astronómico de Visita La Plata marcó el 3 de marzo como noche de eclipse total de Luna, visible en toda Argentina durante la madrugada y con clímax alrededor de las 6:39.',
    tips: [
      'Elegí un lugar con buena vista al cielo del oeste y sudoeste durante la madrugada.',
      'Llevá abrigo y configurá el celular en modo nocturno para las fotos.',
      'No hace falta telescopio para disfrutar el cambio de color de la Luna.',
    ],
    note: 'La referencia describe el evento como una “Luna de Sangre” por el tono rojizo profundo que toma durante la totalidad.',
    sourceName: 'Visita La Plata',
    sourceUrl: 'https://www.visitalaplata.com.ar/2026/01/calendario-astronomico-2026.html',
  },
  {
    id: 'rosario-luna-rosa-2026',
    title: 'Llega la Luna Rosa y se verá en Rosario',
    city: 'Rosario',
    province: 'Santa Fe',
    date: '2026-04-01T23:12:00-03:00',
    type: 'observacion',
    summary:
      'Este 1 de abril a las 23:12, la luna llena brillará completamente iluminada en el cielo y será visible a simple vista si las condiciones climáticas acompañan. También podrá observarse la noche previa y la siguiente, aunque el momento pico será esa noche.',
    tips: [
      'Elegí lugares con poca luz artificial.',
      'Mirá hacia el este al atardecer.',
      'No necesitás telescopio: con el celular podés sacar buenas fotos.',
    ],
    note:
      'Aunque se la llama “Luna Rosa”, no se verá de ese color, sino blanca o con tonos anaranjados cerca del horizonte.',
    sourceName: 'Contenido editorial del proyecto',
  },
  {
    id: 'la-plata-liridas-2026',
    title: 'Noche de Líridas para mirar meteoros de otoño',
    city: 'La Plata',
    province: 'Buenos Aires',
    date: '2026-04-22T23:30:00-03:00',
    type: 'agenda',
    summary:
      'El calendario de astroturismo de La Plata señala el 22 de abril como fecha de observación de las Líridas, una lluvia moderada que suele verse mejor con cielos oscuros y poca contaminación lumínica.',
    tips: [
      'Alejate algunos kilómetros del centro urbano para mejorar el contraste.',
      'Dale al menos 20 minutos a tus ojos para adaptarse a la oscuridad.',
      'Mirar a simple vista suele ser más efectivo que usar telescopio.',
    ],
    note: 'Desde la región del Gran La Plata recomiendan playas, zonas rurales o localidades con menos luz artificial.',
    sourceName: 'Visita La Plata',
    sourceUrl: 'https://www.visitalaplata.com.ar/2026/01/calendario-astronomico-2026.html',
  },
  {
    id: 'la-plata-eta-acuaridas-2026',
    title: 'Madrugada de Eta Acuáridas en Buenos Aires',
    city: 'La Plata',
    province: 'Buenos Aires',
    date: '2026-05-06T04:30:00-03:00',
    type: 'observacion',
    summary:
      'Visita La Plata destaca las Eta Acuáridas del 5 y 6 de mayo como la lluvia de estrellas más importante para la región, con hasta 50 meteoros por hora en buenas condiciones.',
    tips: [
      'La mejor ventana es la madrugada, antes del amanecer.',
      'Elegí un sitio oscuro y con horizonte amplio.',
      'Llevá mate, abrigo y paciencia: la observación mejora con permanencia.',
    ],
    note: 'Son restos del cometa Halley y suelen regalar varias trazas seguidas si el cielo acompaña.',
    sourceName: 'Visita La Plata',
    sourceUrl: 'https://www.visitalaplata.com.ar/2026/01/calendario-astronomico-2026.html',
  },
  {
    id: 'la-plata-eclipse-parcial-luna-2026',
    title: 'Eclipse parcial de Luna para seguir de madrugada',
    city: 'La Plata',
    province: 'Buenos Aires',
    date: '2026-08-27T23:33:00-03:00',
    type: 'observacion',
    summary:
      'Para fines de agosto, el calendario astronómico regional marca un eclipse parcial de Luna cuyo clímax llega en la madrugada del 28, casi en simultáneo con la Luna llena máxima.',
    tips: [
      'Prepará una salida larga: el fenómeno empieza cerca de medianoche y sigue de madrugada.',
      'Un trípode ayuda mucho si querés registrar el avance del eclipse.',
      'Chequeá nubosidad y fase de la noche para elegir mejor el lugar.',
    ],
    note: 'La referencia indica que el clímax cubrirá gran parte del disco lunar y lo teñirá de rojo.',
    sourceName: 'Visita La Plata',
    sourceUrl: 'https://www.visitalaplata.com.ar/2026/01/calendario-astronomico-2026.html',
  },
  {
    id: 'la-plata-geminidas-2026',
    title: 'Gemínidas: la gran lluvia del año para Argentina',
    city: 'La Plata',
    province: 'Buenos Aires',
    date: '2026-12-13T23:30:00-03:00',
    type: 'observacion',
    summary:
      'En diciembre, la agenda astronómica de La Plata recomienda observar las Gemínidas, consideradas entre las mejores lluvias del año para Argentina y con potencial de hasta 120 meteoros por hora en cielos oscuros.',
    tips: [
      'Si podés, salí hacia Magdalena, Chascomús u otra zona con cielo oscuro.',
      'Acostarte o reclinarte ayuda a abarcar más cielo.',
      'No uses flash ni pantallas fuertes para conservar la adaptación visual.',
    ],
    note: 'La fuente la destaca como una de las experiencias astronómicas más rendidoras del calendario anual.',
    sourceName: 'Visita La Plata',
    sourceUrl: 'https://www.visitalaplata.com.ar/2026/01/calendario-astronomico-2026.html',
  },
];

export function filterMoonActivities(params: {
  city?: string;
  month?: number;
  year?: number;
}): MoonActivity[] {
  const { city = '', month, year } = params;
  const normalizedCity = city.trim().toLowerCase();

  return moonActivities.filter((activity) => {
    const activityDate = new Date(activity.date);

    const matchesCity = !normalizedCity
      || activity.city.toLowerCase().includes(normalizedCity)
      || activity.province.toLowerCase().includes(normalizedCity);
    const matchesMonth = month === undefined || activityDate.getMonth() === month;
    const matchesYear = year === undefined || activityDate.getFullYear() === year;

    return matchesCity && matchesMonth && matchesYear;
  });
}

export function getCityOptions(params: { month?: number; year?: number }): string[] {
  const filtered = filterMoonActivities(params);
  return Array.from(new Set(filtered.map((activity) => activity.city))).sort((a, b) =>
    a.localeCompare(b, 'es'),
  );
}

export function formatActivityDate(date: string): string {
  return format(new Date(date), "d 'de' MMMM · HH:mm", { locale: es });
}
