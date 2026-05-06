import { motion } from 'motion/react';
import { CalendarDays, ExternalLink, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { MoonActivity } from '@/utils/moonActivities';
import { formatActivityDate } from '@/utils/moonActivities';

interface EventsSectionProps {
  activities: MoonActivity[];
  searchLocation?: string;
  selectedDate: Date;
  themeMode?: 'sunset' | 'moon';
}

export function EventsSection({ activities, searchLocation, selectedDate, themeMode = 'sunset' }: EventsSectionProps) {
  const isSunset = themeMode === 'sunset';

  if (activities.length === 0) {
    return (
      <div
        className={`rounded-[1.8rem] border border-dashed px-6 py-14 text-center ${
          isSunset ? 'border-[#d8c6d5] bg-white/70' : 'border-white/12 bg-white/[0.05]'
        }`}
      >
        <p className={`text-[1.4rem] uppercase leading-none font-display ${isSunset ? 'text-[#17131a]' : 'text-white'}`}>Todavía no hay agenda cargada para este mes</p>
        <p className={`mx-auto mt-3 max-w-2xl text-sm leading-[1.7] ${isSunset ? 'text-black/58' : 'text-white/60'}`}>
          Proba con otra fecha para ver propuestas vinculadas a la Luna en {format(selectedDate, 'MMMM yyyy', { locale: es })}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {searchLocation && (
        <div className={`rounded-[1.4rem] border px-5 py-4 ${isSunset ? 'border-[#ead6e6] bg-white/80' : 'border-white/10 bg-white/[0.04]'}`}>
          <p className={`leading-relaxed ${isSunset ? 'text-black/75' : 'text-white/72'}`}>
            Mostrando resultados para <span className={`font-medium ${isSunset ? 'text-[#17131a]' : 'text-white'}`}>{searchLocation}</span> dentro de la agenda curada del proyecto.
          </p>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className={`mb-2 text-[11px] uppercase tracking-[0.18em] ${isSunset ? 'text-[#8b6d86]' : 'text-fuchsia-100/56'}`}>Selección editorial</p>
            <h4 className={`text-[2.2rem] font-display uppercase leading-none ${isSunset ? 'text-black' : 'text-white'}`}>Actividades destacadas</h4>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs px-3 py-1 rounded-full border ${isSunset ? 'text-[#72546c] bg-[#f1d8ee] border-[#e6c5e0]' : 'text-fuchsia-100/88 bg-fuchsia-400/10 border-fuchsia-300/18'}`}>
              {activities.length} resultado{activities.length === 1 ? '' : 's'}
            </span>
            <span className={`text-xs px-3 py-1 rounded-full border ${isSunset ? 'text-[#6d656f] bg-white border-[#e5dce4]' : 'text-white/62 bg-white/[0.05] border-white/10'}`}>
              Argentina · agenda lunar
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          {activities.map((activity, index) => (
            <motion.article
              key={activity.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className={`relative overflow-hidden rounded-[1.5rem] border p-7 md:p-8 ${
                isSunset ? 'border-[#d6d1d8] bg-[#efedf1]' : 'border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(20,14,28,0.78))]'
              }`}
            >
              <div className={`absolute inset-0 pointer-events-none ${
                isSunset
                  ? 'bg-[linear-gradient(135deg,rgba(255,255,255,0.42),transparent_38%,rgba(0,0,0,0.02))]'
                  : 'bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_38%,rgba(217,70,239,0.04))]'
              }`} />

              <div className="relative space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`text-xs uppercase tracking-[0.24em] mb-2 ${isSunset ? 'text-[#8a8390]' : 'text-white/42'}`}>Actividad del mes</p>
                    <h5 className={`text-[2.05rem] font-display uppercase leading-[1.08] ${isSunset ? 'text-[#17131a]' : 'text-white'}`}>{activity.title}</h5>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full border uppercase tracking-[0.18em] ${isSunset ? 'text-[#6f5b76] bg-[#e8ddea] border-[#d3c3d7]' : 'text-fuchsia-100/84 bg-fuchsia-500/10 border-fuchsia-300/16'}`}>
                    {activity.type}
                  </span>
                </div>

                <div className={`flex flex-wrap gap-4 text-sm ${isSunset ? 'text-[#625d68]' : 'text-white/66'}`}>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {activity.city}, {activity.province}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    {formatActivityDate(activity.date)}
                  </span>
                </div>

                <p className={`leading-relaxed text-[1.02rem] ${isSunset ? 'text-[#26222b]' : 'text-white/80'}`}>{activity.summary}</p>

                <div className={`rounded-2xl border p-4 ${isSunset ? 'border-[#d5d0d8] bg-[#e4e1e7]' : 'border-white/10 bg-black/18'}`}>
                  <p className={`uppercase tracking-[0.22em] text-[11px] mb-3 ${isSunset ? 'text-[#86808c]' : 'text-white/44'}`}>Tips para verla mejor</p>
                  <div className="space-y-2">
                    {activity.tips.map((tip) => (
                      <p key={tip} className={`text-sm leading-relaxed ${isSunset ? 'text-[#2c2730]' : 'text-white/76'}`}>✨ {tip}</p>
                    ))}
                  </div>
                </div>

                {activity.note && <p className={`text-sm leading-relaxed ${isSunset ? 'text-[#4d4653]' : 'text-white/62'}`}>{activity.note}</p>}

                <div className={`pt-4 border-t flex items-center justify-between gap-4 text-sm ${isSunset ? 'border-[#d1ccd4] text-[#5d5863]' : 'border-white/10 text-white/56'}`}>
                  <span className="truncate">Fuente: {activity.sourceName}</span>
                  {activity.sourceUrl ? (
                    <a
                      href={activity.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-2 transition-colors ${isSunset ? 'text-[#17131a] hover:text-[#5e526c]' : 'text-white hover:text-fuchsia-100/80'}`}
                    >
                      Ver fuente
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <span className={isSunset ? 'text-[#8d8692]' : 'text-white/40'}>Curado internamente</span>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
