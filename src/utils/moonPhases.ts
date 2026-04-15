import { Illumination, MoonPhase as getAstronomyMoonPhase, NextMoonQuarter, SearchMoonQuarter } from 'astronomy-engine';

export interface MoonPhase {
  phase: string;
  phaseName: string;
  illumination: number;
  description: string;
  phaseAngle: number;
  phaseFraction: number;
  waxing: boolean;
  ageDays: number;
  visualMagnitude: number;
}

export interface FullMoonDate {
  date: Date;
  daysUntil: number;
}

export interface FullMoonEntry {
  date: Date;
  day: number;
  month: number;
  monthName: string;
  isToday: boolean;
}

export interface MajorPhaseEntry {
  quarter: number;
  name: string;
  date: Date;
}

export interface MoonCalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isSelected: boolean;
  phaseName: string;
  illumination: number;
  phaseFraction: number;
}

const SYNODIC_MONTH = 29.530588;

function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

export function getMoonPhase(date: Date): MoonPhase {
  const phaseAngle = normalizeAngle(getAstronomyMoonPhase(date));
  const illuminationData = Illumination('Moon', date);
  const illumination = illuminationData.phase_fraction * 100;
  const waxing = phaseAngle <= 180;
  const ageDays = (phaseAngle / 360) * SYNODIC_MONTH;

  let phaseName: string;
  let description: string;

  if (phaseAngle < 22.5 || phaseAngle >= 337.5) {
    phaseName = 'Luna Nueva';
    description = 'Momento de pausa, siembra de intenciones y nuevos comienzos.';
  } else if (phaseAngle < 67.5) {
    phaseName = 'Luna Creciente';
    description = 'Energía ideal para avanzar, ganar impulso y abrir posibilidades.';
  } else if (phaseAngle < 112.5) {
    phaseName = 'Cuarto Creciente';
    description = 'Etapa de decisiones, foco y movimiento frente a los desafíos.';
  } else if (phaseAngle < 157.5) {
    phaseName = 'Luna Gibosa Creciente';
    description = 'Tiempo de ajustar detalles y preparar la expansión total.';
  } else if (phaseAngle < 202.5) {
    phaseName = 'Luna Llena';
    description = 'Pico de claridad, intensidad emocional y celebración de lo logrado.';
  } else if (phaseAngle < 247.5) {
    phaseName = 'Luna Gibosa Menguante';
    description = 'Fase para compartir aprendizajes, agradecer y redistribuir energía.';
  } else if (phaseAngle < 292.5) {
    phaseName = 'Cuarto Menguante';
    description = 'Etapa de depuración, cierre y desapego de lo que ya cumplió su ciclo.';
  } else {
    phaseName = 'Luna Menguante';
    description = 'Invita al descanso, la introspección y la renovación serena.';
  }

  return {
    phase: (phaseAngle / 360).toFixed(3),
    phaseName,
    illumination,
    description,
    phaseAngle,
    phaseFraction: phaseAngle / 360,
    waxing,
    ageDays,
    visualMagnitude: illuminationData.mag,
  };
}

export function getNextFullMoon(fromDate: Date = new Date()): FullMoonDate {
  let quarter = SearchMoonQuarter(fromDate);

  while (quarter.quarter !== 2) {
    quarter = NextMoonQuarter(quarter);
  }

  const fullMoonDate = quarter.time.date;
  const daysUntil = Math.max(
    0,
    Math.ceil((fullMoonDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)),
  );

  return {
    date: fullMoonDate,
    daysUntil,
  };
}

export function getFullMoonsForYear(year: number, today: Date = new Date()): FullMoonEntry[] {
  const entries: FullMoonEntry[] = [];
  let quarter = SearchMoonQuarter(new Date(year, 0, 1, 0, 0, 0));

  while (quarter.time.date.getFullYear() <= year + 1) {
    if (quarter.quarter === 2 && quarter.time.date.getFullYear() === year) {
      const date = quarter.time.date;
      entries.push({
        date,
        day: date.getDate(),
        month: date.getMonth(),
        monthName: date.toLocaleDateString('es-AR', { month: 'long' }),
        isToday: date.toDateString() === today.toDateString(),
      });
    }

    quarter = NextMoonQuarter(quarter);
  }

  return entries;
}

export function getMoonPhasePercentage(date: Date): number {
  return getMoonPhase(date).phaseFraction;
}

const QUARTER_NAMES: Record<number, string> = {
  0: 'Luna Nueva',
  1: 'Cuarto Creciente',
  2: 'Luna Llena',
  3: 'Cuarto Menguante',
};

export function getMajorPhasesForMonth(year: number, month: number): MajorPhaseEntry[] {
  const start = new Date(year, month, 1, 0, 0, 0);
  const end = new Date(year, month + 1, 0, 23, 59, 59);
  const entries: MajorPhaseEntry[] = [];
  let quarter = SearchMoonQuarter(new Date(year, month, 1, 0, 0, 0));

  while (quarter.time.date <= end) {
    if (quarter.time.date >= start) {
      entries.push({
        quarter: quarter.quarter,
        name: QUARTER_NAMES[quarter.quarter],
        date: quarter.time.date,
      });
    }

    quarter = NextMoonQuarter(quarter);
  }

  return entries.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function getMoonCalendarForMonth(selectedDate: Date): MoonCalendarDay[] {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const calendarStart = new Date(year, month, 1 - startWeekday);
  const days: MoonCalendarDay[] = [];

  for (let i = 0; i < 42; i++) {
    const date = new Date(calendarStart);
    date.setDate(calendarStart.getDate() + i);
    const phase = getMoonPhase(date);

    days.push({
      date,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isSelected: date.toDateString() === selectedDate.toDateString(),
      phaseName: phase.phaseName,
      illumination: phase.illumination,
      phaseFraction: phase.phaseFraction,
    });
  }

  return days;
}

export function getFullMoonName(date: Date): string {
  const names = [
    'Luna del Lobo',
    'Luna de Nieve',
    'Luna del Gusano',
    'Luna Rosa',
    'Luna de las Flores',
    'Luna de Fresa',
    'Luna del Ciervo',
    'Luna del Esturion',
    'Luna del Maiz',
    'Luna del Cazador',
    'Luna del Castor',
    'Luna Fria',
  ];

  return names[date.getMonth()];
}
