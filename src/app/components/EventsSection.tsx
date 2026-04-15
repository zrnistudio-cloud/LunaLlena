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
}

export function EventsSection({ activities, searchLocation, selectedDate }: EventsSectionProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-fuchsia-300/20 rounded-3xl bg-black/25">
        <p className="text-black text-lg">Todavia no hay eventos, actividades o anuncios cargados para este mes.</p>
        <p className="text-black/55 text-sm mt-2">
          Proba con otra fecha para ver propuestas vinculadas a la Luna en {format(selectedDate, 'MMMM yyyy', { locale: es })}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {searchLocation && (
        <div className="max-w-3xl">
          <p className="text-black/75 leading-relaxed">Mostrando resultados para {searchLocation} dentro de la agenda curada del proyecto.</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h4 className="text-[2.2rem] font-display text-black uppercase leading-none">Actividades destacadas</h4>
          <span className="text-xs text-[#72546c] bg-[#f1d8ee] border border-[#e6c5e0] px-3 py-1 rounded-full">
            {activities.length} resultado{activities.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {activities.map((activity, index) => (
            <motion.article
              key={activity.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="relative overflow-hidden rounded-[1.35rem] border border-[#d6d1d8] bg-[#efedf1] p-6"
            >
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.42),transparent_38%,rgba(0,0,0,0.02))] pointer-events-none" />

              <div className="relative space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#8a8390] mb-2">Actividad del mes</p>
                    <h5 className="text-[2.05rem] font-display text-[#17131a] uppercase leading-[1.08]">{activity.title}</h5>
                  </div>
                  <span className="text-xs text-[#6f5b76] bg-[#e8ddea] border border-[#d3c3d7] px-3 py-1 rounded-full uppercase tracking-[0.18em]">
                    {activity.type}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-[#625d68]">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {activity.city}, {activity.province}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    {formatActivityDate(activity.date)}
                  </span>
                </div>

                <p className="text-[#26222b] leading-relaxed text-[1.02rem]">{activity.summary}</p>

                <div className="rounded-2xl border border-[#d5d0d8] bg-[#e4e1e7] p-4">
                  <p className="text-[#86808c] uppercase tracking-[0.22em] text-[11px] mb-3">Tips para verla mejor</p>
                  <div className="space-y-2">
                    {activity.tips.map((tip) => (
                      <p key={tip} className="text-[#2c2730] text-sm leading-relaxed">✨ {tip}</p>
                    ))}
                  </div>
                </div>

                {activity.note && <p className="text-sm text-[#4d4653] leading-relaxed">{activity.note}</p>}

                <div className="pt-4 border-t border-[#d1ccd4] flex items-center justify-between gap-4 text-sm text-[#5d5863]">
                  <span className="truncate">Fuente: {activity.sourceName}</span>
                  {activity.sourceUrl ? (
                    <a
                      href={activity.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-[#17131a] hover:text-[#5e526c] transition-colors"
                    >
                      Ver fuente
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <span className="text-[#8d8692]">Curado internamente</span>
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
