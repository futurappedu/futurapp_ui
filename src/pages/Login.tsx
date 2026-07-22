import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { Search, Award, type LucideIcon } from 'lucide-react';

const SEARCH_PAIS_KEY = 'search_pais';
const SEARCH_PROGRAMA_KEY = 'search_programa';

const FEATURE_BULLETS: Array<{ icon: LucideIcon; title: string; description: string }> = [
  {
    icon: Search,
    title: 'Explora programas universitarios',
    description:
      'Busca entre programas de universidades en distintos países y compara sus planes de estudio.',
  },
  {
    icon: Award,
    title: 'Encuentra becas a tu medida',
    description: 'Cruzamos tu perfil con becas disponibles para descubrir cuáles se ajustan a ti.',
  },
];

const Login: React.FC = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  // Save campaign search params (pais/programa) to sessionStorage before
  // Auth0's redirect clears the URL — the query string won't survive the
  // login round-trip otherwise (Auth0's redirect_uri is bare origin).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pais = params.get('pais');
    const programa = params.get('programa');
    if (pais) sessionStorage.setItem(SEARCH_PAIS_KEY, pais);
    if (programa) sessionStorage.setItem(SEARCH_PROGRAMA_KEY, programa);
  }, []);

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    const hasSearchParams =
      sessionStorage.getItem(SEARCH_PAIS_KEY) !== null ||
      sessionStorage.getItem(SEARCH_PROGRAMA_KEY) !== null;

    // If user is already authenticated, redirect to test_home,
    // unless a campaign search link is pending — then go to the search page.
    navigate(hasSearchParams ? '/scholarship_search' : '/test_home');
  }, [isAuthenticated, isLoading, navigate]);

  // Show a spinner instead of the button while Auth0 is loading or while an
  // already-authenticated user is about to be redirected away.
  const showSpinner = isLoading || isAuthenticated;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Brand panel — hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between bg-brand-deep text-brand-deep-foreground p-10 lg:p-14">
        <img src="/logo.jpeg" alt="UniMatch by ILearning" className="h-12 w-auto rounded-md" />

        <div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            Descubre tu carrera profesional ideal
            <span className="text-brand-accent italic font-medium">.</span>
          </h1>
          <p className="mt-4 text-white/60 max-w-md leading-relaxed">
            Recomendaciones personalizadas, impulsadas por IA, para encontrar la universidad y la
            carrera que mejor encajan contigo.
          </p>

          <div className="mt-10 space-y-5">
            {FEATURE_BULLETS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Icon className="size-5 text-brand-accent" strokeWidth={2} />
                </div>
                <div>
                  <p className="font-display font-bold text-sm">{title}</p>
                  <p className="text-xs text-white/60 mt-1 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">
          © 2024 UniMatch by ILearning
        </p>
      </div>

      {/* Login card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <img
            src="/logo.jpeg"
            alt="UniMatch by ILearning"
            className="h-10 w-auto rounded-md mb-8 md:hidden"
          />

          <div className="bg-surface border border-border rounded-3xl shadow-card p-8">
            <h2 className="font-display text-2xl font-bold text-foreground">Bienvenido a UniMatch</h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Inicia sesión para acceder a tu recomendador de carreras y universidades.
            </p>

            <div className="mt-6">
              {showSpinner ? (
                <div className="w-full py-3 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-accent" />
                </div>
              ) : (
                <button
                  onClick={() => loginWithRedirect()}
                  className="w-full py-3 bg-brand-accent text-brand-accent-foreground text-sm font-bold rounded-full hover:opacity-90 transition-opacity"
                >
                  Iniciar sesión
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
