import { motion, AnimatePresence } from 'motion/react';
import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Moon } from 'lucide-react';
import { getFullMoonsForYear } from '@/utils/moonPhases';

interface FullMoonCalendarProps {
  currentDate: Date;
  themeMode?: 'sunset' | 'moon';
}

export function FullMoonCalendar({ currentDate, themeMode = 'moon' }: FullMoonCalendarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isSunset = themeMode === 'sunset';
  const currentYear = currentDate.getFullYear();
  const fullMoonDays = useMemo(
    () => getFullMoonsForYear(currentYear, currentDate),
    [currentYear, currentDate],
  );

  return (
    <div className="w-full mx-auto">
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`group flex w-full items-center justify-between rounded-xl border px-5 py-3 backdrop-blur-sm transition-all duration-300 ${
          isSunset
            ? 'border-[#efcfdf] bg-white/85 hover:bg-[#fff3fa]'
            : 'border-white/20 bg-white/10 hover:bg-white/15'
        }`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-3">
          <Moon className={`h-4 w-4 ${isSunset ? 'text-[#7e5d77]' : 'text-gray-300'}`} />
          <span className={`text-sm font-medium ${isSunset ? 'text-[#1f1622]' : 'text-white'}`}>Ver Lunas Llenas del Año</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              isSunset ? 'bg-[#f6dcea] text-[#8f7489]' : 'bg-white/10 text-gray-400'
            }`}
          >
            {fullMoonDays.length}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className={`h-4 w-4 transition-transform group-hover:-translate-y-0.5 ${isSunset ? 'text-[#7e5d77]' : 'text-gray-300'}`} />
        ) : (
          <ChevronDown className={`h-4 w-4 transition-transform group-hover:translate-y-0.5 ${isSunset ? 'text-[#7e5d77]' : 'text-gray-300'}`} />
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
            <div
              className={`mt-4 rounded-xl border p-4 backdrop-blur-sm ${
                isSunset ? 'border-[#efcfdf] bg-white/88' : 'border-white/20 bg-white/10'
              }`}
            >
              <div className="text-center mb-3">
                <p className={`text-xs ${isSunset ? 'text-[#8f7489]' : 'text-gray-400'}`}>Lunas Llenas {currentYear}</p>
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
                      className={`w-24 flex-shrink-0 rounded-lg p-3 text-center transition-all duration-300 ${
                        fullMoon.isToday
                          ? isSunset
                            ? 'bg-[#251320] text-white ring-2 ring-fuchsia-300/40'
                            : 'bg-white text-black ring-2 ring-white/50'
                          : isSunset
                            ? 'border border-[#f0d8e7] bg-[#fff6fb] hover:bg-[#fdebf6]'
                            : 'bg-white/20 hover:bg-white/30'
                      }`}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      <div className="flex justify-center mb-2">
                        <motion.div
                          className={`h-6 w-6 rounded-full ${
                            fullMoon.isToday
                              ? isSunset
                                ? 'bg-white'
                                : 'bg-black'
                              : isSunset
                                ? 'bg-[#1f1622]'
                                : 'bg-white'
                          }`}
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

                      <div
                        className={`mb-1 text-xs font-medium capitalize ${
                          fullMoon.isToday ? (isSunset ? 'text-white/82' : 'text-black') : isSunset ? 'text-[#8f7489]' : 'text-gray-300'
                        }`}
                      >
                        {fullMoon.monthName}
                      </div>
                      <div
                        className={`text-2xl font-bold ${
                          fullMoon.isToday ? (isSunset ? 'text-white' : 'text-black') : isSunset ? 'text-[#1f1622]' : 'text-white'
                        }`}
                      >
                        {fullMoon.day}
                      </div>

                      {fullMoon.isToday && (
                        <div
                          className={`mt-2 rounded-full px-2 py-0.5 text-[9px] ${
                            isSunset ? 'bg-white/16 text-white' : 'bg-black/20 text-black'
                          }`}
                        >
                          HOY
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className={`mt-3 border-t pt-3 text-center ${isSunset ? 'border-[#efcfdf]' : 'border-white/20'}`}>
                <span className={`text-[10px] ${isSunset ? 'text-[#8f7489]' : 'text-gray-400'}`}>← Desliza para ver más →</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
