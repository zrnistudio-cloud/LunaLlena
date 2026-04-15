import { motion } from 'motion/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getFullMoonName, getMajorPhasesForMonth } from '@/utils/moonPhases';

interface MajorPhasesTimelineProps {
  selectedDate: Date;
}

export function MajorPhasesTimeline({ selectedDate }: MajorPhasesTimelineProps) {
  const phases = getMajorPhasesForMonth(selectedDate.getFullYear(), selectedDate.getMonth());

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2 }}
      className="rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-6 md:p-8"
    >
      <div className="mb-6">
        <p className="text-gray-400 uppercase tracking-[0.2em] text-xs mb-2">Fases principales</p>
        <h3 className="text-3xl md:text-4xl font-display text-white capitalize">
          {format(selectedDate, "MMMM 'de' yyyy", { locale: es })}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {phases.map((phase) => (
          <div key={phase.date.toISOString()} className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-gray-400 text-xs uppercase tracking-[0.18em] mb-2">{phase.name}</p>
            <p className="text-white text-2xl font-display mb-2">
              {format(phase.date, "d 'de' MMM", { locale: es })}
            </p>
            <p className="text-gray-300 text-sm">{format(phase.date, 'HH:mm')}</p>
            {phase.quarter === 2 && (
              <p className="text-sky-200 text-sm mt-3">{getFullMoonName(phase.date)}</p>
            )}
          </div>
        ))}
      </div>
    </motion.section>
  );
}
