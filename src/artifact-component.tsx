import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from './Logout'; // ✅ Import Logout Button

interface Recommendations {
  preferences_recommendations: Array<{ "Campo de Estudio": string; "Razon": string; }>;
  skills_recommendations: Array<{ "Campo de Estudio": string; "Razon": string; }>;
  university_recommendations: Array<{ "Campo de Estudio": string; "Recomendacion Uno": string; "Recomendacion Dos": string; "Recomendacion Tres": string; }>;
}

function App() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0(); // ✅ Check auth state

  const [skills, setSkills] = useState({
    mechanical_reasoning: 0,
    numerical_aptitude: 0,
    spatial_aptitude: 0,
    logical_reasoning: 0,
    verbal_aptitude: 0,
  });

  const [preferences, setPreferences] = useState({
    commercial: 0,
    legal: 0,
    scientific: 0,
    humanities_social: 0,
    security: 0,
    communication: 0,
    environmental: 0,
    technology: 0,
    hospitality_tourism: 0,
    mechanical: 0,
    artistic: 0,
    health: 0,
    pedagogy: 0,
  });

  const [results, setResults] = useState<Recommendations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSkillChange = (key: string, value: number[]) => {
    setSkills(prev => ({ ...prev, [key]: value[0] }));
  };

  const handlePreferenceChange = (key: string, value: number[]) => {
    setPreferences(prev => ({ ...prev, [key]: value[0] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch('http://localhost:5000/generate_recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ skills, preferences }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderSkillInputs = (inputType: string) => {
    const data = inputType === 'skills' ? skills : preferences;
    const handleChange = inputType === 'skills' ? handleSkillChange : handlePreferenceChange;

    return Object.entries(data).map(([key, value]) => (
      <div key={key} className="mb-4">
        <Label htmlFor={key} className="block mb-2 capitalize">
          {key.replace('_', ' ')}
        </Label>
        <Slider
          id={key}
          name={key}
          value={[value]}
          onValueChange={(val) => handleChange(key, val)}
          max={10}
          step={1}
          className="w-full"
        />
      </div>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Futurapp: Career Recommender</h1>
        {isAuthenticated && <LogoutButton />} {/* ✅ Show Logout Button only when logged in */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Skills</h2>
              {renderSkillInputs('skills')}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Preferences</h2>
              {renderSkillInputs('preferences')}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Recommendations'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">{error}</div>}

      {results && (
        <div className="mt-6 space-y-6">
          {/* Preferences Recommendations Table */}
          <Card>
            <CardHeader><CardTitle>Preferences Recommendations</CardTitle></CardHeader>
            <CardContent>
              <table className="w-full">
                <thead><tr><th>Campo de Estudio</th><th>Razón</th></tr></thead>
                <tbody>
                  {results.preferences_recommendations.map((item, index) => (
                    <tr key={index}><td className="border p-2">{item["Campo de Estudio"]}</td><td className="border p-2">{item["Razon"]}</td></tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Skills Recommendations Table */}
          <Card>
            <CardHeader><CardTitle>Skills Recommendations</CardTitle></CardHeader>
            <CardContent>
              <table className="w-full">
                <thead><tr><th>Campo de Estudio</th><th>Razón</th></tr></thead>
                <tbody>
                  {results.skills_recommendations.map((item, index) => (
                    <tr key={index}><td className="border p-2">{item["Campo de Estudio"]}</td><td className="border p-2">{item["Razon"]}</td></tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* University Recommendations Table */}
          <Card>
            <CardHeader><CardTitle>University Recommendations</CardTitle></CardHeader>
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
                      <td className="border p-2">{item["Recomendacion Uno"]}</td>
                      <td className="border p-2">{item["Recomendacion Dos"]}</td>
                      <td className="border p-2">{item["Recomendacion Tres"]}</td>
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

export default App;
