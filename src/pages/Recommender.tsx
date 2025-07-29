import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Download, User, Brain, Target, TrendingUp, Briefcase, ArrowRight, BarChart } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./Logout";
import { useNavigate, Link } from "react-router-dom";
import { PDFDownloadLink } from '@react-pdf/renderer';
import ScoreReport from '@/components/ScoreReport';

interface Recommendations {
  interests: Array<{
    Compatibilidad: number;
    "Intereses Profesionales": string;
    Razon: string;
  }>;
  recommendations: Array<{
    "Campo de Estudio": string;
    Compatibilidad: number;
    Razon: string;
  }>;
  university_recommendations: Array<{
    "Campo de Estudio": string;
    "Recomendacion Uno": string;
    "Recomendacion Dos": string;
    "Recomendacion Tres": string;
  }>;
}

function Recommender() {
  const { user, getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  const [skills, setSkills] = useState({
    mechanical_reasoning: 0,
    numerical_aptitude: 0,
    spatial_aptitude: 0,
    logical_reasoning: 0,
    verbal_aptitude: 0,
  });

  const [preferences, setPreferences] = useState({
    Realista: 0,
    Investigador: 0,
    Artistico: 0,
    Social: 0,
    Convencional: 0,
    emprendedor: 0,
  });

  const [results, setResults] = useState<Recommendations | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingSkills, setLoadingSkills] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { returnTo: '/career_recommender' } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Fetch skills from backend using user email
  useEffect(() => {
    const fetchSkills = async () => {
      if (!user?.email) return;
      setLoadingSkills(true);
      try {
        const response = await fetch(
          "https://futurappapi-staging.up.railway.app/all-scores",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: user.email }),
          }
        );
        if (!response.ok) throw new Error("No se pudieron obtener las habilidades.");
        const data = await response.json();
        setSkills({
          mechanical_reasoning: data.mechanical ?? 0,
          numerical_aptitude: data.numeric ?? 0,
          spatial_aptitude: data.spatial ?? 0,
          logical_reasoning: data.abstract ?? 0,
          verbal_aptitude: data.verbal ?? 0
        });
        setPreferences({
          Realista: data.Realista ?? 0,
          Convencional: data.Convencional ?? 0,
          Investigador: data.Investigativo ?? 0, 
          Artistico: data.Artistico ?? 0,
          Social: data.Social ?? 0,
          emprendedor: data.Emprendedor ?? 0,
        });
      } catch (err) {
        setError("No se pudieron obtener las habilidades del usuario.");
      } finally {
        setLoadingSkills(false);
      }
    };
    fetchSkills();
  }, [user?.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        "https://futurappapi-staging.up.railway.app/recommendations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ skills, preferences, email: user?.email || 'anonymous' }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch recommendations. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const SkillBar = ({ label, value, icon: Icon }: { label: string; value: number; icon: any }) => (
    <div className="group hover:bg-gray-50 dark:hover:bg-gray-700 p-4 rounded-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-primary" />
          <Label className="font-medium text-gray-900 dark:text-gray-100">{label}</Label>
        </div>
        <span className="font-bold text-xl text-gray-900 dark:text-gray-100">{value}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  const PersonalityBar = ({ label, value }: { label: string; value: number }) => (
    <div className="group hover:bg-gray-50 dark:hover:bg-gray-700 p-4 rounded-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <Label className="font-medium text-gray-900 dark:text-gray-100">{label}</Label>
        <span className="font-bold text-xl text-gray-900 dark:text-gray-100">{value}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  if (isLoading || loadingSkills) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="px-4 lg:px-6 h-16 flex items-center border-b">
          <Link className="flex items-center justify-center" to="/">
            <Briefcase className="h-6 w-6 mr-2" />
            <span className="font-bold">Futurapp</span>
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-xl text-gray-600 dark:text-gray-400">Cargando tus perspectivas profesionales...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header matching home page */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" to="/">
          <Briefcase className="h-6 w-6 mr-2" />
          <span className="font-bold">Futurapp</span>
        </Link>
        <div className="ml-auto">
          {isAuthenticated && <LogoutButton />}
        </div>
      </header>

      <main className="flex-1">
        {/* Assessment Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Tu Perfil de Evaluación
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Skills Card */}
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3">
                    <Brain className="w-6 h-6 text-primary" />
                    <div>
                      <CardTitle className="text-2xl">Habilidades Cognitivas</CardTitle>
                      <p className="text-gray-500 dark:text-gray-400">Tus capacidades intelectuales</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <SkillBar label="Razonamiento Mecánico" value={skills.mechanical_reasoning} icon={Target} />
                  <SkillBar label="Aptitud Numérica" value={skills.numerical_aptitude} icon={BarChart} />
                  <SkillBar label="Aptitud Espacial" value={skills.spatial_aptitude} icon={Brain} />
                  <SkillBar label="Razonamiento Lógico" value={skills.logical_reasoning} icon={Target} />
                  <SkillBar label="Aptitud Verbal" value={skills.verbal_aptitude} icon={TrendingUp} />
                </CardContent>
              </Card>

              {/* Personality Card */}
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3">
                    <User className="w-6 h-6 text-primary" />
                    <div>
                      <CardTitle className="text-2xl">Personalidad RIASEC</CardTitle>
                      <p className="text-gray-500 dark:text-gray-400">Tus intereses profesionales</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <PersonalityBar label="Realista" value={preferences.Realista} />
                  <PersonalityBar label="Investigador" value={preferences.Investigador} />
                  <PersonalityBar label="Artístico" value={preferences.Artistico} />
                  <PersonalityBar label="Social" value={preferences.Social} />
                  <PersonalityBar label="Convencional" value={preferences.Convencional} />
                  <PersonalityBar label="Emprendedor" value={preferences.emprendedor} />
                </CardContent>
              </Card>
            </div>

            {/* Generate Button */}
            <div className="text-center">
              <Button 
                onClick={handleSubmit}
                size="lg"
                className="w-full max-w-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generando Tu Futuro...
                  </div>
                ) : (
                  <>
                    Generar Recomendaciones de Carrera
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>

        {error && (
          <section className="w-full py-6">
            <div className="container px-4 md:px-6">
              <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg text-center">
                <p className="font-medium">{error}</p>
              </div>
            </div>
          </section>
        )}

        {results && (
          <>
            {/* PDF Download Section */}
            <section className="w-full py-12">
              <div className="container px-4 md:px-6 text-center">
                {(() => {
                  const reportProps = {
                    userData: user,
                    skills: {
                      verbal: skills.verbal_aptitude,
                      abstracto: skills.logical_reasoning,
                      numerico: skills.numerical_aptitude,
                      mecanico: skills.mechanical_reasoning,
                      espacial: skills.spatial_aptitude
                    },
                    preferences,
                    interests: results.interests,
                    recommendations: results.recommendations,
                    universityRecommendations: results.university_recommendations
                  };
                  return (
                    <PDFDownloadLink
                      document={<ScoreReport {...reportProps} />}
                      fileName={`score-report-${user?.email || 'usuario'}.pdf`}
                      className="inline-block"
                    >
                      {({ loading }) =>
                        loading ? (
                          <Button disabled className="bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Generando PDF...
                          </Button>
                        ) : (
                          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                            <Download className="w-5 h-5 mr-2" />
                            Descargar Reporte PDF
                          </Button>
                        )
                      }
                    </PDFDownloadLink>
                  );
                })()}
              </div>
            </section>

            {/* Career Recommendations */}
            {results.recommendations && results.recommendations.length > 0 && (
              <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                    Recomendaciones de Carrera
                  </h2>
                  <div className="grid gap-6 max-w-4xl mx-auto">
                    {results.recommendations.map((item, index) => (
                      <Card key={index} className="border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <Target className="w-6 h-6 text-primary" />
                            <h3 className="text-xl font-bold">{item["Campo de Estudio"]}</h3>
                          </div>
                          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                            {item.Compatibilidad}% Compatible
                          </div>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{item["Razon"]}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Professional Interests */}
            {results.interests && results.interests.length > 0 && (
              <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
                <div className="container px-4 md:px-6">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                    Intereses Profesionales
                  </h2>
                  <div className="grid gap-6 max-w-4xl mx-auto">
                    {results.interests.map((item, index) => (
                      <Card key={index} className="border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <Brain className="w-6 h-6 text-primary" />
                            <h3 className="text-xl font-bold">{item["Intereses Profesionales"]}</h3>
                          </div>
                          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                            {item.Compatibilidad}% Compatible
                          </div>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{item["Razon"]}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              </section>
            )}

             {/* University Recommendations */}
            {results.university_recommendations && results.university_recommendations.length > 0 && (
              <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                    Recomendaciones Universitarias
                  </h2>
                  <div className="max-w-6xl mx-auto">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-gray-800">
                            <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-bold">
                              Campo de Estudio
                            </th>
                            <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-bold">
                              Programa
                            </th>
                            <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-bold">
                              Universidad
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.university_recommendations.map((item, index) => {
                            // Parse the university recommendations to extract university and program info
                            const recommendations = [
                              item["Recomendacion Uno"],
                              item["Recomendacion Dos"],
                              item["Recomendacion Tres"]
                            ];
                            
                            return recommendations.map((rec, recIndex) => {
                              // Split by "Universidad:" and "Carrera:" to extract data
                              const parts = rec.split(/Universidad:|Carrera:/);
                              const universidad = parts[1]?.split('-')[0]?.trim() || '';
                              const programa = parts[2]?.trim() || rec;
                              
                              return (
                                <tr key={`${index}-${recIndex}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  {recIndex === 0 && (
                                    <td 
                                      className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium bg-yellow-100 dark:bg-yellow-900/20"
                                      rowSpan={recommendations.length}
                                    >
                                      {item["Campo de Estudio"]}
                                    </td>
                                  )}
                                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                                    {programa}
                                  </td>
                                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                                    {universidad}
                                  </td>
                                </tr>
                              );
                            });
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* CTA Section */}
            <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                      ¿Listo para Comenzar tu Carrera Ideal?
                    </h2>
                    <p className="mx-auto max-w-[600px] text-primary-foreground/90 md:text-xl">
                      Toma acción basada en tus recomendaciones personalizadas y comienza tu viaje profesional.
                    </p>
                  </div>
                  <Link to="/">
                    <Button
                      className="bg-background text-primary hover:bg-background/90"
                      size="lg"
                    >
                      Explorar Más Recursos
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer matching home page */}
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

export default Recommender;