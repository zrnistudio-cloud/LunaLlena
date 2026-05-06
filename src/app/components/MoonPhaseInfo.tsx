import { motion } from 'motion/react';
import { getMoonPhase } from '@/utils/moonPhases';

interface MoonPhaseInfoProps {
  date: Date;
  themeMode?: 'sunset' | 'moon';
}

export function MoonPhaseInfo({ date, themeMode = 'moon' }: MoonPhaseInfoProps) {
  const moonPhase = getMoonPhase(date);
  const isSunset = themeMode === 'sunset';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-5 text-center"
    >
      <h2
        className={`text-6xl leading-none font-display uppercase md:text-7xl ${
          isSunset ? 'text-white' : 'text-white'
        }`}
      >
        {moonPhase.phaseName}
      </h2>

      <p
        className={`mx-auto max-w-2xl text-lg leading-relaxed ${
          isSunset ? 'text-white/88' : 'text-gray-300'
        }`}
      >
        {moonPhase.description}
      </p>
    </motion.div>
  );
}
