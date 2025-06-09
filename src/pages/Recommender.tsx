import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./Logout";
import { useNavigate } from "react-router-dom";

interface Recommendations {
  preferences_recommendations: Array<{
    "Campo de Estudio": string;
    Razon: string;
  }>;
  skills_recommendations: Array<{ "Campo de Estudio": string; Razon: string }>;
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
    abstract_reasoning: 0,
    verbal_aptitude: 0,
  });

  const [preferences, setPreferences] = useState({
    realista: 0,
    investigativo: 0,
    artistico: 0,
    social: 0,
    convencional: 0,
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
          abstract_reasoning: data.abstract ?? 0,
          verbal_aptitude: data.verbal ?? 0
        });
        setPreferences({
          realista: data.Realista ?? 0,
          convencional: data.Convencional ?? 0,
          investigativo: data.Investigativo ?? 0, 
          artistico: data.Artistico ?? 0,
          social: data.Social ?? 0,
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
        "https://futurappapi-production.up.railway.app/recommendations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ skills, preferences }),
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

  if (isLoading || loadingSkills) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Futurapp: Career Recommender</h1>
        {isAuthenticated && <LogoutButton />}
      </div>
     
      <Card>
        <CardHeader>
          <CardTitle>Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Skills</h2>
              <div className="mb-4">
                {Object.entries(skills).map(([key, value]: [string, number]) => (
                  <div key={key} className="flex justify-between items-center mb-2">
                    <Label className="capitalize">{key.replace("_", " ")}</Label>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
                <h2 className="text-lg font-semibold mt-6 mb-2">Riasec: Test Personalidad</h2>
                <div className="mb-4">
                {Object.entries(preferences).map(([key, value]: [string, number]) => (
                  <div key={key} className="flex justify-between items-center mb-2">
                    <Label className="capitalize">{key}</Label>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Generating..." : "Generate Recommendations"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">{error}</div>
      )}

      {results && (
        <div className="mt-6 space-y-6">
          {/* Preferences Recommendations Table */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr>
                    <th>Campo de Estudio</th>
                    <th>Razón</th>
                  </tr>
                </thead>
                <tbody>
                  {results.preferences_recommendations.map((item, index) => (
                    <tr key={index}>
                      <td className="border p-2">{item["Campo de Estudio"]}</td>
                      <td className="border p-2">{item["Razon"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Skills Recommendations Table */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr>
                    <th>Campo de Estudio</th>
                    <th>Razón</th>
                  </tr>
                </thead>
                <tbody>
                  {results.skills_recommendations.map((item, index) => (
                    <tr key={index}>
                      <td className="border p-2">{item["Campo de Estudio"]}</td>
                      <td className="border p-2">{item["Razon"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* University Recommendations Table */}
          <Card>
            <CardHeader>
              <CardTitle>University Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr>
                    <th>Campo de Estudio</th>
                    <th>Recomendación Uno</th>
                    <th>Recomendación Dos</th>
                    <th>Recomendación Tres</th>
                  </tr>
                </thead>
                <tbody>
                  {results.university_recommendations.map((item, index) => (
                    <tr key={index}>
                      <td className="border p-2">{item["Campo de Estudio"]}</td>
                      <td className="border p-2">
                        {item["Recomendacion Uno"]}
                      </td>
                      <td className="border p-2">
                        {item["Recomendacion Dos"]}
                      </td>
                      <td className="border p-2">
                        {item["Recomendacion Tres"]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Recommender;