import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Moon } from 'lucide-react';
import gibosaCrecienteSvg from '@/assets/fases/Gibosa creciente.svg';
import lunaCrecienteSvg from '@/assets/fases/Luna creciente de cera.svg';
import gibosaMenguanteSvg from '@/assets/fases/Luna gibosa menguante.svg';
import lunaLlenaSvg from '@/assets/fases/Luna llena.svg';
import lunaMenguanteSvg from '@/assets/fases/Luna menguante.svg';
import lunaNuevaSvg from '@/assets/fases/luna nueva.svg';
import primerTrimestreSvg from '@/assets/fases/Primer trimestre.svg';
import ultimoTrimestreSvg from '@/assets/fases/Ultimo trimestre.svg';

export function MoonGuide({ themeMode = 'moon' }: { themeMode?: 'sunset' | 'moon' }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isSunset = themeMode === 'sunset';

  const phases = [
    ['Luna Nueva', lunaNuevaSvg, 'Es el punto de reinicio del ciclo: la Luna queda visualmente muy tenue y el cielo se vuelve ideal para mirar estrellas.'],
    ['Luna Creciente', lunaCrecienteSvg, 'Empieza a dibujarse una franja luminosa y cada noche gana presencia en el cielo del atardecer.'],
    ['Cuarto Creciente', primerTrimestreSvg, 'La vemos partida en dos mitades visuales y el cambio de energía del ciclo se siente más marcado.'],
    ['Gibosa Creciente', gibosaCrecienteSvg, 'La porción iluminada ya domina la escena y nos acerca al momento de máxima luz del mes.'],
    ['Luna Llena', lunaLlenaSvg, 'El disco se muestra completo, brillante y muy fácil de ubicar, protagonista absoluta de la noche.'],
    ['Gibosa Menguante', gibosaMenguanteSvg, 'Sigue viéndose grande y luminosa, aunque empieza lentamente a perder intensidad.'],
    ['Cuarto Menguante', ultimoTrimestreSvg, 'La iluminación vuelve a reducirse a media Luna y el ciclo entra en una etapa más serena.'],
    ['Luna Menguante', lunaMenguanteSvg, 'Queda un último filo de luz antes de cerrar el recorrido y volver a empezar.'],
  ] as const;

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
          <span className={`text-sm font-medium ${isSunset ? 'text-[#1f1622]' : 'text-white'}`}>Las fases de la Luna</span>
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
              className={`mt-4 rounded-3xl border p-6 backdrop-blur-xl md:p-8 ${
                isSunset
                  ? 'border-[#efcfdf] bg-[linear-gradient(135deg,rgba(255,251,253,0.97),rgba(250,235,244,0.95)_58%,rgba(255,255,255,0.97))] shadow-[0_24px_50px_rgba(64,24,48,0.08)]'
                  : 'border-white/10 bg-white/[0.05]'
              }`}
            >
              <div className="mb-6">
                <p className={`mb-2 text-xs uppercase tracking-[0.2em] ${isSunset ? 'text-[#8f7489]' : 'text-gray-400'}`}>Guia lunar</p>
                <h3 className={`text-3xl font-display md:text-4xl ${isSunset ? 'text-[#1f1622]' : 'text-white'}`}>Cuál es cuál?</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {phases.map(([title, image, text]) => (
                  <div
                    key={title}
                    className={`rounded-2xl border p-5 ${
                      isSunset ? 'border-[#eed8e5] bg-white/78' : 'border-white/10 bg-black/20'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={image}
                        alt={title}
                        className="h-16 w-16 shrink-0 object-contain"
                        style={{ opacity: title === 'Luna Nueva' ? 0.5 : 1 }}
                      />
                      <div>
                        <h4 className={`mb-2 text-2xl font-display uppercase ${isSunset ? 'text-[#1f1622]' : 'text-white'}`}>{title}</h4>
                        <p className={`leading-relaxed ${isSunset ? 'text-[#4f4256]' : 'text-gray-300'}`}>{text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
