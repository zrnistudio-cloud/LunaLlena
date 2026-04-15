import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMoonPhase } from '@/utils/moonPhases';
import gibosaCrecienteSvg from '@/assets/fases/Gibosa creciente.svg';
import lunaCrecienteSvg from '@/assets/fases/Luna creciente de cera.svg';
import gibosaMenguanteSvg from '@/assets/fases/Luna gibosa menguante.svg';
import lunaLlenaSvg from '@/assets/fases/Luna llena.svg';
import lunaMenguanteSvg from '@/assets/fases/Luna menguante.svg';
import lunaNuevaSvg from '@/assets/fases/luna nueva.svg';
import primerTrimestreSvg from '@/assets/fases/Primer trimestre.svg';
import ultimoTrimestreSvg from '@/assets/fases/Ultimo trimestre.svg';

interface MoonParticleAnimationProps {
  date: Date;
  onDateChange: (date: Date) => void;
  mode: SkyTab;
}

type SkyTab = 'sunset' | 'moon';

const phaseSequence = [
  'Luna Nueva',
  'Luna Creciente',
  'Cuarto Creciente',
  'Luna Gibosa Creciente',
  'Luna Llena',
  'Luna Gibosa Menguante',
  'Cuarto Menguante',
  'Luna Menguante',
] as const;

const phaseAssetMap: Record<(typeof phaseSequence)[number], string> = {
  'Luna Nueva': lunaNuevaSvg,
  'Luna Creciente': lunaCrecienteSvg,
  'Cuarto Creciente': primerTrimestreSvg,
  'Luna Gibosa Creciente': gibosaCrecienteSvg,
  'Luna Llena': lunaLlenaSvg,
  'Luna Gibosa Menguante': gibosaMenguanteSvg,
  'Cuarto Menguante': ultimoTrimestreSvg,
  'Luna Menguante': lunaMenguanteSvg,
};

const INTRO_STEP_MS = 960;
const INTRO_SETTLE_MS = 220;

export function MoonParticleAnimation({ date, onDateChange, mode }: MoonParticleAnimationProps) {
  const isSunset = mode === 'sunset';
  const moonPhase = getMoonPhase(date);
  const [displayPhase, setDisplayPhase] = useState<string>(moonPhase.phaseName);
  const [isIntroPlaying, setIsIntroPlaying] = useState(true);
  const moonImage = phaseAssetMap[(displayPhase in phaseAssetMap ? displayPhase : moonPhase.phaseName) as keyof typeof phaseAssetMap] ?? lunaLlenaSvg;
  const isNewMoon = displayPhase === 'Luna Nueva';

  useEffect(() => {
    let timeoutId: number | undefined;
    let intervalId: number | undefined;
    let index = 0;

    setIsIntroPlaying(true);
    setDisplayPhase(phaseSequence[0]);

    intervalId = window.setInterval(() => {
      index += 1;

      if (index >= phaseSequence.length) {
        if (intervalId) window.clearInterval(intervalId);
        setDisplayPhase(moonPhase.phaseName);
        timeoutId = window.setTimeout(() => {
          setIsIntroPlaying(false);
        }, INTRO_SETTLE_MS);
        return;
      }

      setDisplayPhase(phaseSequence[index]);
    }, INTRO_STEP_MS);

    return () => {
      if (intervalId) window.clearInterval(intervalId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!isIntroPlaying) {
      setDisplayPhase(moonPhase.phaseName);
    }
  }, [isIntroPlaying, moonPhase.phaseName]);

  const moveDay = (offset: number) => {
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + offset);
    nextDate.setHours(12, 0, 0, 0);
    onDateChange(nextDate);
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-[68%] z-[1] h-40 w-[min(76vw,40rem)] -translate-x-1/2 rounded-full blur-3xl"
        animate={{
          opacity: isSunset ? 0.95 : 0.18,
          background: isSunset
            ? 'radial-gradient(circle, rgba(255,214,153,0.72) 0%, rgba(255,153,102,0.4) 35%, rgba(255,153,102,0) 74%)'
            : 'radial-gradient(circle, rgba(124,147,255,0.18) 0%, rgba(124,147,255,0) 72%)',
        }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />

      {Array.from({ length: 22 }).map((_, index) => {
        const size = 2 + (index % 3);
        const left = 8 + ((index * 13) % 84) + '%';
        const top = 8 + ((index * 19) % 78) + '%';

        return (
          <motion.span
            key={index}
            className="absolute rounded-full bg-white/60"
            style={{ width: size, height: size, left, top }}
            animate={{
              opacity: isSunset ? [0.02, 0.18, 0.02] : [0.2, 0.8, 0.2],
              scale: [1, 1.35, 1],
            }}
            transition={{ duration: 3 + (index % 4), repeat: Infinity, delay: index * 0.1 }}
          />
        );
      })}

      <button
        type="button"
        onClick={() => moveDay(-1)}
        aria-label="Día anterior"
        className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full border border-white/15 bg-white/[0.05] text-white flex items-center justify-center hover:bg-white/[0.14] transition-all duration-300"
      >
        <ChevronLeft className="w-7 h-7" />
      </button>

      <button
        type="button"
        onClick={() => moveDay(1)}
        aria-label="Día siguiente"
        className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full border border-white/15 bg-white/[0.05] text-white flex items-center justify-center hover:bg-white/[0.14] transition-all duration-300"
      >
        <ChevronRight className="w-7 h-7" />
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="absolute left-1/2 top-1/2 z-[2] w-[min(82vw,34rem)] aspect-[640/613] -translate-x-1/2 -translate-y-[52%] pointer-events-none"
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            filter: isSunset
              ? 'drop-shadow(0 28px 70px rgba(255,183,120,0.22)) saturate(0.96) hue-rotate(-10deg)'
              : 'drop-shadow(0 24px 60px rgba(210,220,255,0.18))',
          }}
        >
          <AnimatePresence mode="sync">
            <motion.img
              key={displayPhase}
              src={moonImage}
              alt={`Luna en fase ${displayPhase}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: isNewMoon ? 0.5 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
              className="absolute inset-0 block h-full w-full object-contain"
            />
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
