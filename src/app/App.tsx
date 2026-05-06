import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, HeartPulse, Sparkles } from 'lucide-react';
import { Header } from './components/Header';
import { MoonParticleAnimation } from './components/MoonParticleAnimation';
import { MoonPhaseInfo } from './components/MoonPhaseInfo';
import { NextFullMoon } from './components/NextFullMoon';
import { EventsSection } from './components/EventsSection';
import { EventSearch } from './components/EventSearch';
import { GalacticBackground } from './components/GalacticBackground';
import { FullMoonCalendar } from './components/FullMoonCalendar';
import { MoonGuide } from './components/MoonGuide';
import { MoonWellbeingSection } from './components/MoonWellbeingSection';
import { getMoonPhase, getNextFullMoon } from '@/utils/moonPhases';
import { filterMoonActivities, getProvinceOptions } from '@/utils/moonActivities';

type AppPath = '/' | '/eventos' | '/bienestar';

function navigateTo(path: AppPath, setPathname: (path: AppPath) => void) {
  window.history.pushState({}, '', path);
  setPathname(path);
}

function HomeActionCard({
  title,
  description,
  icon,
  eyebrow,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  eyebrow: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative min-h-[280px] overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03)_40%,rgba(217,70,239,0.1))] p-7 text-left transition-all duration-300 hover:-translate-y-[4px] hover:border-fuchsia-300/26 hover:shadow-[0_24px_44px_rgba(217,70,239,0.16)] md:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_42%,rgba(255,255,255,0.02))]" />
      <div className="relative">
        <p className="mb-4 text-[11px] uppercase tracking-[0.2em] text-white/48">{eyebrow}</p>
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-white transition-all duration-300 group-hover:border-fuchsia-300/24 group-hover:bg-fuchsia-500/10">
          {icon}
        </div>
        <h3 className="mb-4 max-w-xl text-[1.9rem] uppercase leading-[0.95] text-white md:text-[2.35rem] font-display">{title}</h3>
        <p className="max-w-xl text-[15px] leading-[1.7] text-white/72">{description}</p>
        <div className="mt-8 inline-flex items-center gap-2 text-sm text-fuchsia-100/86">
          Abrir experiencia
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </button>
  );
}

function PageBackLink({
  label,
  onClick,
  themeMode = 'moon',
}: {
  label: string;
  onClick: () => void;
  themeMode?: 'sunset' | 'moon';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
        themeMode === 'sunset'
          ? 'border-[#efcfdf] bg-white/84 text-[#17131a] hover:border-fuchsia-300/30 hover:bg-[#fff3fa]'
          : 'border-white/12 bg-white/[0.05] text-white hover:border-white/18 hover:bg-white/[0.08]'
      }`}
    >
      <ArrowRight className="h-4 w-4 rotate-180" />
      {label}
    </button>
  );
}

export default function App() {
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(12, 0, 0, 0);
    return now;
  }, []);
  const [pathname, setPathname] = useState<AppPath>(
    (() => {
      const path = window.location.pathname;
      return path === '/eventos' || path === '/bienestar' ? path : '/';
    })(),
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProvince, setSelectedProvince] = useState('');
  const [skyMode, setSkyMode] = useState<'sunset' | 'moon'>('moon');

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setPathname(path === '/eventos' || path === '/bienestar' ? path : '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const moonPhase = useMemo(() => getMoonPhase(selectedDate), [selectedDate]);
  const nextFullMoon = useMemo(() => getNextFullMoon(today), [today]);
  const provinceOptions = useMemo(
    () => getProvinceOptions({ month: selectedDate.getMonth(), year: selectedDate.getFullYear() }),
    [selectedDate],
  );
  const filteredActivities = useMemo(
    () =>
      filterMoonActivities({
        city: selectedProvince,
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
      }),
    [selectedProvince, selectedDate],
  );

  const goHome = () => navigateTo('/', setPathname);
  const goEvents = () => navigateTo('/eventos', setPathname);
  const goWellbeing = () => navigateTo('/bienestar', setPathname);

  return (
    <div className="min-h-screen overflow-x-hidden bg-black relative">
      <GalacticBackground mode={skyMode} />

      <div className="relative z-10">
        <Header
          date={selectedDate}
          mode={skyMode}
          onModeChange={setSkyMode}
          onDateChange={setSelectedDate}
        />

        <div className="relative w-full h-[575px] md:h-[660px] -mt-10 mb-0">
          <MoonParticleAnimation
            date={selectedDate}
            onDateChange={setSelectedDate}
            mode={skyMode}
          />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <MoonPhaseInfo date={selectedDate} themeMode={skyMode} />
          </div>

          <div className="mb-16">
            <NextFullMoon fullMoon={nextFullMoon} themeMode={skyMode} />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-20">
          {pathname === '/' && (
            <>
              <div className="mb-8">
                <FullMoonCalendar currentDate={selectedDate} themeMode={skyMode} />
              </div>

              <div className="mb-10">
                <MoonGuide themeMode={skyMode} />
              </div>

              <section
                className={`mb-12 rounded-[2rem] border p-6 md:p-8 ${
                  skyMode === 'sunset'
                    ? 'border-[#efcfdf] bg-[linear-gradient(135deg,rgba(255,251,253,0.96),rgba(250,235,244,0.94)_52%,rgba(255,255,255,0.97))] shadow-[0_24px_50px_rgba(64,24,48,0.08)]'
                    : 'border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02)_42%,rgba(217,70,239,0.08))]'
                }`}
              >
                <p
                  className={`mb-4 text-[11px] uppercase tracking-[0.18em] ${
                    skyMode === 'sunset' ? 'text-[#8f7489]' : 'text-white/45'
                  }`}
                >
                  Dos formas de entrar
                </p>
                <h2
                  className={`mb-3 max-w-5xl text-[1.7rem] uppercase leading-[0.95] md:text-[2.4rem] md:whitespace-nowrap font-display ${
                    skyMode === 'sunset' ? 'text-[#1f1622]' : 'text-white'
                  }`}
                >
                  Elegí si hoy querés mirar el cielo afuera o mirar tu mundo adentro
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={goEvents}
                    className={`group flex min-h-[92px] items-center justify-between rounded-[1.35rem] border px-5 py-5 text-left transition-all duration-300 hover:-translate-y-[2px] ${
                      skyMode === 'sunset'
                        ? 'border-[#efcfdf] bg-white/84 hover:border-fuchsia-300/30 hover:bg-[#fff3fa] hover:shadow-[0_18px_36px_rgba(217,70,239,0.10)]'
                        : 'border-white/12 bg-white/[0.05] hover:border-fuchsia-300/24 hover:bg-white/[0.08] hover:shadow-[0_18px_36px_rgba(217,70,239,0.12)]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:border-fuchsia-300/24 group-hover:bg-fuchsia-500/10 ${
                          skyMode === 'sunset'
                            ? 'border-[#efcfdf] bg-[#fff1f8] text-[#1f1622]'
                            : 'border-white/10 bg-black/20 text-white'
                        }`}
                      >
                        <CalendarDays className="h-5 w-5" />
                      </div>
                      <p
                        className={`text-[1.15rem] uppercase leading-[1] md:text-[1.35rem] font-display ${
                          skyMode === 'sunset' ? 'text-[#1f1622]' : 'text-white'
                        }`}
                      >
                        Eventos en luna llena
                      </p>
                    </div>
                    <ArrowRight
                      className={`h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 ${
                        skyMode === 'sunset' ? 'text-fuchsia-600/80' : 'text-fuchsia-100/82'
                      }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={goWellbeing}
                    className={`group flex min-h-[92px] items-center justify-between rounded-[1.35rem] border px-5 py-5 text-left transition-all duration-300 hover:-translate-y-[2px] ${
                      skyMode === 'sunset'
                        ? 'border-[#efcfdf] bg-white/84 hover:border-fuchsia-300/30 hover:bg-[#fff3fa] hover:shadow-[0_18px_36px_rgba(217,70,239,0.10)]'
                        : 'border-white/12 bg-white/[0.05] hover:border-fuchsia-300/24 hover:bg-white/[0.08] hover:shadow-[0_18px_36px_rgba(217,70,239,0.12)]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:border-fuchsia-300/24 group-hover:bg-fuchsia-500/10 ${
                          skyMode === 'sunset'
                            ? 'border-[#efcfdf] bg-[#fff1f8] text-[#1f1622]'
                            : 'border-white/10 bg-black/20 text-white'
                        }`}
                      >
                        <HeartPulse className="h-5 w-5" />
                      </div>
                      <p
                        className={`text-[1.15rem] uppercase leading-[1] md:text-[1.35rem] font-display ${
                          skyMode === 'sunset' ? 'text-[#1f1622]' : 'text-white'
                        }`}
                      >
                        La luna y mi bienestar
                      </p>
                    </div>
                    <ArrowRight
                      className={`h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 ${
                        skyMode === 'sunset' ? 'text-fuchsia-600/80' : 'text-fuchsia-100/82'
                      }`}
                    />
                  </button>
                </div>
              </section>
            </>
          )}

          {pathname === '/eventos' && (
            <div className="pb-8">
              <PageBackLink label="Volver al inicio" onClick={goHome} themeMode={skyMode} />

              <section
                className={`mb-8 rounded-[2rem] border p-6 ${
                  skyMode === 'sunset'
                    ? 'border-[#ead6e6] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(244,223,241,0.95)_54%,rgba(255,255,255,0.98))] shadow-[0_20px_45px_rgba(22,10,24,0.08)]'
                    : 'border-white/10 bg-[linear-gradient(145deg,rgba(7,5,16,0.82),rgba(29,19,41,0.88)_52%,rgba(15,10,22,0.86))] shadow-[0_24px_55px_rgba(4,2,10,0.24)]'
                }`}
              >
                <p className={`mb-2 text-[11px] uppercase tracking-[0.18em] ${skyMode === 'sunset' ? 'text-[#8b6d86]' : 'text-fuchsia-100/56'}`}>Agenda lunar en Argentina</p>
                <h2 className={`mb-3 text-[2rem] uppercase leading-[0.95] md:text-[3rem] font-display ${skyMode === 'sunset' ? 'text-[#17131a]' : 'text-white'}`}>
                  Ver eventos en luna llena
                </h2>
                <div className={`mt-8 rounded-[1.6rem] border p-4 md:p-5 ${skyMode === 'sunset' ? 'border-[#ead6e6] bg-white/58' : 'border-white/10 bg-black/16'}`}>
                  <EventSearch
                    onSearch={setSelectedProvince}
                    onMonthChange={setSelectedDate}
                    searchLocation={selectedProvince}
                    selectedDate={selectedDate}
                    phaseName={moonPhase.phaseName}
                    cityOptions={provinceOptions}
                    compact
                    themeMode={skyMode}
                  />

                  <EventsSection
                    activities={filteredActivities}
                    searchLocation={selectedProvince}
                    selectedDate={selectedDate}
                    themeMode={skyMode}
                  />
                </div>
              </section>
            </div>
          )}

          {pathname === '/bienestar' && (
            <>
              <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
              <div className="fixed inset-x-2 bottom-2 top-2 z-50 overflow-hidden rounded-[1.8rem] border border-white/10 bg-transparent shadow-[0_28px_90px_rgba(0,0,0,0.34)] sm:inset-x-3 sm:bottom-3 sm:top-3 sm:rounded-[2rem]">
                <div className="h-full overflow-y-auto px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6">
                  <PageBackLink label="Volver al inicio" onClick={goHome} themeMode={skyMode} />

                  <MoonWellbeingSection
                    selectedDate={selectedDate}
                    phaseName={moonPhase.phaseName}
                    mode="general"
                    themeMode={skyMode}
                  />
                </div>
              </div>
            </>
          )}

          <footer className="pt-6 pb-8">
            <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-6 py-4 text-center">
              <p className="mb-3 text-[1.2rem] text-white/88 md:text-[1.4rem] font-display">
                Tomamos un cafecito?
              </p>
              <a
                href="https://cafecito.app/mfernandaj"
                rel="noopener noreferrer"
                target="_blank"
                className="inline-flex items-center justify-center rounded-full border border-fuchsia-300/24 bg-fuchsia-500 px-6 py-3.5 text-[15px] text-white transition-all duration-300 hover:border-fuchsia-200/30 hover:bg-fuchsia-400 hover:scale-[1.02] md:text-base"
              >
                un Flat White, por favor.
              </a>
              <p className="mt-4 text-sm text-white/60 md:text-[15px]">
                Si te gustó el contenido ayudame a escalarlo en: cafecito.app/mfernandaj
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
