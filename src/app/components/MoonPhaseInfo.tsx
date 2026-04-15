import { motion } from 'motion/react';
import { getMoonPhase } from '@/utils/moonPhases';

interface MoonPhaseInfoProps {
  date: Date;
}

export function MoonPhaseInfo({ date }: MoonPhaseInfoProps) {
  const moonPhase = getMoonPhase(date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center space-y-5"
    >
      <h2 className="text-6xl md:text-7xl font-display text-white uppercase leading-none">
        {moonPhase.phaseName}
      </h2>

      <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed text-lg">
        {moonPhase.description}
      </p>
    </motion.div>
  );
}
