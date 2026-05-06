import { useMemo, useState } from 'react';
import {
  Baby,
  Bed,
  BookHeart,
  ChevronDown,
  HeartPulse,
  MoonStar,
  Sparkles,
  Stars,
  Venus,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getPhaseDailyGuidance } from '@/utils/dailyQuotes';

type PortalDestination =
  | 'Emociones'
  | 'Sueño'
  | 'Ciclo'
  | 'Embarazo'
  | 'Signos'
  | 'Cristales'
  | 'Motivación';

type ThemeMode = 'sunset' | 'moon';

interface MoonWellbeingSectionProps {
  selectedDate: Date;
  phaseName: string;
  eventsContent?: React.ReactNode;
  mode?: 'general' | 'full';
  themeMode?: ThemeMode;
}

interface ResultOption {
  id: string;
  label: string;
  description: string;
  resultFocus: string;
}

interface DestinationConfig {
  title: string;
  icon: typeof HeartPulse;
  intro: string;
  prompt: string;
  options: ResultOption[];
  practical: string[];
  evidence: string[];
  symbolic: string[];
  question: string;
}

const destinationConfigs: Record<PortalDestination, DestinationConfig> = {
  Emociones: {
    title: 'Emociones',
    icon: HeartPulse,
    intro: 'Una lectura sensible para escuchar lo que tu mundo interno viene queriendo decir.',
    prompt: '¿Desde dónde querés recibir hoy esta lectura emocional?',
    options: [
      {
        id: 'calmar',
        label: 'Calmarme',
        description: 'Necesito contención y una devolución más suave.',
        resultFocus: 'Hoy la Luna te pide bajar la intensidad, darle nombre a una emoción y rodearla de más ternura que exigencia.',
      },
      {
        id: 'entender',
        label: 'Entenderme',
        description: 'Quiero entender qué se me está moviendo por dentro.',
        resultFocus: 'La fase actual ilumina un patrón emocional que no nació hoy: mirá qué se repite, qué lo activa y qué te está queriendo mostrar.',
      },
      {
        id: 'acompanar',
        label: 'Acompañar a alguien',
        description: 'Quiero una devolución para acompañar a otra persona.',
        resultFocus: 'Esta energía funciona como clima de consulta: menos etiqueta, más intuición afinada y preguntas que abran verdad.',
      },
    ],
    practical: [
      'Elegí una emoción y escribila con nombre propio.',
      'Bajá una capa de estímulo antes de reaccionar.',
      'Preguntate si hoy necesitás expresión, límite o descanso.',
    ],
    evidence: [
      'Las emociones no responden de forma universal a cada fase lunar.',
      'Sueño, estrés y contexto vincular suelen influir más que la Luna por sí sola.',
      'La observación personal vale más que una teoría general.',
    ],
    symbolic: [
      'La luna llena suele leerse como intensidad y revelación.',
      'La luna nueva se asocia con introspección y repliegue.',
      'Cada fase puede usarse como lenguaje para leer climas internos.',
    ],
    question: '¿Qué emoción viene pidiendo ser reconocida antes de que intentes ordenarla?',
  },
  Sueño: {
    title: 'Sueño',
    icon: Bed,
    intro: 'Una lectura nocturna para escuchar qué le está costando soltar a tu energía.',
    prompt: '¿Cómo querés entrar hoy a esta lectura del descanso?',
    options: [
      {
        id: 'dormir-mejor',
        label: 'Dormir mejor hoy',
        description: 'Quiero una guía concreta para esta noche.',
        resultFocus: 'Esta noche la Luna no te pide entenderlo todo: te pide una bajada suave, menos ruido y un cierre más amoroso.',
      },
      {
        id: 'ver-patron',
        label: 'Ver el patrón',
        description: 'Quiero leer el patrón detrás del cansancio.',
        resultFocus: 'La fase lunar puede amplificar lo que ya viene sensible: observá si tu mente, tu cuerpo o tu rutina están pidiendo descanso hace rato.',
      },
      {
        id: 'ritual-nocturno',
        label: 'Armar un ritual nocturno',
        description: 'Quiero un cierre más ritual y envolvente.',
        resultFocus: 'Tomá esta noche como un pequeño rito de cierre: una intención, una luz más baja y una escena que le diga a tu cuerpo que ya puede soltar.',
      },
    ],
    practical: [
      'Definí ahora cómo querés cerrar la noche.',
      'Sacá una fuente de sobreestimulación antes de dormir.',
      'Dejá una nota breve si venís con sueños muy intensos o despertares frecuentes.',
    ],
    evidence: [
      'La evidencia científica sobre Luna y sueño es mixta.',
      'Pantallas, estrés y cafeína tienen un impacto mucho más consistente.',
      'Si el insomnio es sostenido, conviene una mirada clínica además de cualquier ritual.',
    ],
    symbolic: [
      'La luna llena suele asociarse con hiperactividad mental y sueños más intensos.',
      'La menguante se usa simbólicamente para descarga y cierre.',
      'La noche puede leerse como espacio de depuración, no solo de descanso.',
    ],
    question: '¿Qué parte tuya sigue en guardia cuando la noche ya te está pidiendo descanso?',
  },
  Ciclo: {
    title: 'Ciclo',
    icon: Venus,
    intro: 'Una lectura para escuchar el ritmo de tu cuerpo como si fuera un mapa vivo.',
    prompt: '¿Qué parte de tu ciclo querés escuchar hoy?',
    options: [
      {
        id: 'escuchar-cuerpo',
        label: 'Escuchar mi cuerpo',
        description: 'Quiero escuchar el cuerpo antes que la cabeza.',
        resultFocus: 'La fase lunar hoy funciona como espejo suave: mirá si tu energía pide expansión, recogimiento o una pausa sin culpa.',
      },
      {
        id: 'ordenar-info',
        label: 'Ordenar información',
        description: 'Quiero entender qué me está mostrando este momento.',
        resultFocus: 'Lo más valioso hoy no es la teoría, sino la señal: cuerpo, energía y fase hablando entre sí como un mismo lenguaje.',
      },
      {
        id: 'leer-simbolicamente',
        label: 'Leerlo simbólicamente',
        description: 'Quiero leerlo desde lo lunar, lo simbólico y lo ritual.',
        resultFocus: 'La fase puede traducir tu momento interno en una intención viva: sembrar, sostener, iluminar o soltar con conciencia.',
      },
    ],
    practical: [
      'Observá si hoy tu cuerpo pide expansión, pausa o limpieza.',
      'No fuerces sincronías: registrá lo que pasa, no lo que debería pasar.',
      'Usá una palabra simple para describir tu energía de hoy.',
    ],
    evidence: [
      'No existe una sincronía lunar universal para todos los ciclos.',
      'Sí puede haber coincidencias parciales en algunas personas.',
      'Lo más útil es construir tu propio mapa a lo largo del tiempo.',
    ],
    symbolic: [
      'Algunas corrientes leen luna nueva y luna llena como climas distintos para el ciclo.',
      'La narrativa lunar puede dar sentido y lenguaje sin convertirse en mandato.',
      'La potencia está en la observación viva, no en la regla cerrada.',
    ],
    question: '¿Qué verdad de tu ritmo interno quiere ser honrada hoy?',
  },
  Embarazo: {
    title: 'Embarazo',
    icon: Baby,
    intro: 'Un espacio de cuidado sensible para leer este momento con más presencia y más calma.',
    prompt: '¿Cómo querés que te acompañe hoy esta lectura?',
    options: [
      {
        id: 'cuidado',
        label: 'Cuidado concreto',
        description: 'Quiero una guía amorosa pero bien anclada.',
        resultFocus: 'Hoy la Luna puede sostenerte emocionalmente, pero la sabiduría principal sigue viniendo de tu cuerpo y de su necesidad real de cuidado.',
      },
      {
        id: 'calma',
        label: 'Calma',
        description: 'Necesito calma, contención y menos ruido.',
        resultFocus: 'Hoy esta lectura quiere envolverte más que explicarte: menos información, más respiración, más ternura y menos exigencia.',
      },
      {
        id: 'conexion',
        label: 'Conexión simbólica',
        description: 'Quiero una conexión más intuitiva y ritual.',
        resultFocus: 'La fase lunar puede abrir un momento de gratitud, escucha y conexión con vos misma sin volverse una carga más.',
      },
    ],
    practical: [
      'Elegí una práctica breve de regulación: respiración, pausa o estiramiento suave.',
      'No romantices señales físicas importantes.',
      'Usá la Luna como compañía simbólica, no como criterio clínico.',
    ],
    evidence: [
      'En el embarazo son comunes cambios de sueño, cansancio y sensibilidad corporal.',
      'No conviene atribuir síntomas a la Luna como causa principal.',
      'La referencia central siguen siendo los controles y la atención médica.',
    ],
    symbolic: [
      'La Luna se asocia con gestación, intuición y receptividad.',
      'Muchas personas la usan como contenedor emocional para esta etapa.',
      'Puede ser una puerta para rituales suaves de descanso y gratitud.',
    ],
    question: '¿Qué gesto de amor y cuidado le devolvería hoy más paz a tu cuerpo?',
  },
  Signos: {
    title: 'Signos',
    icon: Stars,
    intro: 'Una entrada astral para leer símbolos, climas y arquetipos como si te hablara una astróloga.',
    prompt: '¿Cómo querés recibir hoy esta lectura astral?',
    options: [
      {
        id: 'consulta',
        label: 'Consulta o sesión',
        description: 'Busco una lectura para consulta o sesión.',
        resultFocus: 'La fase lunar marca el clima de consulta: qué se ilumina, qué pide tierra y qué tema quiere tomar la palabra primero.',
      },
      {
        id: 'ritual',
        label: 'Práctica astral',
        description: 'Quiero una lectura más simbólica e intuitiva.',
        resultFocus: 'La mejor lectura hoy no es “qué signo sos”, sino qué arquetipo está intentando expresarse a través tuyo con más conciencia.',
      },
      {
        id: 'orientacion',
        label: 'Orientarme',
        description: 'Necesito una señal para orientarme.',
        resultFocus: 'Tomá esta categoría como espejo: menos personalidad fija, más tema activo, elemento dominante y una dirección posible para este momento.',
      },
    ],
    practical: [
      'Elegí un solo tema de consulta para hoy.',
      'Convertí el símbolo en pregunta, no en etiqueta.',
      'Buscá qué energía conviene activar y cuál conviene bajar.',
    ],
    evidence: [
      'La lectura por signo pertenece al terreno simbólico y cultural.',
      'Puede ser valiosa como lenguaje de reflexión y acompañamiento.',
      'Su utilidad está en el sentido que abre, no en la exactitud científica.',
    ],
    symbolic: [
      'Cada lunación puede sentirse distinta según el signo o elemento involucrado.',
      'La astrología sirve mejor cuando ordena preguntas y no cuando clausura sentidos.',
      'Podés usarla como herramienta de traducción emocional o ritual.',
    ],
    question: '¿Qué arquetipo está llamando hoy tu atención para ayudarte a leer este momento?',
  },
  Cristales: {
    title: 'Cristales',
    icon: Sparkles,
    intro: 'Una devolución ritual para elegir intención, piedra y gesto sin sobrecargarte.',
    prompt: '¿Qué querés consagrar o mover hoy en tu energía?',
    options: [
      {
        id: 'ritual',
        label: 'Hacer un ritual',
        description: 'Quiero hacer un ritual con sentido.',
        resultFocus: 'Hoy te va a sostener más un gesto simple y coherente que una práctica llena de cosas pero vacía de intención.',
      },
      {
        id: 'entender',
        label: 'Entender para qué sirve',
        description: 'Quiero entender para qué me puede servir.',
        resultFocus: 'Pensá cristales y objetos rituales como anclas de intención, presencia y belleza, no como fórmulas mágicas.',
      },
      {
        id: 'ordenar',
        label: 'Ordenar mi energía',
        description: 'Necesito limpiar, enfocar o reordenar.',
        resultFocus: 'Elegí una sola intención para esta fase: limpiar, enfocar, agradecer o cerrar, y dejá que todo lo demás se ordene alrededor.',
      },
    ],
    practical: [
      'Elegí una sola piedra o un solo gesto ritual.',
      'Asociá la práctica a una intención clara.',
      'No sobrecargues el altar: hacelo habitable.',
    ],
    evidence: [
      'La carga de cristales pertenece al plano simbólico o espiritual.',
      'Puede tener valor emocional o contemplativo.',
      'No reemplaza descanso, tratamiento ni decisiones de salud.',
    ],
    symbolic: [
      'La luna llena suele usarse para cargar, agradecer y expandir.',
      'La luna nueva se asocia con intención, limpieza y apertura.',
      'El ritual funciona mejor cuando es breve, concreto y repetible.',
    ],
    question: '¿Qué intención merece hoy ser sostenida con un gesto ritual verdadero?',
  },
  Motivación: {
    title: 'Motivación',
    icon: BookHeart,
    intro: 'Una pequeña devolución del día, como si abrieras una carta o escucharas una guía breve.',
    prompt: '¿Cómo querés recibir hoy este mensaje lunar?',
    options: [
      {
        id: 'contencion',
        label: 'Contención',
        description: 'Quiero una frase que me abrace.',
        resultFocus: 'Hoy el mensaje no viene a exigirte nada: viene a devolverte centro, suavidad y una sensación de compañía.',
      },
      {
        id: 'foco',
        label: 'Foco',
        description: 'Necesito una guía para ordenar mi energía.',
        resultFocus: 'Tomá la energía lunar como criterio del día: una sola idea, una sola prioridad y una sola acción que te devuelva poder.',
      },
      {
        id: 'mantra',
        label: 'Mantra o intención',
        description: 'Quiero usarlo como mantra o apertura.',
        resultFocus: 'Leé la motivación como una apertura ritual: algo breve que puedas habitar, repetir y dejar entrar en el cuerpo.',
      },
    ],
    practical: [
      'Quedate con una sola frase del día.',
      'Bajala a una acción simple y realista.',
      'Volvé mañana para comparar si el tono del día cambió.',
    ],
    evidence: [
      'Una frase breve puede funcionar como ancla de atención y foco.',
      'Los rituales simples son más sostenibles cuando se integran a la rutina.',
      'No hace falta que “pegue perfecto” para que sea útil.',
    ],
    symbolic: [
      'La motivación diaria puede funcionar como mini oráculo.',
      'También puede ser mantra, semilla o apertura de tarot y journaling.',
      'La clave está en usarla como guía y no como mandato.',
    ],
    question: '¿Qué palabra quiere acompañarte hoy como un pequeño amuleto?',
  },
};

const steps = ['Puerta', 'Lectura', 'Mensaje'];

function StepIndicator({
  activeStep,
  isSunset,
}: {
  activeStep: 1 | 2 | 3;
  isSunset: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => {
        const stepNumber = (index + 1) as 1 | 2 | 3;
        const isActive = activeStep >= stepNumber;

        return (
          <div key={step} className="flex min-w-0 items-center gap-2">
            <div
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                isActive
                  ? isSunset
                    ? 'bg-fuchsia-500'
                    : 'bg-fuchsia-300'
                  : isSunset
                    ? 'bg-[#d7bfd1]'
                    : 'bg-white/18'
              }`}
            />
            <span
              className={`text-[11px] uppercase tracking-[0.16em] ${
                isSunset ? 'text-[#8f7489]' : 'text-white/45'
              }`}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function MoonWellbeingSection({
  selectedDate,
  phaseName,
  mode = 'general',
  themeMode = 'moon',
}: MoonWellbeingSectionProps) {
  const isSunset = themeMode === 'sunset';
  const availableDestinations = useMemo(
    () => Object.keys(destinationConfigs) as PortalDestination[],
    [],
  );

  const [selectedDestination, setSelectedDestination] = useState<PortalDestination | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const dailyGuidance = useMemo(
    () => getPhaseDailyGuidance(phaseName, selectedDate),
    [phaseName, selectedDate],
  );

  const activeConfig = selectedDestination ? destinationConfigs[selectedDestination] : null;
  const activeOption =
    activeConfig?.options.find((option) => option.id === selectedOptionId) ?? null;

  const activeStep: 1 | 2 | 3 = activeOption ? 3 : selectedDestination ? 2 : 1;

  const shellClassName = isSunset
    ? 'border-[#ead6e6] bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,232,243,0.95)_52%,rgba(255,255,255,0.99))] shadow-[0_24px_90px_rgba(64,24,48,0.12)]'
    : 'border-white/12 bg-[#0a0712]/88 shadow-[0_24px_90px_rgba(7,3,14,0.48)]';

  const softCardClassName = isSunset
    ? 'border-[#ead6e6] bg-white/84'
    : 'border-white/10 bg-white/[0.04]';

  const deepCardClassName = isSunset
    ? 'border-[#ead6e6] bg-white/92'
    : 'border-white/10 bg-black/18';

  const titleClassName = isSunset ? 'text-[#17131a]' : 'text-white';
  const bodyClassName = isSunset ? 'text-[#4c4650]' : 'text-white/72';
  const mutedClassName = isSunset ? 'text-[#8f7489]' : 'text-white/45';

  return (
    <section className={`relative overflow-hidden rounded-[2rem] border backdrop-blur-xl ${shellClassName}`}>
      <div
        className={`pointer-events-none absolute inset-0 ${
          isSunset
            ? 'bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.88),transparent_28%),radial-gradient(circle_at_top_right,rgba(217,70,239,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(217,70,239,0.03)_55%,rgba(255,255,255,0.10))]'
            : 'bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_top_right,rgba(217,70,239,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(217,70,239,0.05)_55%,rgba(4,4,8,0.18))]'
        }`}
      />

      <div className="relative px-5 py-8 md:px-8 md:py-10">
        <div className="mb-8 max-w-4xl">
          <p className={`mb-3 text-[11px] uppercase tracking-[0.22em] ${mutedClassName}`}>
            Luna y bienestar
          </p>
          <h3 className={`mb-4 text-4xl leading-[0.95] md:text-5xl font-display ${titleClassName}`}>
            Entrá con una pregunta y dejá que la Luna te devuelva una lectura
          </h3>
        </div>

        <div className={`mb-6 rounded-[1.75rem] border p-5 md:p-6 ${softCardClassName}`}>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <StepIndicator activeStep={activeStep} isSunset={isSunset} />
              <div>
                <p className={`mb-1 text-[11px] uppercase tracking-[0.18em] ${mutedClassName}`}>
                  Consulta actual
                </p>
                <p className={`text-[1.2rem] leading-[1.08] md:text-[1.45rem] font-display ${titleClassName}`}>
                  {selectedDestination ?? 'Elegí una puerta de entrada'}{activeOption ? ` · ${activeOption.label}` : ''}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {(selectedDestination || activeOption) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDestination(null);
                    setSelectedOptionId(null);
                  }}
                  className={`rounded-full border px-4 py-2.5 text-sm transition-all duration-300 ${
                    isSunset
                      ? 'border-[#ead6e6] bg-white text-[#17131a] hover:bg-[#fff5fb]'
                      : 'border-white/12 bg-white/[0.05] text-white hover:bg-white/[0.08]'
                  }`}
                >
                  Empezar de nuevo
                </button>
              )}
            </div>
          </div>
        </div>

        {activeStep === 1 && (
          <section className={`rounded-[1.9rem] border p-5 md:p-6 ${softCardClassName}`}>
            <div className="mb-5">
              <p className={`mb-2 text-[11px] uppercase tracking-[0.18em] ${mutedClassName}`}>Paso 1</p>
              <h4 className={`text-[1.25rem] md:text-[1.45rem] font-display ${titleClassName}`}>
                ¿Qué puerta querés abrir hoy?
              </h4>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {availableDestinations.map((destination) => {
                const item = destinationConfigs[destination];
                const Icon = item.icon;

                return (
                  <button
                    key={destination}
                    type="button"
                    onClick={() => {
                      setSelectedDestination(destination);
                      setSelectedOptionId(null);
                    }}
                    className={`group rounded-[1.35rem] border p-4 text-left transition-all duration-300 ${
                      isSunset
                        ? 'border-[#ead6e6] bg-white hover:-translate-y-[2px] hover:bg-[#fff5fb]'
                        : 'border-white/10 bg-black/18 hover:-translate-y-[2px] hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                          isSunset
                            ? 'border-[#ead6e6] bg-[#fff4fa] text-[#17131a]'
                            : 'border-white/10 bg-white/[0.06] text-white'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h5 className={`text-lg uppercase leading-none font-display ${titleClassName}`}>
                          {item.title}
                        </h5>
                        <p className={`mt-2 text-[13px] leading-[1.45] ${bodyClassName}`}>
                          {item.intro}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {activeStep === 2 && activeConfig && (
          <section className={`rounded-[1.9rem] border p-5 md:p-6 ${softCardClassName}`}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className={`mb-2 text-[11px] uppercase tracking-[0.18em] ${mutedClassName}`}>Paso 2</p>
                <h4 className={`text-[1.25rem] md:text-[1.45rem] font-display ${titleClassName}`}>
                {activeConfig.prompt}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDestination(null)}
                className={`rounded-full border px-4 py-2.5 text-sm transition-all duration-300 ${
                  isSunset
                    ? 'border-[#ead6e6] bg-white text-[#17131a] hover:bg-[#fff5fb]'
                    : 'border-white/12 bg-white/[0.05] text-white hover:bg-white/[0.08]'
                }`}
              >
                Cambiar tema
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {activeConfig.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedOptionId(option.id)}
                  className={`rounded-[1.35rem] border p-4 text-left transition-all duration-300 ${
                    isSunset
                      ? 'border-[#ead6e6] bg-white hover:-translate-y-[2px] hover:bg-[#fff5fb]'
                      : 'border-white/10 bg-black/18 hover:-translate-y-[2px] hover:bg-white/[0.06]'
                  }`}
                >
                  <h5 className={`text-lg leading-none font-display ${titleClassName}`}>{option.label}</h5>
                  <p className={`mt-2 text-[13px] leading-[1.45] ${bodyClassName}`}>{option.description}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {activeStep === 3 && activeConfig && activeOption && (
          <section className="space-y-5">
            <div className={`rounded-[1.9rem] border p-5 md:p-6 ${deepCardClassName}`}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className={`mb-2 text-[11px] uppercase tracking-[0.18em] ${mutedClassName}`}>
                    Tu devolución
                  </p>
                  <h4 className={`text-[1.45rem] leading-[1.05] md:text-[2rem] font-display ${titleClassName}`}>
                    {activeConfig.title} · {activeOption.label}
                  </h4>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.16em] ${
                    isSunset
                      ? 'border-[#ead6e6] bg-[#fff4fa] text-[#8f7489]'
                      : 'border-fuchsia-300/18 bg-fuchsia-500/10 text-fuchsia-100/74'
                  }`}
                >
                  {format(selectedDate, "d 'de' MMMM", { locale: es })} · {phaseName}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <div className={`rounded-[1.5rem] border p-4 ${softCardClassName}`}>
                  <p className={`mb-2 text-[11px] uppercase tracking-[0.18em] ${mutedClassName}`}>
                    Lo que la Luna te muestra hoy
                  </p>
                  <p className={`text-[1.05rem] leading-[1.55] ${titleClassName}`}>
                    {activeOption.resultFocus}
                  </p>
                </div>

                <div className={`rounded-[1.5rem] border p-4 ${softCardClassName}`}>
                  <p className={`mb-2 text-[11px] uppercase tracking-[0.18em] ${mutedClassName}`}>
                    Mensaje de la fase
                  </p>
                  <p className={`text-[1.05rem] leading-[1.45] font-display ${titleClassName}`}>
                    {dailyGuidance.title}
                  </p>
                  <p className={`mt-2 text-sm leading-[1.6] ${bodyClassName}`}>
                    {selectedDestination === 'Motivación'
                      ? dailyGuidance.quote
                      : dailyGuidance.intention}
                  </p>
                </div>
              </div>
            </div>

            <div className={`rounded-[1.9rem] border p-5 md:p-6 ${softCardClassName}`}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className={`mb-2 text-[11px] uppercase tracking-[0.18em] ${mutedClassName}`}>
                    Cómo acompañar esta energía
                  </p>
                  <h5 className={`text-[1.2rem] md:text-[1.35rem] font-display ${titleClassName}`}>
                    Tres gestos para seguir esta lectura
                  </h5>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {activeConfig.practical.map((item, index) => (
                  <div key={item} className={`rounded-[1.3rem] border p-4 ${deepCardClassName}`}>
                    <p className={`mb-2 text-[11px] uppercase tracking-[0.18em] ${mutedClassName}`}>
                      Paso {index + 1}
                    </p>
                    <p className={`text-sm leading-[1.6] ${bodyClassName}`}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedDestination === 'Motivación' && (
              <div className={`rounded-[1.9rem] border p-5 md:p-6 ${deepCardClassName}`}>
                <p className={`mb-2 text-[11px] uppercase tracking-[0.18em] ${mutedClassName}`}>
                  Mensaje del día
                </p>
                <p className={`text-[1.15rem] leading-[1.5] md:text-[1.35rem] font-display ${titleClassName}`}>
                  {dailyGuidance.quote}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <details className={`group rounded-[1.65rem] border p-5 ${softCardClassName}`}>
                <summary
                  className={`flex cursor-pointer list-none items-center justify-between gap-3 text-[1.05rem] font-display ${titleClassName}`}
                >
                  <span>Anclaje terrenal</span>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="mt-4 space-y-3">
                  {activeConfig.evidence.map((item) => (
                    <p key={item} className={`text-sm leading-[1.6] ${bodyClassName}`}>
                      {item}
                    </p>
                  ))}
                </div>
              </details>

              <details className={`group rounded-[1.65rem] border p-5 ${softCardClassName}`}>
                <summary
                  className={`flex cursor-pointer list-none items-center justify-between gap-3 text-[1.05rem] font-display ${titleClassName}`}
                >
                  <span>Lectura intuitiva</span>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="mt-4 space-y-3">
                  {activeConfig.symbolic.map((item) => (
                    <p key={item} className={`text-sm leading-[1.6] ${bodyClassName}`}>
                      {item}
                    </p>
                  ))}
                </div>
              </details>
            </div>

            <div className={`rounded-[1.9rem] border p-5 md:p-6 ${softCardClassName}`}>
              <p className={`mb-2 text-[11px] uppercase tracking-[0.18em] ${mutedClassName}`}>
                Pregunta oráculo
              </p>
              <p className={`text-[1.05rem] leading-[1.55] ${titleClassName}`}>
                {activeConfig.question}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOptionId(null)}
                  className={`rounded-full border px-4 py-2.5 text-sm transition-all duration-300 ${
                    isSunset
                      ? 'border-[#ead6e6] bg-white text-[#17131a] hover:bg-[#fff5fb]'
                      : 'border-white/12 bg-white/[0.05] text-white hover:bg-white/[0.08]'
                  }`}
                >
                  Cambiar lectura
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDestination(null);
                    setSelectedOptionId(null);
                  }}
                  className={`rounded-full px-4 py-2.5 text-sm transition-all duration-300 ${
                    isSunset
                      ? 'bg-fuchsia-500 text-white hover:bg-fuchsia-400'
                      : 'bg-fuchsia-500 text-white hover:bg-fuchsia-400'
                  }`}
                >
                  Abrir otra consulta
                </button>
              </div>
            </div>
          </section>
        )}

        {mode === 'full' && (
          <div className={`mt-6 rounded-[1.6rem] border p-4 ${softCardClassName}`}>
            <p className={`text-sm leading-[1.6] ${bodyClassName}`}>
              En una siguiente versión podemos volver a sumar registro personal, patrones y capas más profundas, pero dejando esa información como segunda instancia y no como barrera de entrada.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
