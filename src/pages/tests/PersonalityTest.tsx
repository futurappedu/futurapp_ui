import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth0 } from '@auth0/auth0-react';
import personalityQuestions from '../../data/personalityQuestions.json';
import { saveAnswersToBackend, loadAnswersFromBackend } from '@/utils/answerPersistence';
import { useTestTimer } from '@/hooks/useTestTimer';
import { TestTimer } from '@/components/TestTimer';
import { apiUrl } from '@/config/api';


const testQuestions = personalityQuestions;

const PersonalityTestApp = () => {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [testResults, setTestResults] = useState<Record<string, number> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user, isLoading: authLoading, logout, getAccessTokenSilently } = useAuth0();
    const answersRef = useRef(answers);
    

    useEffect(() => {
        answersRef.current = answers;
      }, [answers]);
    
      useEffect(() => {
        const handleBeforeUnload = async () => {
          if (user?.email && Object.keys(answersRef.current).length > 0 && !submitted) {
            try {
              const token = await getAccessTokenSilently();
              saveAnswersToBackend(user.email, 'personality', answersRef.current, token);
            } catch {
              // Silently fail on unload
            }
          }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
      }, [user?.email, submitted, getAccessTokenSilently]);
    
      useEffect(() => {
        if (user?.email) {
          loadAnswersFromBackend(user.email, 'personality').then(saved => {
            if (saved && Object.keys(saved).length > 0) {
              setAnswers(saved);
            }
          });
        }
      }, [user?.email]);
    
      useEffect(() => {
        const saveAnswers = async () => {
          if (user?.email && Object.keys(answers).length > 0 && !submitted) {
            try {
              const token = await getAccessTokenSilently();
              saveAnswersToBackend(user.email, 'personality', answers, token);
            } catch {
              // Silently fail
            }
          }
        };
        saveAnswers();
      }, [answers, user?.email, submitted, getAccessTokenSilently]);
    const handleAnswerChange = (questionId: string, selectedOption: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: selectedOption
        }));
    };

    // Auto-submit function for timer
    const handleAutoSubmit = useCallback(async () => {
      const submitPayload = {
        name: user?.name || 'anonymous',
        email: user?.email || 'no-email',
        answers: answersRef.current
      };

      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(apiUrl('grade_riasec'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(submitPayload)
        });

        if (!response.ok) {
          throw new Error('Test submission failed');
        }

        if (user?.email) {
          await saveAnswersToBackend(user.email, 'personality', {}, token);
        }
      } catch (err) {
        console.error('Auto-submit error:', err);
      }
    }, [user?.name, user?.email, getAccessTokenSilently]);

    // Timer hook
    const { formattedTime, percentageRemaining, isTimeUp } = useTestTimer({
      durationInMinutes: 60,
      onTimeUp: handleAutoSubmit,
      submitted,
    });

    const handleSubmit = async () => {
      // Find unanswered questions
      const unanswered = testQuestions
          .filter(q => !answers[q.id])
          .map(q => q.id);
  
      if (unanswered.length > 0) {
          alert(
              `Por favor responde todas las preguntas antes de enviar. Faltan las preguntas: ${unanswered.join(", ")}`
          );
          return;
      }
  
      const submitPayload = {
          name: user?.name || 'anonymous',
          email: user?.email || 'no-email',
          answers: answers
      };
  
      setIsLoading(true);
      setError(null);
  
      try {
          const token = await getAccessTokenSilently();
          const response = await fetch(apiUrl('grade_riasec'), {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify(submitPayload)
          });
  
          if (!response.ok) {
              throw new Error('Test submission failed');
          }
  
          const data = await response.json();
          setTestResults(data);
          setSubmitted(true);

          if (user?.email) {
            await saveAnswersToBackend(user.email, 'personality', {}, token);
          }
      } catch (err) {
          setError('Failed to submit test. Please try again.');
          console.error('Test submission error:', err);
      } finally {
          setIsLoading(false);
      }
  };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <TestTimer 
              formattedTime={formattedTime} 
              percentageRemaining={percentageRemaining} 
              isTimeUp={isTimeUp} 
            />
            {/* Description Card */}
            <Card className="mb-6 bg-blue-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="text-xl text-center text-blue-900">Sobre este test</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-blue-900">
                        Este test de personalidad te ayudará a identificar tus rasgos predominantes y cómo estos pueden influir en tu desarrollo profesional. Elige entre 1 a 5 siendo 5 el mejor y 1 el peor.<br />
                        <span className="font-semibold">Responde honestamente cada pregunta seleccionando la opción que más se asemeje a ti.</span>
                    </p>
                </CardContent>
            </Card>

            {/* Logout button at the top right */}
            <div className="flex justify-end mb-4">
                <Button
                    variant="outline"
                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                >
                    Logout
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Test de Personalidad</CardTitle>
                </CardHeader>
                <CardContent>
                    {testQuestions.map((q) => (
                        <div key={q.id} className="mb-4">
                            <p className="font-semibold mb-2">{q.id}. {q.question}</p>
                            <div className="flex gap-4 flex-row">
                                {q.options.map((option) => (
                                    <div key={option} className="flex items-center">
                                        <input
                                            type="radio"
                                            id={`q${q.id}-${option}`}
                                            name={`question${q.id}`}
                                            value={option}
                                            checked={answers[q.id] === option}
                                            onChange={() => handleAnswerChange(`${q.id}`, option)}
                                            className="mr-2 w-6 h-6 accent-blue-600"
                                            disabled={submitted || isLoading}
                                        />
                                        <label htmlFor={`q${q.id}-${option}`}>{option}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </CardContent>
                <CardFooter className="flex flex-col">
                    {error && (
                        <div className="text-red-500 mb-4 text-center">
                            {error}
                        </div>
                    )}
                    <Button
                        onClick={handleSubmit}
                        className="w-full mb-4"
                        disabled={submitted || isLoading}
                    >
                        {isLoading ? 'Submitting...' : 'Submit Test'}
                    </Button>

                    {authLoading && (
                        <div className="w-full mb-4 text-center text-gray-500">
                            Loading user information...
                        </div>
                    )}

{submitted && testResults && (
    <div className="w-full text-center">
        <p className="text-lg font-semibold mb-2">Tus resultados:</p>
        <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(testResults).map(([trait, value]) => {
                const traitLabels: Record<string, string> = {
                    R: "Realista",
                    I: "Investigativa",
                    A: "Artística",
                    S: "Social",
                    E: "Emprendedora",
                    C: "Convencional",
                };
                return (
                    <div
                        key={trait}
                        className="bg-blue-100 text-blue-900 rounded px-4 py-2 shadow text-base font-medium"
                    >
                        <span className="font-bold">{traitLabels[trait] || trait}:</span> {value}
                    </div>
                );
            })}
        </div>
    </div>
)}
                    <Button
                        className="mt-4"
                        variant="outline"
                        onClick={() => window.history.back()}
                    >
                        Volver
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default PersonalityTestApp;