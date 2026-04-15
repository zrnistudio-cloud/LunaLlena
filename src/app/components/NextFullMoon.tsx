import { motion } from 'motion/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { FullMoonDate } from '@/utils/moonPhases';
import lunaLlenaSvg from '@/assets/fases/Luna llena.svg';

interface NextFullMoonProps {
  fullMoon: FullMoonDate;
}

export function NextFullMoon({ fullMoon }: NextFullMoonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_40%)]" />

      <div className="relative px-6 py-7 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="flex items-center gap-3">
          <img
            src={lunaLlenaSvg}
            alt="Luna llena"
            className="h-10 w-10 object-contain"
          />
          <span className="text-[2rem] font-display text-white uppercase tracking-wider">
            Proxima Luna Llena
          </span>
        </div>

        <div className="md:border-l md:border-white/15 md:pl-6">
          <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-2">Fecha estimada</p>
          <h3 className="text-3xl font-display text-white uppercase leading-tight">
            {format(fullMoon.date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
          </h3>
        </div>

        <div className="md:border-l md:border-white/15 md:pl-6 text-center md:text-left">
          {fullMoon.daysUntil === 0 ? (
            <>
              <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-2">Estado</p>
              <p className="text-5xl font-display text-white uppercase">Es hoy</p>
            </>
          ) : (
            <>
              <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-2">Cuenta regresiva</p>
              <div className="flex items-end gap-3">
                <p className="text-6xl font-display text-white leading-none">{fullMoon.daysUntil}</p>
                <p className="text-gray-400 uppercase tracking-[0.2em] text-xs pb-1">
                  {fullMoon.daysUntil === 1 ? 'dia' : 'dias'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
