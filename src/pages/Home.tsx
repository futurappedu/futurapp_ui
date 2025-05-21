import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart, BookOpen, Briefcase, Users } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";

export default function Home() {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated, loginWithRedirect } = useAuth0();
  const [loading, setLoading] = useState(false);


  const handleStart = async () => {

     // If not authenticated, force login first
     if (!isAuthenticated) {
      await loginWithRedirect({ appState: { returnTo: "/" } });
      return;
    }
    if (!user?.email) return;
    
    setLoading(true);
    try {
      const res = await fetch("https://futurappapi-staging.up.railway.app/check-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (data.completed) {
        navigate("/test_home");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      // fallback: go to profile if error
      navigate("/profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <Link className="flex items-center justify-center" to="#">
          <Briefcase className="h-6 w-6 mr-2" />
          <span className="font-bold">Futurapp</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/login"
            state={{ returnTo: "/test_home" }}
          >
            Test
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 flex flex-col items-center">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Descubre Tu Carrera Profesional Ideal
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Desbloquea tu potencial con recomendaciones de carrera
                  personalizadas, impulsadas por IA y expertos de la industria.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-4">
              <Button
                type="button"
                size="lg"
                className="w-full"
                onClick={handleStart}
                disabled={loading || isLoading}
    >
      {loading || isLoading ? "Verificando..." : "Comenzar"}
        <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Inicia tu viaje hoy. No se requiere tarjeta de crédito.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              ¿Por qué elegir Futurapp?
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <BarChart className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Insights Basados en Datos</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Aprovecha el big data y la IA para obtener recomendaciones
                  precisas de carrera.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Users className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Orientación de Expertos</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Accede a consejos de profesionales de la industria y coaches
                  de carrera.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <BookOpen className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">
                  Rutas de Aprendizaje Personalizadas
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Obtén planes de desarrollo de habilidades personalizados para
                  alcanzar tus metas profesionales.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Lo que Dicen Nuestros Usuarios
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col items-center space-y-2 border border-gray-200 p-6 rounded-lg"
                >
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      "Futurapp me ayudó a descubrir una carrera que nunca antes
                      había considerado. ¡Ahora estoy prosperando en un trabajo
                      que amo!"
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="rounded-full bg-gray-300 w-8 h-8" />
                      <div>
                        <p className="text-sm font-medium">María García</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Ingeniera de Software
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  ¿Listo para Encontrar tu Carrera Ideal?
                </h2>
                <p className="mx-auto max-w-[600px] text-primary-foreground/90 md:text-xl">
                  Únete a miles de profesionales que han encontrado su carrera
                  perfecta con Futurapp.
                </p>
              </div>
              <Button
                className="bg-background text-primary hover:bg-background/90"
                size="lg"
                onClick={() => navigate("/career_recommender")}
              >
                Inicia Tu Viaje
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Futurapp. Todos los derechos reservados.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Términos de Servicio
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Privacidad
          </Link>
        </nav>
      </footer>
    </div>
  );
}
