import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getMoonCalendarForMonth } from '@/utils/moonPhases';

interface MonthlyMoonCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const WEEKDAYS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

export function MonthlyMoonCalendar({ selectedDate, onDateChange }: MonthlyMoonCalendarProps) {
  const days = getMoonCalendarForMonth(selectedDate);

  const goToMonth = (offset: number) => {
    const nextDate = new Date(selectedDate);
    nextDate.setMonth(selectedDate.getMonth() + offset, 1);
    onDateChange(nextDate);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15 }}
      className="rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-6 md:p-8"
    >
      <div className="flex items-center justify-between gap-4 mb-5">
        <button
          onClick={() => goToMonth(-1)}
          className="w-11 h-11 rounded-full border border-white/15 bg-white/10 text-white flex items-center justify-center hover:bg-white/15 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <p className="text-gray-400 uppercase tracking-[0.2em] text-xs mb-2">Calendario lunar</p>
          <h3 className="text-3xl md:text-4xl font-display text-white capitalize">
            {format(selectedDate, 'MMMM yyyy', { locale: es })}
          </h3>
        </div>

        <button
          onClick={() => goToMonth(1)}
          className="w-11 h-11 rounded-full border border-white/15 bg-white/10 text-white flex items-center justify-center hover:bg-white/15 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-gray-400 text-xs uppercase tracking-[0.18em] mb-2">
        {WEEKDAYS.map((weekday) => (
          <div key={weekday} className="py-2">{weekday}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const glow = Math.max(0.18, day.illumination / 100);
          return (
            <button
              key={day.date.toISOString()}
              onClick={() => onDateChange(day.date)}
              className={`rounded-2xl p-2 md:p-3 min-h-[84px] border transition-all text-left ${
                day.isSelected
                  ? 'border-white/50 bg-white/18'
                  : day.isCurrentMonth
                    ? 'border-white/10 bg-white/[0.05] hover:bg-white/[0.09]'
                    : 'border-white/5 bg-white/[0.02] text-gray-500'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm ${day.isCurrentMonth ? 'text-white' : 'text-gray-500'}`}>{day.day}</span>
                <span
                  className="w-3.5 h-3.5 rounded-full"
                  style={{
                    background: `radial-gradient(circle, rgba(255,255,255,${glow}) 0%, rgba(255,255,255,0.95) 60%, rgba(160,160,160,0.6) 100%)`,
                  }}
                />
              </div>
              <p className={`text-[11px] leading-snug ${day.isCurrentMonth ? 'text-gray-300' : 'text-gray-500'}`}>
                {day.phaseName}
              </p>
            </button>
          );
        })}
      </div>
    </motion.section>
  );
}
