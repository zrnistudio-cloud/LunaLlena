import { useMemo, useState } from 'react';
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
import { filterMoonActivities, getCityOptions } from '@/utils/moonActivities';

export default function App() {
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(12, 0, 0, 0);
    return now;
  }, []);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchLocation, setSearchLocation] = useState('');
  const [skyMode, setSkyMode] = useState<'sunset' | 'moon'>('moon');
  const moonPhase = useMemo(() => getMoonPhase(selectedDate), [selectedDate]);
  const nextFullMoon = useMemo(() => getNextFullMoon(today), [today]);
  const cityOptions = useMemo(
    () => getCityOptions({ month: selectedDate.getMonth(), year: selectedDate.getFullYear() }),
    [selectedDate],
  );
  const filteredActivities = useMemo(
    () =>
      filterMoonActivities({
        city: searchLocation,
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
      }),
    [searchLocation, selectedDate],
  );

  return (
    <div className="min-h-screen bg-black overflow-x-hidden relative">
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
            <MoonPhaseInfo date={selectedDate} />
          </div>

          <div className="mb-16">
            <NextFullMoon fullMoon={nextFullMoon} />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="mb-8">
            <FullMoonCalendar currentDate={selectedDate} />
          </div>

          <div className="mb-12">
            <MoonGuide />
          </div>

          <div className="mb-12">
            <MoonWellbeingSection
              selectedDate={selectedDate}
              phaseName={moonPhase.phaseName}
            />
          </div>

          <section className="relative overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_24px_90px_rgba(12,4,18,0.18)] backdrop-blur-xl mb-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.85),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.08),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.86),rgba(255,255,255,0.96))] pointer-events-none" />
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-300/35 to-transparent pointer-events-none" />
            <div className="relative px-5 py-8 md:px-8 md:py-10">
              <EventSearch
                onSearch={setSearchLocation}
                onMonthChange={setSelectedDate}
                searchLocation={searchLocation}
                selectedDate={selectedDate}
                phaseName={moonPhase.phaseName}
                cityOptions={cityOptions}
              />

              <EventsSection
                activities={filteredActivities}
                searchLocation={searchLocation}
                selectedDate={selectedDate}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
