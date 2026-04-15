import { CalendarDays } from 'lucide-react';
import { useState } from 'react';
import type { CSSProperties } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import svgLogo from "../../imports/en_luna_llena-03-2.svg";
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface HeaderProps {
  date: Date;
  mode: 'sunset' | 'moon';
  onModeChange: (mode: 'sunset' | 'moon') => void;
  onDateChange: (date: Date) => void;
}

function SunsetIcon({ active }: { active: boolean }) {
  const stroke = active ? 'var(--tab-active-fg)' : 'currentColor';

  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
      <path stroke={stroke} d="M7.13,19.18v-.56c0-2.69,2.18-4.87,4.87-4.87s4.87,2.18,4.87,4.87v.56" />
      <line stroke={stroke} x1="19.54" y1="18.62" x2="22.31" y2="18.62" />
      <line stroke={stroke} x1="1.69" y1="18.62" x2="4.46" y2="18.62" />
      <line stroke={stroke} x1="17.33" y1="13.28" x2="19.29" y2="11.32" />
      <line stroke={stroke} x1="4.71" y1="11.32" x2="6.67" y2="13.28" />
      <line stroke={stroke} x1="12" y1="2.74" x2="12" y2="9.57" />
      <polyline stroke={stroke} points="14.8 7.37 12 10.17 9.2 7.37" />
    </svg>
  );
}

function MoonIcon({ active }: { active: boolean }) {
  const stroke = active ? 'var(--tab-active-fg)' : 'currentColor';

  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
      <path stroke={stroke} d="M16.32,16.04c-4.62,0-8.36-3.74-8.36-8.36,0-1.3.31-2.52.83-3.62-2.8,1.35-4.74,4.21-4.74,7.52,0,4.62,3.74,8.36,8.36,8.36,3.32,0,6.17-1.94,7.52-4.74-1.1.53-2.32.83-3.62.83Z" />
    </svg>
  );
}

export function Header({ date, mode, onModeChange, onDateChange }: HeaderProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleDateSelect = (nextDate?: Date) => {
    if (!nextDate) return;
    nextDate.setHours(12, 0, 0, 0);
    onDateChange(nextDate);
    setCalendarOpen(false);
  };

  return (
    <header className="relative z-30 w-full max-w-7xl mx-auto px-6 pt-8 pb-2">
      <div className="flex items-center justify-between gap-6">
        <img
          src={svgLogo}
          alt="en Luna Llena"
          className="w-full max-w-[220px] md:max-w-[280px]"
          style={{
            filter:
              "brightness(0) saturate(100%) invert(44%) sepia(94%) saturate(4788%) hue-rotate(299deg) brightness(98%) contrast(102%)",
          }}
        />

        <div className="relative z-30 flex items-center gap-3">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="relative flex shrink-0 items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 backdrop-blur-md cursor-pointer hover:bg-white/[0.07] transition-colors duration-300"
              >
                <CalendarDays className="w-5 h-5 text-gray-300" />
                <p className="text-white text-sm md:text-lg font-light tracking-wide">
                  {format(date, "EEEE dd 'de' MMMM yyyy", { locale: es })}
                </p>
              </button>
            </PopoverTrigger>

            <PopoverContent
              side="bottom"
              align="end"
              sideOffset={12}
              className="w-auto rounded-3xl border border-white/10 bg-[#f6f3ef] p-4 shadow-[0_22px_60px_rgba(5,8,24,0.35)]"
            >
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                locale={es}
                className="rounded-2xl bg-transparent p-0"
              />
            </PopoverContent>
          </Popover>

          <div
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-2 backdrop-blur-md"
            style={
              {
                '--tab-active-fg': '#081121',
              } as CSSProperties
            }
          >
            <button
              type="button"
              aria-label="Atardecer"
              aria-pressed={mode === 'sunset'}
              onClick={() => onModeChange('sunset')}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${
                mode === 'sunset'
                  ? 'border-white/80 bg-white text-[#081121] shadow-[0_8px_22px_rgba(255,255,255,0.18)]'
                  : 'border-transparent bg-transparent text-white/82 hover:border-white/10 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              <SunsetIcon active={mode === 'sunset'} />
            </button>

            <button
              type="button"
              aria-label="Noche"
              aria-pressed={mode === 'moon'}
              onClick={() => onModeChange('moon')}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${
                mode === 'moon'
                  ? 'border-white/80 bg-white text-[#081121] shadow-[0_8px_22px_rgba(255,255,255,0.18)]'
                  : 'border-transparent bg-transparent text-white/82 hover:border-white/10 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              <MoonIcon active={mode === 'moon'} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
