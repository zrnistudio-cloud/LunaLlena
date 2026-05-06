import { motion } from 'motion/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { FullMoonDate } from '@/utils/moonPhases';
import lunaLlenaSvg from '@/assets/fases/Luna llena.svg';

interface NextFullMoonProps {
  fullMoon: FullMoonDate;
  themeMode?: 'sunset' | 'moon';
}

export function NextFullMoon({ fullMoon, themeMode = 'moon' }: NextFullMoonProps) {
  const isSunset = themeMode === 'sunset';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl ${
        isSunset
          ? 'border-[#efcfdf] bg-[linear-gradient(135deg,rgba(255,250,252,0.96),rgba(251,231,243,0.94)_55%,rgba(255,255,255,0.96))] shadow-[0_24px_50px_rgba(64,24,48,0.10)]'
          : 'border-white/10 bg-white/[0.06]'
      }`}
    >
      <div
        className={`absolute inset-0 ${
          isSunset
            ? 'bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.92),_transparent_42%)]'
            : 'bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_40%)]'
        }`}
      />

      <div className="relative px-6 py-7 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="flex items-center gap-3">
          <img
            src={lunaLlenaSvg}
            alt="Luna llena"
            className="h-10 w-10 object-contain"
          />
          <span
            className={`text-[2rem] font-display uppercase tracking-wider ${
              isSunset ? 'text-[#1f1622]' : 'text-white'
            }`}
          >
            Proxima Luna Llena
          </span>
        </div>

        <div className={`md:border-l md:pl-6 ${isSunset ? 'md:border-[#e8cddd]' : 'md:border-white/15'}`}>
          <p className={`mb-2 text-xs uppercase tracking-[0.2em] ${isSunset ? 'text-[#8f7489]' : 'text-gray-400'}`}>Fecha estimada</p>
          <h3
            className={`text-3xl font-display uppercase leading-tight ${
              isSunset ? 'text-[#1f1622]' : 'text-white'
            }`}
          >
            {format(fullMoon.date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
          </h3>
        </div>

        <div
          className={`text-center md:border-l md:pl-6 md:text-left ${
            isSunset ? 'md:border-[#e8cddd]' : 'md:border-white/15'
          }`}
        >
          {fullMoon.daysUntil === 0 ? (
            <>
              <p className={`mb-2 text-xs uppercase tracking-[0.2em] ${isSunset ? 'text-[#8f7489]' : 'text-gray-400'}`}>Estado</p>
              <p className={`text-5xl font-display uppercase ${isSunset ? 'text-[#1f1622]' : 'text-white'}`}>Es hoy</p>
            </>
          ) : (
            <>
              <p className={`mb-2 text-xs uppercase tracking-[0.2em] ${isSunset ? 'text-[#8f7489]' : 'text-gray-400'}`}>Cuenta regresiva</p>
              <div className="flex items-end gap-3">
                <p className={`text-6xl leading-none font-display ${isSunset ? 'text-[#1f1622]' : 'text-white'}`}>{fullMoon.daysUntil}</p>
                <p className={`pb-1 text-xs uppercase tracking-[0.2em] ${isSunset ? 'text-[#8f7489]' : 'text-gray-400'}`}>
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
