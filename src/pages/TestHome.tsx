import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Sparkles,
  GraduationCap,
  Briefcase,
  Wallet,
  Lock,
  Award,
  ArrowRight,
  Calendar,
  FileCheck,
} from 'lucide-react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { PillarCard, type PillarStatus } from '@/components/dashboard/PillarCard';
import { MatchCard } from '@/components/dashboard/MatchCard';
import { DashboardShortlist } from '@/components/dashboard/DashboardShortlist';
import { API_BASE_URL } from '@/config/api';

const JOURNEY_STEPS = [
  { n: '01', t: 'Explorar', s: '4 pilares · en progreso', active: true },
  { n: '02', t: 'Shortlist', s: 'Define 5 universidades', active: false },
  { n: '03', t: 'Aplicar', s: 'Documentos y deadlines', active: false },
];

const PLACEHOLDER_MATCHES = [
  {
    country: 'Reino Unido · Edimburgo',
    name: 'University of Edinburgh',
    score: 94,
    description:
      'Excelente compatibilidad con tu perfil académico y tus intereses. Campus histórico con fuerte vida estudiantil internacional.',
    tags: ['Beca · Global Study', 'Top 20 mundial'],
  },
  {
    country: 'Estados Unidos · Boston',
    name: 'Northeastern University',
    score: 88,
    description:
      'Tu experiencia ideal de ciudad y tus metas de pasantías encajan perfectamente con su modelo experiencial.',
    tags: ['Programa Co-op', 'Inglés requerido: TOEFL 90'],
  },
  {
    country: 'España · Madrid',
    name: 'IE University',
    score: 82,
    description:
      'Match sólido para tu perfil de negocios y diseño. Programa en español + inglés y red latinoamericana fuerte.',
    tags: ['En español', 'Beca mérito 30%'],
  },
];

export default function TestHome() {
  const { user } = useAuth0();
  const navigate = useNavigate();

  const [personalityDone, setPersonalityDone] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user?.email) return;
    fetch(`${API_BASE_URL}/scores-tests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, testType: 'Realista' }),
    })
      .then((r) => r.json())
      .then((data) => setPersonalityDone(data.completed === true))
      .catch(() => setPersonalityDone(false));
  }, [user?.email]);

  const firstName = user?.given_name ?? user?.name?.split(' ')[0] ?? 'Estudiante';
  const fullName = user?.name ?? 'Estudiante';
  const completionPercent = personalityDone ? 25 : 0;

  const pillar3Status: PillarStatus = personalityDone === null ? 'locked' : personalityDone ? 'done' : 'next';

  const pillars: Array<{
    icon: typeof Sparkles;
    iconBg: string;
    iconColor: string;
    title: string;
    description: string;
    progress: number;
    status: PillarStatus;
    onAction?: () => void;
  }> = [
    {
      icon: Sparkles,
      iconBg: 'hsl(262 83% 95%)',
      iconColor: 'hsl(var(--brand-accent))',
      title: 'Experiencia universitaria',
      description: 'Estilo de campus, ciudad, clima y vida social.',
      progress: 0,
      status: 'locked',
    },
    {
      icon: GraduationCap,
      iconBg: 'hsl(162 84% 95%)',
      iconColor: 'hsl(162 60% 35%)',
      title: 'Perfil académico',
      description: 'GPA, nivel de inglés y exámenes presentados.',
      progress: 0,
      status: 'locked',
    },
    {
      icon: Briefcase,
      iconBg: 'hsl(38 92% 93%)',
      iconColor: 'hsl(38 70% 40%)',
      title: 'Elección de carrera',
      description: 'Vocación, áreas de interés y metas profesionales.',
      progress: pillar3Status === 'done' ? 100 : 0,
      status: pillar3Status,
      onAction: () => navigate('/personality_test'),
    },
    {
      icon: Wallet,
      iconBg: 'hsl(var(--surface-muted))',
      iconColor: 'hsl(220 9% 46%)',
      title: 'Futuro y presupuesto',
      description: 'Costos, becas y retorno post graduación.',
      progress: 0,
      status: 'locked',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <DashboardSidebar userName={fullName} completionPercent={completionPercent} />

      <main className="flex-1 min-w-0 overflow-auto">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10">

          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-2">
                Expediente · Generación 2026
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                Hola, {firstName}
                <span className="text-brand-accent italic font-medium">.</span>
              </h1>
              <p className="text-muted-foreground mt-2 max-w-xl">
                Estamos construyendo tu camino hacia la universidad ideal. Un pilar a la vez.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className="px-4 py-2 border border-border rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
                Guía para padres
              </button>
              <button
                onClick={() => navigate('/personality_test')}
                className="px-4 py-2 bg-brand-deep text-brand-deep-foreground rounded-full text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                Continuar quiz
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </header>

          {/* Journey stages */}
          <section className="mb-12">
            <ol className="grid grid-cols-3 gap-3">
              {JOURNEY_STEPS.map((step, i) => (
                <li
                  key={step.n}
                  className={[
                    'relative rounded-2xl px-5 py-4 border transition-colors',
                    step.active
                      ? 'bg-brand-deep text-brand-deep-foreground border-brand-deep'
                      : 'bg-surface border-border text-muted-foreground',
                  ].join(' ')}
                >
                  <div className="flex items-baseline justify-between">
                    <span
                      className={[
                        'font-mono text-[11px] font-bold tabular-nums',
                        step.active ? 'text-white/60' : 'text-muted-foreground',
                      ].join(' ')}
                    >
                      {step.n}
                    </span>
                    {!step.active && i > 0 && <Lock className="size-3" />}
                  </div>
                  <p className="font-display font-bold text-base mt-1">{step.t}</p>
                  <p className={['text-[11px] mt-0.5', step.active ? 'text-white/60' : ''].join(' ')}>
                    {step.s}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* Pillar cards */}
          <section className="mb-12">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Etapa 01 · Exploración
                </p>
                <h2 className="font-display text-2xl font-bold mt-1">Tus 4 pilares</h2>
              </div>
              <p className="text-xs text-muted-foreground hidden md:block max-w-xs text-right">
                Completa los 4 para revelar tu{' '}
                <span className="font-bold text-foreground">SUPER Match</span> y desbloquear becas.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {pillars.map((p) => (
                <PillarCard key={p.title} {...p} />
              ))}
            </div>
          </section>

          {/* Main content: matches + shortlist */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <section className="xl:col-span-8 space-y-6">

              {/* SUPER Match banner */}
              <div className="relative overflow-hidden bg-brand-deep text-brand-deep-foreground rounded-3xl p-6 md:p-8">
                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                      Algoritmo predictivo
                    </p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-display text-6xl md:text-7xl font-extrabold tracking-tighter tabular-nums">
                        —
                      </span>
                      <span className="font-mono text-xl text-white/50">/100</span>
                    </div>
                    <h3 className="font-display text-2xl font-bold mt-3">SUPER Match</h3>
                    <p className="text-sm text-white/60 mt-1 max-w-md leading-relaxed">
                      Completa los 4 pilares para activar el algoritmo de compatibilidad y descubrir
                      tus universidades ideales.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/career_recommender')}
                    className="bg-brand-accent text-brand-accent-foreground px-5 py-2.5 rounded-full text-sm font-bold inline-flex items-center gap-2 hover:opacity-90 transition-opacity self-start md:self-end"
                  >
                    Ver recomendador IA <ArrowRight className="size-4" />
                  </button>
                </div>
                <div className="absolute -right-16 -top-16 size-64 bg-brand-accent/30 blur-3xl rounded-full" />
              </div>

              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold">Tus matches actuales</h2>
                <button
                  onClick={() => navigate('/scholarship_search')}
                  className="text-xs font-bold text-brand-accent hover:underline inline-flex items-center gap-1"
                >
                  Ver todos los resultados <ArrowRight className="size-3" />
                </button>
              </div>

              <div className="space-y-4">
                {PLACEHOLDER_MATCHES.map((m) => (
                  <MatchCard
                    key={m.name}
                    country={m.country}
                    name={m.name}
                    score={m.score}
                    description={m.description}
                    tags={m.tags}
                    primaryAction="Explorar"
                    onPrimaryAction={() => navigate('/scholarship_search')}
                    secondaryAction="Añadir a shortlist"
                  />
                ))}
              </div>

              {/* Locked becas section */}
              <div className="relative mt-8">
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      Etapa 01 · Bonus
                    </p>
                    <h2 className="font-display text-xl font-bold mt-1">Becas elegibles</h2>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-gray-100 text-muted-foreground inline-flex items-center gap-1">
                    <Lock className="size-3" /> Bloqueado
                  </span>
                </div>
                <div className="relative rounded-2xl border border-dashed border-border bg-surface-muted overflow-hidden">
                  <div className="grid grid-cols-2 gap-3 p-5 blur-[3px] opacity-50 pointer-events-none select-none">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-surface rounded-xl p-4 h-24 border border-border">
                        <Award className="size-5 text-brand-accent mb-2" />
                        <div className="h-2 bg-gray-100 rounded w-3/4 mb-2" />
                        <div className="h-2 bg-gray-100 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <div className="size-10 rounded-full bg-surface shadow-card flex items-center justify-center mb-3 border border-border">
                      <Lock className="size-4 text-brand-accent" />
                    </div>
                    <p className="text-sm font-bold">Completa los 4 pilares para ver tus becas</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                      Cruzamos tu perfil con cientos de becas en Europa, UK y EE.UU.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Right aside: shortlist + applications */}
            <aside className="xl:col-span-4 space-y-6">
              <DashboardShortlist />

              <div className="bg-surface border border-dashed border-border rounded-3xl p-6 opacity-90">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs font-bold text-muted-foreground">03.</span>
                  <h3 className="font-display text-lg font-bold text-muted-foreground">Aplicaciones</h3>
                  <Lock className="ml-auto size-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Cuando confirmes tu shortlist, aquí verás los documentos y deadlines de cada universidad.
                </p>
                <ul className="space-y-2">
                  {[
                    { icon: FileCheck, label: 'Carta de motivación' },
                    { icon: FileCheck, label: 'Notas y traducciones oficiales' },
                    { icon: Calendar, label: 'Calendario unificado' },
                  ].map(({ icon: Icon, label }) => (
                    <li
                      key={label}
                      className="flex items-center gap-3 p-2.5 bg-surface-muted rounded-lg text-xs text-muted-foreground"
                    >
                      <Icon className="size-4 shrink-0" />
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
