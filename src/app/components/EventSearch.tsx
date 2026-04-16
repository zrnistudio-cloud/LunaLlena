import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface EventSearchProps {
  onSearch: (location: string) => void;
  onMonthChange: (date: Date) => void;
  searchLocation?: string;
  selectedDate: Date;
  phaseName: string;
  cityOptions: string[];
  compact?: boolean;
}

export function EventSearch({
  onSearch,
  onMonthChange,
  searchLocation,
  selectedDate,
  cityOptions,
  compact = false,
}: EventSearchProps) {
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
          ? 'mb-8 rounded-[1.5rem] border border-[#ead6e6] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,239,248,0.96))] px-3 py-3 shadow-[0_18px_35px_rgba(22,10,24,0.08)] backdrop-blur-xl'
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
          <div className={`${compact ? 'flex-1 min-w-0 h-[56px]' : 'w-full h-[68px]'} flex items-center gap-3 px-3 py-2 bg-[#f4dff1] border border-[#e9cfe4] rounded-2xl transition-all duration-300`}>
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              aria-label="Mes anterior"
              className={`${compact ? 'w-9 h-9' : 'w-12 h-12'} shrink-0 rounded-full border border-[#e6d6e3] bg-white text-black flex items-center justify-center hover:bg-[#f8edf6] transition-all duration-300`}
            >
              <ChevronLeft className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
            </button>

            <div className="flex-1 text-center min-w-0">
              <p className={`${compact ? 'text-[1rem]' : 'text-[1.35rem]'} text-black leading-none font-medium capitalize truncate`}>
                {format(selectedDate, 'MMMM yyyy', { locale: es })}
              </p>
            </div>

            <button
              type="button"
              onClick={() => changeMonth(1)}
              aria-label="Mes siguiente"
              className={`${compact ? 'w-9 h-9' : 'w-12 h-12'} shrink-0 rounded-full border border-[#e6d6e3] bg-white text-black flex items-center justify-center hover:bg-[#f8edf6] transition-all duration-300`}
            >
              <ChevronRight className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
            </button>
          </div>

          <div className={`relative ${compact ? 'w-[240px] shrink-0' : 'w-full'}`}>
            <MapPin className={`absolute ${compact ? 'left-4 w-4 h-4' : 'left-5 w-5 h-5'} top-1/2 -translate-y-1/2 text-black/35 pointer-events-none`} />
            {cityOptions.length > 0 ? (
              <select
                value={searchLocation ?? ''}
                onChange={(e) => onSearch(e.target.value)}
                className={`w-full ${compact ? 'h-[56px] px-11 text-[0.95rem]' : 'h-[68px] px-14 text-[1.05rem]'} appearance-none py-4 bg-[#f4dff1] border border-[#e9cfe4] rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-fuchsia-300/25 focus:border-fuchsia-300/40 transition-all duration-300`}
              >
                <option value="">Todas las ciudades</option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            ) : (
              <div className={`w-full ${compact ? 'h-[56px] px-11 text-[0.95rem]' : 'h-[68px] px-14 text-lg'} py-4 bg-black/35 backdrop-blur-sm border border-fuchsia-300/10 rounded-2xl text-white/40 flex items-center`}>
                No hay ciudades con eventos este mes
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
