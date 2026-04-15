import { useEffect, useMemo, useState } from 'react';
import {
  Baby,
  Bed,
  BookHeart,
  HeartPulse,
  MoonStar,
  Sparkles,
  Stars,
  Venus,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { getPhaseDailyGuidance } from '@/utils/dailyQuotes';

type EvidenceTag = 'Bienestar' | 'Evidencia limitada' | 'Ritual / simbólico' | 'Portal personal';
type CardKind = 'standard' | 'journal' | 'motivation';

interface PortalCard {
  title: string;
  shortTitle: string;
  subtitle: string;
  tag: EvidenceTag;
  kind?: CardKind;
  icon: typeof HeartPulse;
  summary: string;
  openingLine: string;
  consultationTopics: string[];
  watchouts: string[];
  scientific: string[];
  mystical: string[];
  practices: string[];
  journal: string;
  motivation: string;
}

interface JournalEntry {
  date: string;
  phaseName: string;
  mood: string;
  energy: string;
  sleep: string;
  sleepScore: string;
  body: string;
  ritual: string;
  notes: string;
  savedAt: string;
}

interface MoonWellbeingSectionProps {
  selectedDate: Date;
  phaseName: string;
}

const STORAGE_KEY = 'en-luna-llena-journal';

const cards: PortalCard[] = [
  {
    title: 'Emociones y Luna',
    shortTitle: 'Emociones',
    subtitle: 'Sensibilidad, estado interno y registro personal',
    tag: 'Bienestar',
    icon: HeartPulse,
    summary:
      'Un espacio para mirar cómo cambia tu mundo emocional a lo largo del mes lunar, sin convertir cada sensación en una regla fija.',
    openingLine:
      'Ideal para leer climas emocionales, preparar sesiones de tarot o journaling y detectar si tu sensibilidad está pidiendo pausa, expresión o contención.',
    consultationTopics: [
      'Cambios de humor cerca de luna llena o luna nueva.',
      'Necesidad de aislamiento, mayor intuición o hipersensibilidad.',
      'Cómo acompañar emocionalmente consultas, clases o rituales grupales.',
    ],
    watchouts: [
      'Si hay angustia sostenida o desregulación fuerte, priorizá apoyo profesional.',
      'No fuerces una explicación lunar si el patrón real parece venir del estrés o del vínculo.',
    ],
    scientific: [
      'No hay una prueba universal de que cada fase lunar provoque la misma emoción en todas las personas.',
      'Sí está bien documentado que el descanso, el estrés, el contexto vincular y los cambios hormonales influyen mucho en la regulación emocional.',
      'La utilidad real aparece cuando observás tus propios patrones durante varias semanas en vez de buscar una explicación única.',
    ],
    mystical: [
      'En lectura simbólica, la luna nueva suele asociarse con introspección y la luna llena con intensidad, culminación y revelación.',
      'Tarotistas, astrólogas y practicantes de yoga suelen trabajar la Luna como amplificador de intención y sensibilidad.',
      'Podés leer cada fase como clima energético: sembrar, crecer, iluminar, soltar.',
    ],
    practices: [
      'Registrá ánimo, energía, deseo de socializar y nivel de sensibilidad durante 7 días seguidos.',
      'Armá un pequeño ritual: vela, respiración y una pregunta de cierre o intención según la fase.',
      'Usá esta sección como consulta antes de sesiones de tarot, meditación o journaling.',
    ],
    journal:
      '¿Qué emoción me pide ser escuchada hoy y qué parte de mi energía necesita cuidado en vez de exigencia?',
    motivation:
      'Tu sensibilidad no es un error del sistema: es información que, bien leída, se vuelve brújula.',
  },
  {
    title: 'Sueño y Luna',
    shortTitle: 'Sueño',
    subtitle: 'Insomnio, descanso y noche interior',
    tag: 'Evidencia limitada',
    icon: Bed,
    summary:
      'Una guía para entender por qué a veces sentimos el descanso alterado cerca de ciertas fases y cómo separar percepción, rutina y simbolismo.',
    openingLine:
      'Sirve para quienes sienten noches más inquietas, sueños intensos o despertares frecuentes y quieren ordenar mejor qué parte es hábito, qué parte es cuerpo y qué parte es lectura simbólica.',
    consultationTopics: [
      'Despertares frecuentes o dificultad para bajar antes de dormir.',
      'Sueños intensos, repetitivos o más vívidos en ciertos momentos del mes.',
      'Rutinas que mejoran el descanso cuando hay alta activación interna.',
    ],
    watchouts: [
      'El insomnio crónico no se resuelve con rituales solamente.',
      'Alcohol, pantallas y estrés suelen pesar más que la fase lunar.',
    ],
    scientific: [
      'La evidencia científica sobre luna y sueño es mixta: hay estudios con diferencias leves y otros que no encuentran patrones robustos.',
      'Pantallas, estrés, cafeína, hábitos nocturnos y exposición a la luz tienen efectos más consistentes sobre el descanso.',
      'Si el insomnio es sostenido, lo importante es el cuidado del sueño y la consulta profesional cuando hace falta.',
    ],
    mystical: [
      'En tradición simbólica, la luna llena se asocia con hiperactividad mental, revelaciones, sueños intensos y dificultad para apagar la mente.',
      'La luna menguante suele leerse como una etapa más apta para soltar, limpiar y bajar el ruido interno.',
      'Para muchas personas, dormir mal cerca de una fase puede funcionar como señal de exceso de carga emocional.',
    ],
    practices: [
      'Anotá hora de sueño, despertares y calidad de descanso junto con la fase lunar.',
      'Hacé una rutina de cierre: luz cálida, respiración lenta, té suave y cero pantalla antes de dormir.',
      'Si trabajás con prácticas energéticas, usá la noche para descarga y la mañana para interpretación.',
    ],
    journal:
      '¿Qué me está costando soltar cuando llega la noche y qué necesita mi cuerpo para sentirse seguro al descansar?',
    motivation:
      'Descansar también es una práctica espiritual: cuando bajás la exigencia, el cuerpo vuelve a hablar más claro.',
  },
  {
    title: 'Ciclo menstrual',
    shortTitle: 'Ciclo',
    subtitle: 'Ritmo hormonal, observación y mapa lunar',
    tag: 'Evidencia limitada',
    icon: Venus,
    summary:
      'Un puente entre información real del ciclo y la lectura lunar como herramienta de autoconocimiento, sin prometer sincronías perfectas.',
    openingLine:
      'Pensado para acompañar observación menstrual, fertilidad creativa y ciclos internos sin caer en mandatos espirituales ni en falsas promesas de sincronía total.',
    consultationTopics: [
      'Cómo registrar menstruación, ovulación y fase lunar sin rigidizarse.',
      'Cambios de libido, claridad, cansancio o necesidad de recogimiento.',
      'Formas de leer el ciclo como mapa corporal y también como símbolo.',
    ],
    watchouts: [
      'Dolor fuerte, amenorrea o sangrados fuera de lo habitual necesitan consulta clínica.',
      'La astrología menstrual puede acompañar, pero no diagnostica.',
    ],
    scientific: [
      'No existe una sincronía lunar universal para todos los ciclos menstruales.',
      'Sí hay investigaciones y observaciones que muestran coincidencias parciales o intermitentes en algunas personas, pero no como norma fija.',
      'Dolor intenso, sangrado anormal o cambios bruscos necesitan mirada clínica más allá de cualquier lectura lunar.',
    ],
    mystical: [
      'En el plano simbólico, menstruar con luna nueva o luna llena suele leerse como una expresión de energía interna o externa.',
      'Algunas corrientes hablan de luna blanca y luna roja para pensar momentos de fertilidad creativa, introspección o servicio.',
      'Más que una regla, puede ser una narrativa poderosa para leer tu propio proceso.',
    ],
    practices: [
      'Relacioná fase lunar, energía, deseo sexual, necesidad de quietud y nivel de claridad mental.',
      'Si acompañás con tarot o astrología, registrá qué temas aparecen en cada tramo del ciclo.',
      'Armá un calendario personal con menstruación, ovulación estimada y fase lunar del día.',
    ],
    journal:
      '¿Qué me enseña mi ciclo sobre mis tiempos reales, incluso cuando no coinciden con la expectativa externa?',
    motivation:
      'Tu cuerpo no tiene que sincronizarse con ninguna teoría para estar hablándote con profundidad.',
  },
  {
    title: 'Embarazo y cuidado',
    shortTitle: 'Embarazo',
    subtitle: 'Acompañar sin romantizar los síntomas',
    tag: 'Bienestar',
    icon: Baby,
    summary:
      'Una mirada cálida y prudente para quienes desean integrar la Luna al embarazo sin confundir simbolismo con indicación de salud.',
    openingLine:
      'Esta guía acompaña el deseo de vivir el embarazo con sensibilidad ritual y cuidado concreto, dando lugar al símbolo sin desarmar la prevención real.',
    consultationTopics: [
      'Qué prácticas suaves pueden acompañar ansiedad, cansancio o espera.',
      'Cómo usar la Luna para conexión, gratitud o descanso corporal.',
      'Qué señales no conviene romantizar ni leer solo desde lo energético.',
    ],
    watchouts: [
      'Síntomas intensos, dudas o miedos físicos necesitan atención médica directa.',
      'No atribuyas decisiones clínicas a una fase lunar.',
    ],
    scientific: [
      'En el embarazo son frecuentes los cambios de sueño, cansancio, acidez, sensibilidad corporal y variaciones emocionales.',
      'No conviene atribuir síntomas o decisiones de salud a la Luna como causa principal.',
      'La prevención, los controles y la consulta médica siguen siendo la referencia central.',
    ],
    mystical: [
      'La Luna puede vivirse como arquetipo de gestación, receptividad, intuición y vínculo con el cuerpo creador.',
      'Muchas mujeres usan las fases para pequeños rituales de descanso, visualización, conexión con el bebé o cierre emocional.',
      'También puede servir como contenedor simbólico para atravesar miedo, espera y transformación.',
    ],
    practices: [
      'Asociá luna nueva con intención y luna llena con gratitud, cierre o conexión corporal suave.',
      'Usá prácticas de respiración, estiramientos restaurativos o meditación muy amable según tu etapa.',
      'Si algo preocupa, priorizá siempre prevención real antes que interpretación energética.',
    ],
    journal: '¿Qué necesita hoy mi cuerpo para sentirse acompañado, seguro y escuchado?',
    motivation: 'Acompañarte con ternura también es una forma de medicina cotidiana.',
  },
  {
    title: 'Por signo',
    shortTitle: 'Signos',
    subtitle: 'Astrología lunar como lenguaje de consulta',
    tag: 'Ritual / simbólico',
    icon: Stars,
    summary:
      'Una puerta para leer la fase lunar como clima simbólico y cruzarla con la mirada astrológica, ritual y terapéutica.',
    openingLine:
      'Funciona como mesa de consulta rápida para astrólogas, tarotistas y personas que quieren traducir el clima lunar a lenguaje de arquetipos, elementos y preguntas.',
    consultationTopics: [
      'Qué signo o elemento se siente más activo en la consulta actual.',
      'Cómo bajar símbolos a preguntas concretas para una sesión.',
      'Qué tema conviene trabajar: vínculo, dinero, cuerpo, voz o propósito.',
    ],
    watchouts: [
      'Evitá usar el signo como etiqueta cerrada o sentencia.',
      'La riqueza está en las preguntas que abre, no en acertar una personalidad.',
    ],
    scientific: [
      'La lectura por signo pertenece al campo simbólico y cultural, no a la evidencia clínica.',
      'Puede ser muy valiosa como lenguaje de reflexión, identidad y acompañamiento subjetivo.',
      'Su utilidad está en el sentido que abre, no en la promesa de exactitud científica.',
    ],
    mystical: [
      'Cada lunación puede sentirse distinta según el signo involucrado: más fuego, más agua, más estructura o más búsqueda de belleza.',
      'Para astrólogas y tarotistas, esta lectura puede orientar temas de consulta, ritual o integración emocional.',
      'La clave está en traducir arquetipos a preguntas vivas, no a etiquetas rígidas.',
    ],
    practices: [
      'Trabajá con una intención por lunación: vínculos, dinero, cuerpo, voz, descanso o propósito.',
      'Podés asociar cada signo a un elemento y elegir prácticas acordes: fuego, agua, aire o tierra.',
      'Dejá esta card como puerta de entrada a futuras lecturas personalizadas por signo lunar.',
    ],
    journal:
      '¿Qué arquetipo pide expresarse hoy en mí y qué necesita para manifestarse con conciencia?',
    motivation:
      'El símbolo no viene a encerrarte: viene a darte un lenguaje para lo que todavía no sabés nombrar.',
  },
  {
    title: 'Cristales y rituales',
    shortTitle: 'Cristales',
    subtitle: 'Cargar, limpiar, enfocar y consagrar',
    tag: 'Ritual / simbólico',
    icon: Sparkles,
    summary:
      'Una zona dedicada a prácticas energéticas, piedras, agua lunar y pequeños rituales para quienes viven la Luna como altar, guía o compañía.',
    openingLine:
      'Acá la Luna aparece como contenedor de intención: no para prometer resultados mágicos, sino para dar forma a prácticas simbólicas con belleza, foco y presencia.',
    consultationTopics: [
      'Cuándo limpiar, cargar o consagrar piedras y objetos rituales.',
      'Qué tipo de práctica combina mejor con cada fase lunar.',
      'Cómo diseñar un altar o una ceremonia simple y sostenida.',
    ],
    watchouts: [
      'No reemplaces tratamiento, descanso o decisiones de salud por trabajo energético.',
      'La práctica ritual gana fuerza cuando es concreta y repetible.',
    ],
    scientific: [
      'La carga de cristales y objetos pertenece al terreno simbólico o espiritual, no a una eficacia médica comprobada.',
      'Puede tener valor emocional, contemplativo o ritual, siempre que no reemplace cuidados reales.',
      'La práctica funciona mejor cuando se la entiende como intención, foco y presencia.',
    ],
    mystical: [
      'La luna llena suele usarse para cargar piedras, agradecer y expandir una intención.',
      'La luna nueva se asocia con siembra, limpieza, altar y definición de deseo.',
      'Tarotistas y practicantes energéticos muchas veces combinan cristales, cartas, velas y journaling según la fase.',
    ],
    practices: [
      'Elegí una piedra, escribí tu intención y dejala acompañando una noche lunar significativa para vos.',
      'Podés crear agua lunar, altar, cartas guía o una práctica corporal breve según tu ritual.',
      'Usá esta información como consulta espiritual, no como promesa de curación física.',
    ],
    journal: '¿Qué intención quiero cargar, limpiar o consagrar en esta fase?',
    motivation:
      'El ritual no cambia la realidad por arte de magia: te cambia la forma de habitarla.',
  },
  {
    title: 'Mi registro',
    shortTitle: 'Registro',
    subtitle: 'Diario lunar, consulta y educación viva',
    tag: 'Portal personal',
    kind: 'journal',
    icon: MoonStar,
    summary:
      'El corazón del portal: una invitación a registrar lo que vivís y convertir esta web en una herramienta de consulta, educación, observación y motivación diaria.',
    openingLine:
      'Este espacio transforma la intuición en archivo: cada registro suma contexto para descubrir tus ritmos, anticipar momentos sensibles y sostener una práctica cotidiana.',
    consultationTopics: [
      'Cruzar fase lunar con ánimo, sueño, síntomas y energía.',
      'Detectar repeticiones a lo largo de varias semanas.',
      'Guardar material útil para sesiones, procesos creativos o lectura personal.',
    ],
    watchouts: [
      'Un registro sirve más cuando es simple y constante que cuando busca perfección.',
      'La autoobservación acompaña, pero no reemplaza atención profesional.',
    ],
    scientific: [
      'El seguimiento personal sirve para identificar patrones propios sin caer en generalizaciones rápidas.',
      'Registrar sueño, ánimo, dolor, energía y ciclo ayuda a distinguir percepción aislada de tendencia real.',
      'La autoobservación no reemplaza salud mental o médica, pero puede mejorar mucho tu autoconocimiento.',
    ],
    mystical: [
      'Desde una mirada esotérica, llevar un diario lunar fortalece intuición, sincronicidad y lectura de señales.',
      'Para tarotistas, yoguis y astrólogas, un registro sostenido permite ver cómo se mueve la energía en el tiempo.',
      'Este espacio puede volverse tu bitácora ritual y también tu archivo emocional.',
    ],
    practices: [
      'Registrá cada día: energía, descanso, emoción dominante, foco espiritual y síntoma corporal.',
      'Asociá una palabra del día, una carta, una práctica o una fase para volver sobre tus propios ritmos.',
      'Ahora este módulo guarda tu registro localmente en este navegador.',
    ],
    journal: '¿Qué patrón se repite en mí cuando escucho mi cuerpo con más honestidad?',
    motivation: 'Lo que registrás con amor deja de ser ruido: se convierte en mapa.',
  },
  {
    title: 'Motivación diaria',
    shortTitle: 'Motivación',
    subtitle: 'Mensajes para abrir el día desde la fase actual',
    tag: 'Portal personal',
    kind: 'motivation',
    icon: BookHeart,
    summary:
      'Una entrada diaria pensada para volver a la web cada mañana: una frase, una intención y una lectura breve según el tono del momento lunar.',
    openingLine:
      'Diseñada como un pequeño oráculo cotidiano: algo breve, bello y útil para orientar el día sin saturarlo de teoría ni solemnidad.',
    consultationTopics: [
      'Abrir el día con una intención clara y habitable.',
      'Usar la frase como mantra, inicio de tirada o foco de journaling.',
      'Encontrar una dirección simple cuando la energía está dispersa.',
    ],
    watchouts: [
      'La frase no tiene que pegar perfecto para ser útil.',
      'No la conviertas en exigencia: usala como ancla, no como mandato.',
    ],
    scientific: [
      'Una frase inspiradora no tiene evidencia médica por sí sola, pero puede funcionar como ancla de atención, pausa y foco emocional.',
      'Los rituales breves mejoran adherencia cuando se integran a una rutina cotidiana simple.',
      'La clave no es la frase perfecta, sino el hábito de volver a una pregunta significativa.',
    ],
    mystical: [
      'En lectura astral o energética, una intención breve puede alinear ritual, consulta y dirección del día.',
      'La frase diaria puede funcionar como mantra, semilla, carta guía o clave vibracional.',
      'Este módulo convierte la web en un pequeño oráculo cotidiano sin prometer certezas absolutas.',
    ],
    practices: [
      'Empezá el día leyendo una intención y cerralo revisando si tuvo sentido para vos.',
      'Ahora esta card cambia según la fase lunar del día consultado.',
      'Podés usarla como apertura de journal, tarot del día o mini ritual matinal.',
    ],
    journal: '¿Qué palabra quiero habitar hoy con coherencia, belleza y presencia?',
    motivation:
      'Tu día no necesita ser perfecto para estar bien guiado: necesita una intención que te devuelva al centro.',
  },
];

const emptyJournalState = {
  mood: '',
  energy: '3',
  sleep: '',
  sleepScore: '3',
  body: '',
  ritual: '',
  notes: '',
};

function Tag({ value }: { value: EvidenceTag }) {
  const styles: Record<EvidenceTag, string> = {
    Bienestar: 'bg-emerald-500/12 text-emerald-100 border-emerald-300/20',
    'Evidencia limitada': 'bg-amber-500/12 text-amber-100 border-amber-300/20',
    'Ritual / simbólico': 'bg-fuchsia-500/12 text-fuchsia-100 border-fuchsia-300/20',
    'Portal personal': 'bg-sky-500/12 text-sky-100 border-sky-300/20',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.18em] ${styles[value]}`}
    >
      {value}
    </span>
  );
}

function EditorialPanel({
  title,
  items,
  tone = 'default',
}: {
  title: string;
  items: string[];
  tone?: 'default' | 'glow';
}) {
  return (
    <section
      className={`rounded-[1.5rem] border p-5 ${
        tone === 'glow'
          ? 'border-fuchsia-300/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(217,70,239,0.08))]'
          : 'border-white/10 bg-white/[0.04]'
      }`}
    >
      <h5 className="mb-3 text-xs uppercase tracking-[0.22em] text-white/55">{title}</h5>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-fuchsia-300/80" />
            <p className="text-sm leading-relaxed text-white/82">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StandardContent({ card }: { card: PortalCard }) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <section className="rounded-[1.5rem] border border-emerald-300/16 bg-emerald-500/6 p-5">
          <h5 className="mb-3 text-xs uppercase tracking-[0.22em] text-emerald-100">
            Información y evidencia disponible
          </h5>
          <div className="space-y-3">
            {card.scientific.map((item) => (
              <p key={item} className="leading-relaxed text-white/82">
                {item}
              </p>
            ))}
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-fuchsia-300/16 bg-fuchsia-500/6 p-5">
          <h5 className="mb-3 text-xs uppercase tracking-[0.22em] text-fuchsia-100">
            Mirada esotérica, mística y astral
          </h5>
          <div className="space-y-3">
            {card.mystical.map((item) => (
              <p key={item} className="leading-relaxed text-white/82">
                {item}
              </p>
            ))}
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <EditorialPanel title="Cómo usar esta sección" items={card.practices} />

        <section className="rounded-[1.5rem] border border-sky-300/16 bg-sky-500/6 p-5">
          <h5 className="mb-3 text-xs uppercase tracking-[0.22em] text-sky-100">Prompt de journal</h5>
          <p className="text-lg leading-relaxed text-white/88">{card.journal}</p>
        </section>

        <section className="rounded-[1.5rem] border border-amber-300/16 bg-amber-500/6 p-5">
          <h5 className="mb-3 text-xs uppercase tracking-[0.22em] text-amber-100">Motivación diaria</h5>
          <p className="text-xl leading-tight text-white md:text-2xl font-display">{card.motivation}</p>
        </section>
      </div>
    </div>
  );
}

function MotivationContent({
  card,
  dailyGuidance,
  phaseName,
}: {
  card: PortalCard;
  dailyGuidance: ReturnType<typeof getPhaseDailyGuidance>;
  phaseName: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-6">
        <section className="rounded-[1.5rem] border border-emerald-300/16 bg-emerald-500/6 p-5">
          <h5 className="mb-3 text-xs uppercase tracking-[0.22em] text-emerald-100">
            Información y evidencia disponible
          </h5>
          <div className="space-y-3">
            {card.scientific.map((item) => (
              <p key={item} className="leading-relaxed text-white/82">
                {item}
              </p>
            ))}
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-fuchsia-300/16 bg-fuchsia-500/6 p-5">
          <h5 className="mb-3 text-xs uppercase tracking-[0.22em] text-fuchsia-100">
            Mirada esotérica, mística y astral
          </h5>
          <div className="space-y-3">
            {card.mystical.map((item) => (
              <p key={item} className="leading-relaxed text-white/82">
                {item}
              </p>
            ))}
          </div>
        </section>

        <EditorialPanel title="Cómo integrarlo en tu día" items={card.practices} />
      </div>

      <div className="space-y-6">
        <section className="rounded-[1.5rem] border border-amber-300/16 bg-amber-500/6 p-5">
          <h5 className="mb-3 text-xs uppercase tracking-[0.22em] text-amber-100">Motivación de hoy</h5>
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-white/55">
            {dailyGuidance.title} · {phaseName}
          </p>
          <p className="mb-4 text-2xl leading-tight text-white md:text-3xl font-display">
            {dailyGuidance.quote}
          </p>
          <p className="leading-relaxed text-white/78">{dailyGuidance.intention}</p>
        </section>

        <section className="rounded-[1.5rem] border border-sky-300/16 bg-sky-500/6 p-5">
          <h5 className="mb-3 text-xs uppercase tracking-[0.22em] text-sky-100">Prompt de journal</h5>
          <p className="text-lg leading-relaxed text-white/88">{card.journal}</p>
        </section>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
          <h5 className="mb-3 text-xs uppercase tracking-[0.22em] text-white/62">
            Motivación base de la categoría
          </h5>
          <p className="leading-relaxed text-white/82">{card.motivation}</p>
        </section>
      </div>
    </div>
  );
}

function JournalContent({
  card,
  currentEntry,
  selectedDate,
  phaseName,
  journalForm,
  setJournalForm,
  saveFeedback,
  saveJournalEntry,
  historyEntries,
  historyRange,
  setHistoryRange,
  averageEnergy,
  averageSleep,
}: {
  card: PortalCard;
  currentEntry: JournalEntry | undefined;
  selectedDate: Date;
  phaseName: string;
  journalForm: typeof emptyJournalState;
  setJournalForm: React.Dispatch<React.SetStateAction<typeof emptyJournalState>>;
  saveFeedback: string;
  saveJournalEntry: () => void;
  historyEntries: JournalEntry[];
  historyRange: '7d' | '30d' | 'all';
  setHistoryRange: React.Dispatch<React.SetStateAction<'7d' | '30d' | 'all'>>;
  averageEnergy: string | null;
  averageSleep: string | null;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-6">
        <section className="rounded-[1.5rem] border border-emerald-300/16 bg-emerald-500/6 p-5">
          <h5 className="mb-3 text-xs uppercase tracking-[0.22em] text-emerald-100">
            Información y evidencia disponible
          </h5>
          <div className="space-y-3">
            {card.scientific.map((item) => (
              <p key={item} className="leading-relaxed text-white/82">
                {item}
              </p>
            ))}
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-fuchsia-300/16 bg-fuchsia-500/6 p-5">
          <h5 className="mb-3 text-xs uppercase tracking-[0.22em] text-fuchsia-100">
            Mirada esotérica, mística y astral
          </h5>
          <div className="space-y-3">
            {card.mystical.map((item) => (
              <p key={item} className="leading-relaxed text-white/82">
                {item}
              </p>
            ))}
          </div>
        </section>

        <EditorialPanel title="Usos sugeridos en consulta o práctica" items={card.practices} />
      </div>

      <div className="space-y-6">
        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h5 className="mb-2 text-xs uppercase tracking-[0.22em] text-white/92">Registro real del día</h5>
              <p className="text-sm text-white/64">
                {format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: es })} · {phaseName}
              </p>
            </div>
            {currentEntry && (
              <span className="rounded-full border border-sky-300/20 bg-sky-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-sky-100">
                Guardado
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm text-white/70">Estado emocional</span>
              <input
                value={journalForm.mood}
                onChange={(event) => setJournalForm((prev) => ({ ...prev, mood: event.target.value }))}
                placeholder="Ej. sensible, clara, dispersa"
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/30"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm text-white/70">Energía del 1 al 5</span>
              <select
                value={journalForm.energy}
                onChange={(event) => setJournalForm((prev) => ({ ...prev, energy: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-300/30"
              >
                {['1', '2', '3', '4', '5'].map((value) => (
                  <option key={value} value={value} className="text-black">
                    {value}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm text-white/70">Calidad de sueño del 1 al 5</span>
              <select
                value={journalForm.sleepScore}
                onChange={(event) => setJournalForm((prev) => ({ ...prev, sleepScore: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-300/30"
              >
                {['1', '2', '3', '4', '5'].map((value) => (
                  <option key={value} value={value} className="text-black">
                    {value}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm text-white/70">Sueño</span>
              <input
                value={journalForm.sleep}
                onChange={(event) => setJournalForm((prev) => ({ ...prev, sleep: event.target.value }))}
                placeholder="Ej. profundo, cortado, soñé mucho"
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/30"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm text-white/70">Cuerpo / síntomas</span>
              <input
                value={journalForm.body}
                onChange={(event) => setJournalForm((prev) => ({ ...prev, body: event.target.value }))}
                placeholder="Ej. cansancio, dolor, liviandad, foco"
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/30"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm text-white/70">Ritual / carta / práctica</span>
              <input
                value={journalForm.ritual}
                onChange={(event) => setJournalForm((prev) => ({ ...prev, ritual: event.target.value }))}
                placeholder="Ej. tarot, meditación, yoga, cristal, respiración"
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/30"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm text-white/70">Notas</span>
              <textarea
                value={journalForm.notes}
                onChange={(event) => setJournalForm((prev) => ({ ...prev, notes: event.target.value }))}
                placeholder="Anotá lo que observaste hoy"
                rows={5}
                className="w-full resize-none rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/30"
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={saveJournalEntry}
              className="rounded-full bg-fuchsia-500 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-fuchsia-400"
            >
              Guardar registro
            </button>
            {saveFeedback && <p className="text-sm text-emerald-200">{saveFeedback}</p>}
          </div>

          {currentEntry && (
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/45">
              Último guardado: {format(new Date(currentEntry.savedAt), "d 'de' MMMM · HH:mm", { locale: es })}
            </p>
          )}
        </section>

        <section className="rounded-[1.5rem] border border-fuchsia-300/16 bg-fuchsia-500/6 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h5 className="mb-2 text-xs uppercase tracking-[0.22em] text-fuchsia-100">Vista histórica</h5>
              <p className="text-sm text-white/58">
                {historyEntries.length > 0
                  ? `${historyEntries.length} registro${historyEntries.length === 1 ? '' : 's'} guardado${historyEntries.length === 1 ? '' : 's'}`
                  : 'Todavía no hay historial guardado.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(['7d', '30d', 'all'] as const).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setHistoryRange(range)}
                  className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                    historyRange === range
                      ? 'border-fuchsia-200/30 bg-white/90 text-[#1b1127]'
                      : 'border-white/12 bg-black/15 text-white/68 hover:bg-white/10'
                  }`}
                >
                  {range === '7d' ? '7 días' : range === '30d' ? '30 días' : 'Todo'}
                </button>
              ))}
            </div>
          </div>

          {historyEntries.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/18 p-4">
                  <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-white/45">Energía media</p>
                  <p className="text-2xl text-white font-display">{averageEnergy ?? '-'}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/18 p-4">
                  <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-white/45">Sueño medio</p>
                  <p className="text-2xl text-white font-display">{averageSleep ?? '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">Energía</p>
                  {historyEntries.map((entry) => (
                    <div key={`${entry.savedAt}-energy`} className="flex items-center gap-3">
                      <div className="w-24 shrink-0 text-[11px] uppercase tracking-[0.16em] text-white/45">
                        {format(new Date(entry.date), 'd MMM', { locale: es })}
                      </div>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 via-sky-300 to-emerald-300"
                          style={{ width: `${(Number(entry.energy || 0) / 5) * 100}%` }}
                        />
                      </div>
                      <div className="w-8 text-right text-sm text-white/72">{entry.energy}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">Sueño</p>
                  {historyEntries.map((entry) => (
                    <div key={`${entry.savedAt}-sleep`} className="flex items-center gap-3">
                      <div className="w-24 shrink-0 text-[11px] uppercase tracking-[0.16em] text-white/45">
                        {format(new Date(entry.date), 'd MMM', { locale: es })}
                      </div>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-300 via-pink-300 to-fuchsia-300"
                          style={{ width: `${(Number(entry.sleepScore || 0) / 5) * 100}%` }}
                        />
                      </div>
                      <div className="w-8 text-right text-sm text-white/72">{entry.sleepScore ?? '-'}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {historyEntries.map((entry) => (
                  <div key={`${entry.savedAt}-details`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm font-medium text-white">
                        {format(new Date(entry.date), "d 'de' MMMM 'de' yyyy", { locale: es })}
                      </p>
                      <span className="text-[11px] uppercase tracking-[0.16em] text-white/50">
                        {entry.phaseName}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-sm text-white/74 md:grid-cols-2">
                      <p><span className="text-white/45">Estado:</span> {entry.mood || 'Sin dato'}</p>
                      <p><span className="text-white/45">Sueño:</span> {entry.sleep || 'Sin dato'}</p>
                      <p><span className="text-white/45">Calidad de sueño:</span> {entry.sleepScore || 'Sin dato'}</p>
                      <p><span className="text-white/45">Cuerpo:</span> {entry.body || 'Sin dato'}</p>
                      <p><span className="text-white/45">Ritual:</span> {entry.ritual || 'Sin dato'}</p>
                    </div>
                    {entry.notes && <p className="mt-3 text-sm leading-relaxed text-white/68">{entry.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="leading-relaxed text-white/60">
              Cuando guardes tus primeras entradas, vas a ver acá una pequeña línea de energía y una lista de notas recientes
              para empezar a reconocer tus propios patrones.
            </p>
          )}
        </section>

        <section className="rounded-[1.5rem] border border-sky-300/16 bg-sky-500/6 p-5">
          <h5 className="mb-3 text-xs uppercase tracking-[0.22em] text-sky-100">Prompt de journal</h5>
          <p className="text-lg leading-relaxed text-white/88">{card.journal}</p>
        </section>
      </div>
    </div>
  );
}

export function MoonWellbeingSection({ selectedDate, phaseName }: MoonWellbeingSectionProps) {
  const dateKey = useMemo(() => format(selectedDate, 'yyyy-MM-dd'), [selectedDate]);
  const [journalEntries, setJournalEntries] = useState<Record<string, JournalEntry>>({});
  const [journalForm, setJournalForm] = useState(emptyJournalState);
  const [saveFeedback, setSaveFeedback] = useState('');
  const [historyRange, setHistoryRange] = useState<'7d' | '30d' | 'all'>('30d');

  const dailyGuidance = useMemo(
    () => getPhaseDailyGuidance(phaseName, selectedDate),
    [phaseName, selectedDate],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, JournalEntry>;
        setJournalEntries(parsed);
      }
    } catch {
      setJournalEntries({});
    }
  }, []);

  useEffect(() => {
    const currentEntry = journalEntries[dateKey];
    if (currentEntry) {
      setJournalForm({
        mood: currentEntry.mood,
        energy: currentEntry.energy,
        sleep: currentEntry.sleep,
        sleepScore: currentEntry.sleepScore ?? '3',
        body: currentEntry.body,
        ritual: currentEntry.ritual,
        notes: currentEntry.notes,
      });
    } else {
      setJournalForm(emptyJournalState);
    }
    setSaveFeedback('');
  }, [dateKey, journalEntries]);

  const currentEntry = journalEntries[dateKey];

  const historyEntries = useMemo(() => {
    const now = new Date(selectedDate);
    const filtered = Object.values(journalEntries).filter((entry) => {
      if (historyRange === 'all') return true;
      const entryDate = new Date(entry.date);
      const diffInMs = now.getTime() - entryDate.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      return historyRange === '7d' ? diffInDays <= 7 : diffInDays <= 30;
    });

    return filtered
      .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
      .slice(0, 8);
  }, [journalEntries, historyRange, selectedDate]);

  const averageEnergy = useMemo(() => {
    if (historyEntries.length === 0) return null;
    const total = historyEntries.reduce((sum, entry) => sum + Number(entry.energy || 0), 0);
    return (total / historyEntries.length).toFixed(1);
  }, [historyEntries]);

  const averageSleep = useMemo(() => {
    if (historyEntries.length === 0) return null;
    const total = historyEntries.reduce((sum, entry) => sum + Number(entry.sleepScore || 0), 0);
    return (total / historyEntries.length).toFixed(1);
  }, [historyEntries]);

  const saveJournalEntry = () => {
    const nextEntry: JournalEntry = {
      date: dateKey,
      phaseName,
      mood: journalForm.mood,
      energy: journalForm.energy,
      sleep: journalForm.sleep,
      sleepScore: journalForm.sleepScore,
      body: journalForm.body,
      ritual: journalForm.ritual,
      notes: journalForm.notes,
      savedAt: new Date().toISOString(),
    };

    const nextEntries = {
      ...journalEntries,
      [dateKey]: nextEntry,
    };

    setJournalEntries(nextEntries);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEntries));
    }
    setSaveFeedback('Registro guardado en este navegador.');
  };

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[#0a0712]/88 shadow-[0_24px_90px_rgba(7,3,14,0.48)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_top_right,rgba(217,70,239,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(217,70,239,0.05)_55%,rgba(4,4,8,0.18))]" />
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-300/40 to-transparent" />

      <div className="relative px-5 py-8 md:px-8 md:py-10">
        <div className="mb-8 max-w-5xl">
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-fuchsia-100/65">Luna y bienestar</p>
          <h3 className="mb-4 text-4xl leading-[0.95] text-white md:text-5xl font-display">
            Un portal de consulta, educación, journal y motivación diaria bajo cada fase
          </h3>
          <p className="text-base leading-relaxed text-white/72 md:text-lg">
            Esta zona mezcla dos capas de lectura: una basada en evidencia disponible y otra simbólica, mística y astral.
            Está pensada para tarotistas, yoguis, astrólogas y para cualquier persona que quiera usar la Luna como guía
            cotidiana, sin confundir consulta espiritual con indicación médica.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <Dialog key={card.title}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="group relative overflow-hidden rounded-[999px] border border-white/12 bg-white/[0.05] px-5 py-4 text-left transition-all duration-300 hover:border-fuchsia-300/28 hover:bg-white/[0.08]"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_36%,rgba(217,70,239,0.06))]" />
                    <div className="relative flex items-center justify-between gap-4">
                      <h4 className="text-lg uppercase leading-none text-white md:text-xl font-display">
                        {card.shortTitle}
                      </h4>
                      <span className="text-[11px] uppercase tracking-[0.18em] text-fuchsia-100/60 transition-transform duration-300 group-hover:translate-x-1">
                        Abrir
                      </span>
                    </div>
                  </button>
                </DialogTrigger>

                <DialogContent className="max-w-[min(1100px,calc(100vw-2rem))] overflow-hidden rounded-[2rem] border-white/10 bg-[#09070f] p-0 text-white">
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_24%),radial-gradient(circle_at_top_right,rgba(217,70,239,0.12),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(217,70,239,0.04)_54%,rgba(0,0,0,0.14))]" />
                    <div className="relative max-h-[85vh] overflow-y-auto p-6 md:p-8">
                      <DialogHeader className="mb-6 pr-10">
                        <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(217,70,239,0.08)_56%,rgba(8,6,18,0.2))] p-5 md:p-6">
                          <div className="mb-4 flex flex-wrap items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/25 text-white">
                              <Icon className="h-5 w-5" />
                            </div>
                            <Tag value={card.tag} />
                            <span className="text-xs uppercase tracking-[0.2em] text-white/45">Portal lunar</span>
                          </div>
                          <DialogTitle className="text-4xl uppercase leading-[0.95] text-white md:text-5xl font-display">
                            {card.title}
                          </DialogTitle>
                          <DialogDescription className="mt-3 text-base leading-relaxed text-white/70 md:text-lg">
                            {card.summary}
                          </DialogDescription>
                          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80 md:text-base">
                            {card.openingLine}
                          </p>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                          <EditorialPanel title="Ideal para consultar" items={card.consultationTopics} tone="glow" />
                          <EditorialPanel title="Conviene tener presente" items={card.watchouts} />
                        </div>
                      </DialogHeader>

                      {card.kind === 'journal' ? (
                        <JournalContent
                          card={card}
                          currentEntry={currentEntry}
                          selectedDate={selectedDate}
                          phaseName={phaseName}
                          journalForm={journalForm}
                          setJournalForm={setJournalForm}
                          saveFeedback={saveFeedback}
                          saveJournalEntry={saveJournalEntry}
                          historyEntries={historyEntries}
                          historyRange={historyRange}
                          setHistoryRange={setHistoryRange}
                          averageEnergy={averageEnergy}
                          averageSleep={averageSleep}
                        />
                      ) : card.kind === 'motivation' ? (
                        <MotivationContent card={card} dailyGuidance={dailyGuidance} phaseName={phaseName} />
                      ) : (
                        <StandardContent card={card} />
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      </div>
    </section>
  );
}
