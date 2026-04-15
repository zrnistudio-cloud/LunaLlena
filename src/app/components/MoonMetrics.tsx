import { motion } from 'motion/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { MoonPhase } from '@/utils/moonPhases';

interface MoonMetricsProps {
  phase: MoonPhase;
  date: Date;
}

function formatAngle(illumination: number): string {
  return `${illumination.toFixed(1)}%`;
}

export function MoonMetrics({ phase, date }: MoonMetricsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      className="rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-6 md:p-8"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <p className="text-gray-400 uppercase tracking-[0.24em] text-xs mb-2">Lectura actual</p>
          <h3 className="text-4xl md:text-5xl font-display text-white uppercase">{phase.phaseName}</h3>
        </div>
        <p className="text-gray-300">
          {format(date, "d 'de' MMMM 'de' yyyy", { locale: es })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Iluminacion" value={formatAngle(phase.illumination)} />
        <MetricCard label="Edad lunar" value={`${phase.ageDays.toFixed(1)} dias`} />
        <MetricCard label="Magnitud visual" value={phase.visualMagnitude.toFixed(1)} />
        <MetricCard label="Ciclo" value={phase.waxing ? 'Creciente' : 'Menguante'} />
      </div>
    </motion.section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-gray-400 uppercase tracking-[0.18em] text-[11px] mb-2">{label}</p>
      <p className="text-white text-2xl md:text-3xl font-display">{value}</p>
    </div>
  );
}
