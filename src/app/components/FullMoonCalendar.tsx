import { motion, AnimatePresence } from 'motion/react';
import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Moon } from 'lucide-react';
import { getFullMoonsForYear } from '@/utils/moonPhases';

interface FullMoonCalendarProps {
  currentDate: Date;
}

export function FullMoonCalendar({ currentDate }: FullMoonCalendarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentYear = currentDate.getFullYear();
  const fullMoonDays = useMemo(
    () => getFullMoonsForYear(currentYear, currentDate),
    [currentYear, currentDate],
  );

  return (
    <div className="w-full mx-auto">
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-5 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 group"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-3">
          <Moon className="w-4 h-4 text-gray-300" />
          <span className="text-sm text-white font-medium">Ver Lunas Llenas del Año</span>
          <span className="text-xs text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">
            {fullMoonDays.length}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-300 group-hover:-translate-y-0.5 transition-transform" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-300 group-hover:translate-y-0.5 transition-transform" />
        )}
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-center mb-3">
                <p className="text-xs text-gray-400">Lunas Llenas {currentYear}</p>
              </div>

              <div className="relative -mx-2 px-2">
                <div
                  className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #1F2937' }}
                >
                  {fullMoonDays.map((fullMoon, index) => (
                    <motion.div
                      key={fullMoon.date.toISOString()}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className={`flex-shrink-0 w-24 p-3 rounded-lg text-center transition-all duration-300 ${
                        fullMoon.isToday ? 'bg-white text-black ring-2 ring-white/50' : 'bg-white/20 hover:bg-white/30'
                      }`}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      <div className="flex justify-center mb-2">
                        <motion.div
                          className={`w-6 h-6 rounded-full ${fullMoon.isToday ? 'bg-black' : 'bg-white'}`}
                          animate={
                            fullMoon.isToday
                              ? {
                                  boxShadow: [
                                    '0 0 8px rgba(255,255,255,0.5)',
                                    '0 0 16px rgba(255,255,255,0.8)',
                                    '0 0 8px rgba(255,255,255,0.5)',
                                  ],
                                }
                              : {}
                          }
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      </div>

                      <div className={`text-xs font-medium mb-1 capitalize ${fullMoon.isToday ? 'text-black' : 'text-gray-300'}`}>
                        {fullMoon.monthName}
                      </div>
                      <div className={`text-2xl font-bold ${fullMoon.isToday ? 'text-black' : 'text-white'}`}>
                        {fullMoon.day}
                      </div>

                      {fullMoon.isToday && (
                        <div className="mt-2 text-[9px] bg-black/20 px-2 py-0.5 rounded-full text-black">HOY</div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/20 text-center">
                <span className="text-[10px] text-gray-400">← Desliza para ver más →</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
