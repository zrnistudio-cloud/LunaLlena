const DAILY_QUOTES = [
  'La luna te recuerda que no hace falta estar completa para seguir brillando.',
  'Todo ciclo trae una nueva oportunidad para volver a empezar con más verdad.',
  'Incluso en las noches más oscuras, tu energía sigue trabajando a favor de tus sueños.',
  'Crecer despacio también es crecer; la luna nunca se apura.',
  'Soltar con amor también es una forma de avanzar.',
  'La claridad llega cuando te das permiso para mirar hacia adentro.',
  'Cada día tiene su propia fase: escucha qué te pide hoy tu cuerpo y tu intuición.',
  'La plenitud no siempre hace ruido; a veces se nota en tu calma.',
  'La luna cambia sin dejar de ser ella. Vos también podés transformarte sin perder tu esencia.',
  'Hoy es un buen día para elegirte con más suavidad y menos exigencia.',
  'Lo que sembrás con intención encuentra su momento para crecer.',
  'Descansar también es parte del movimiento.',
  'Tu proceso tiene ritmo propio, y eso también es sabiduría.',
  'Hay belleza en las pausas cuando entendés que también forman parte del camino.',
  'La energía correcta no siempre empuja: a veces ordena, limpia y acomoda.',
];

export function getDailyQuote(date: Date = new Date()): string {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / 86400000);
  return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
}

const PHASE_QUOTES: Record<
  string,
  {
    title: string;
    quote: string;
    intention: string;
  }
> = {
  'Luna Nueva': {
    title: 'Sembrar en silencio',
    quote: 'Hoy no hace falta mostrar resultados: alcanza con honrar aquello que recién empieza a tomar forma.',
    intention: 'Elegí una intención pequeña, concreta y amorosa para abrir este nuevo ciclo.',
  },
  'Luna Creciente': {
    title: 'Mover la energía',
    quote: 'El crecimiento real casi nunca grita; se nota cuando seguís avanzando aunque todavía no se vea completo.',
    intention: 'Dale movimiento a una idea que venís sosteniendo con deseo.',
  },
  'Cuarto Creciente': {
    title: 'Tomar impulso',
    quote: 'Las etapas de tensión también son fértiles: a veces el cambio necesita decisión antes que certeza.',
    intention: 'Hacé una acción concreta que ordene tu rumbo en vez de esperar el momento perfecto.',
  },
  'Luna Gibosa Creciente': {
    title: 'Afilar la visión',
    quote: 'Cuando algo está por florecer, también pide revisión, foco y una escucha más fina de tu energía.',
    intention: 'Ajustá lo necesario para llegar a la plenitud con más verdad y menos ruido.',
  },
  'Luna Llena': {
    title: 'Iluminar lo que ya es',
    quote: 'La plenitud no siempre significa hacer más: a veces significa ver con claridad lo que ya está listo para ser reconocido.',
    intention: 'Agradecé, celebrá y observá qué emoción o verdad quiere mostrarse completa.',
  },
  'Luna Gibosa Menguante': {
    title: 'Bajar la intensidad',
    quote: 'Después del pico llega el momento de integrar, ordenar y quedarte solo con lo que todavía tiene sentido para vos.',
    intention: 'Soltá una exigencia que ya cumplió su función en este tramo.',
  },
  'Cuarto Menguante': {
    title: 'Depurar con conciencia',
    quote: 'No todo cierre es pérdida: muchas veces es una forma elegante de recuperar espacio interno.',
    intention: 'Elegí qué querés dejar atrás para seguir más liviana.',
  },
  'Luna Menguante': {
    title: 'Descansar para renacer',
    quote: 'Cuando la energía baja, no siempre es retroceso: puede ser la pausa exacta que prepara un comienzo más honesto.',
    intention: 'Dale prioridad al descanso, la observación y el cierre amoroso del ciclo.',
  },
};

export function getPhaseDailyGuidance(phaseName: string, date: Date = new Date()) {
  const fallback = {
    title: 'Volver al centro',
    quote: getDailyQuote(date),
    intention: 'Escuchá tu ritmo y elegí una intención simple para hoy.',
  };

  return PHASE_QUOTES[phaseName] ?? fallback;
}
