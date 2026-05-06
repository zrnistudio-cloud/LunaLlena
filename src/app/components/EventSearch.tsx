import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface EventSearchProps {
  onSearch: (province: string) => void;
  onMonthChange: (date: Date) => void;
  searchLocation?: string;
  selectedDate: Date;
  phaseName: string;
  cityOptions: string[];
  compact?: boolean;
  themeMode?: 'sunset' | 'moon';
}

export function EventSearch({
  onSearch,
  onMonthChange,
  searchLocation,
  selectedDate,
  cityOptions,
  compact = false,
  themeMode = 'sunset',
}: EventSearchProps) {
  const isSunset = themeMode === 'sunset';

  const changeMonth = (offset: number) => {
    const nextDate = new Date(selectedDate);
    nextDate.setMonth(selectedDate.getMonth() + offset, 1);
    nextDate.setHours(12, 0, 0, 0);
    onMonthChange(nextDate);
  };

  return (
    <div
      className={`w-full mx-auto ${
        compact
          ? isSunset
            ? 'mb-8 rounded-[1.5rem] border border-[#ead6e6] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,239,248,0.96))] px-3 py-3 shadow-[0_18px_35px_rgba(22,10,24,0.08)] backdrop-blur-xl'
            : 'mb-8 rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(18,12,27,0.32))] px-3 py-3 shadow-[0_18px_35px_rgba(7,3,14,0.20)] backdrop-blur-xl'
          : 'mb-12'
      }`}
    >
      <div className={`grid grid-cols-1 ${compact ? 'gap-4' : 'gap-8 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.95fr)] xl:items-start'}`}>
        {!compact && (
          <div className="text-left">
            <h3 className="text-[2.6rem] md:text-[3.2rem] font-display text-black mb-4 uppercase leading-[0.95] tracking-tight">
              Eventos bajo la Luna
            </h3>
            <p className="max-w-2xl text-black/78 text-[15px] md:text-[1.02rem] mb-3">
              Elegi un mes y, si hay actividades cargadas, vas a poder filtrar por ciudad.
            </p>
          </div>
        )}

        <div className={`${compact ? 'flex flex-row items-center gap-3 w-full max-w-none' : 'flex flex-col gap-4 xl:justify-self-start xl:w-full xl:max-w-[360px]'}`}>
          <div
            className={`${compact ? 'flex-1 min-w-0 h-[56px]' : 'w-full h-[68px]'} flex items-center gap-3 rounded-2xl border px-3 py-2 transition-all duration-300 ${
              isSunset ? 'border-[#e9cfe4] bg-[#f4dff1]' : 'border-white/10 bg-white/[0.06]'
            }`}
          >
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              aria-label="Mes anterior"
              className={`${compact ? 'w-9 h-9' : 'w-12 h-12'} shrink-0 rounded-full border flex items-center justify-center transition-all duration-300 ${
                isSunset
                  ? 'border-[#e6d6e3] bg-white text-black hover:bg-[#f8edf6]'
                  : 'border-white/12 bg-white/10 text-white hover:bg-white/16'
              }`}
            >
              <ChevronLeft className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
            </button>

            <div className="flex-1 text-center min-w-0">
              <p
                className={`${compact ? 'text-[1rem]' : 'text-[1.35rem]'} leading-none font-medium capitalize truncate ${
                  isSunset ? 'text-black' : 'text-white'
                }`}
              >
                {format(selectedDate, 'MMMM yyyy', { locale: es })}
              </p>
            </div>

            <button
              type="button"
              onClick={() => changeMonth(1)}
              aria-label="Mes siguiente"
              className={`${compact ? 'w-9 h-9' : 'w-12 h-12'} shrink-0 rounded-full border flex items-center justify-center transition-all duration-300 ${
                isSunset
                  ? 'border-[#e6d6e3] bg-white text-black hover:bg-[#f8edf6]'
                  : 'border-white/12 bg-white/10 text-white hover:bg-white/16'
              }`}
            >
              <ChevronRight className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
            </button>
          </div>

          <div className={`relative ${compact ? 'w-[240px] shrink-0' : 'w-full'}`}>
            <MapPin
              className={`absolute ${compact ? 'left-4 w-4 h-4' : 'left-5 w-5 h-5'} top-1/2 -translate-y-1/2 pointer-events-none ${
                isSunset ? 'text-black/35' : 'text-white/38'
              }`}
            />
            {cityOptions.length > 0 ? (
              <select
                value={searchLocation ?? ''}
                onChange={(e) => onSearch(e.target.value)}
                className={`w-full appearance-none py-4 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-fuchsia-300/25 transition-all duration-300 ${compact ? 'h-[56px] px-11 text-[0.95rem]' : 'h-[68px] px-14 text-[1.05rem]'} ${
                  isSunset
                    ? 'bg-[#f4dff1] border-[#e9cfe4] text-black focus:border-fuchsia-300/40'
                    : 'bg-white/[0.06] border-white/10 text-white focus:border-fuchsia-300/28'
                }`}
              >
                <option value="">Todas las provincias</option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            ) : (
              <div
                className={`w-full ${compact ? 'h-[56px] px-11 text-[0.95rem]' : 'h-[68px] px-14 text-lg'} py-4 backdrop-blur-sm rounded-2xl border flex items-center ${
                  isSunset
                    ? 'bg-[#f4dff1] border-[#e9cfe4] text-black/42'
                    : 'bg-black/35 border-fuchsia-300/10 text-white/40'
                }`}
              >
                No hay provincias con eventos este mes
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
