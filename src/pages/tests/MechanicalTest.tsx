import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth0 } from '@auth0/auth0-react'; // Import Auth0 hook
import mechanicalQuestions from '../../data/mechanicalQuestions.json'; // Import your questions data
import { saveAnswersToBackend, loadAnswersFromBackend } from '@/utils/answerPersistence';
import { useTestTimer } from '@/hooks/useTestTimer';
import { TestTimer } from '@/components/TestTimer';


interface TestResults {
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
}

const testQuestions = mechanicalQuestions;

const MechanicalTestApp = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const { user, isLoading: authLoading, logout } = useAuth0();
  const answersRef = useRef(answers);

  const questionsPerPage = 5;
  const totalPages = Math.ceil(testQuestions.length / questionsPerPage);
  
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (user?.email && Object.keys(answersRef.current).length > 0 && !submitted) {
        // Save answers synchronously (fire and forget)
        saveAnswersToBackend(user.email, 'mechanical', answersRef.current);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user?.email, submitted]);

  useEffect(() => {
    if (user?.email) {
      loadAnswersFromBackend(user.email, 'mechanical').then(saved => {
        if (saved && Object.keys(saved).length > 0) {
          setAnswers(saved);
        }
      });
    }
  }, [user?.email]);

  useEffect(() => {
    if (user?.email && Object.keys(answers).length > 0 && !submitted) {
      saveAnswersToBackend(user.email, 'mechanical', answers);
    }
  }, [answers, user?.email, submitted]);
  const handleAnswerChange = (questionId: number, selectedOption: string) => {
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
      test_name: 'mechanical',
      answers: answersRef.current
    };

    try {
      const response = await fetch('https://futurappapi-staging.up.railway.app/grade_test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitPayload)
      });

      if (!response.ok) {
        throw new Error('Test submission failed');
      }

      if (user?.email) {
        await saveAnswersToBackend(user.email, 'mechanical', {});
      }
    } catch (err) {
      console.error('Auto-submit error:', err);
    }
  }, [user?.name, user?.email]);

  // Timer hook
  const { formattedTime, percentageRemaining, isTimeUp } = useTestTimer({
    durationInMinutes: 60,
    onTimeUp: handleAutoSubmit,
    submitted,
  });
  
  const handleSubmit = async () => {
    // Prepare the payload for backend
    const submitPayload = {
      name: user?.name || 'anonymous',
      email: user?.email || 'no-email',
      test_name: 'mechanical',
      answers: answers
    };
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch API call to submit test
      const response = await fetch('https://futurappapi-staging.up.railway.app/grade_test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitPayload)
      });
      
      if (!response.ok) {
        throw new Error('Test submission failed');
      }
      
      const data = await response.json();
      
      // Set test results from backend response
      setTestResults(data);
      setSubmitted(true);

      if (user?.email) {
        await saveAnswersToBackend(user.email, 'mechanical', {});
      }
    } catch (err) {
      setError('Failed to submit test. Please try again.');
      console.error('Test submission error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Get current questions for pagination
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = currentPage === 0 ? [] : testQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <TestTimer 
        formattedTime={formattedTime} 
        percentageRemaining={percentageRemaining} 
        isTimeUp={isTimeUp} 
      />
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
          <CardTitle className="text-2xl text-center">Test de Razonamiento Mecánico</CardTitle>
          <div className="text-center text-gray-500">
            Página {currentPage} de {totalPages}
          </div>
        </CardHeader>
        {currentPage === 0 && (
  <Card className="mb-8 p-6 bg-white">
    <h2 className="text-xl font-semibold mb-4 text-center">Instrucciones</h2>
    <p className="mb-4 text-center">
     En esta prueba hay un cierto número de dibujos sobre los cuales se hacen algunas preguntas.
     Lea atentamente cada pregunta, observe la figura o figuras y elija cúal de las tres preguntas A, B, C,
     es la mejor respuesta
     <br />
     Una vez haya elegido su respuesta, debe marcar, en la Hoja de respuestas, el espacio correspondiente a 
     la contestación elegida. Fíjese en el ejemplo:
    </p>
    <div className="flex justify-center">
      <img
        src="/mechanical/questions/instrucciones_mecanico.png" // Coloca aquí la ruta de tu imagen de instrucciones
        alt="Ejemplo de instrucciones"
        className="max-w-lg rounded shadow"
      />
      </div>
      <div className="w-full flex justify-center mt-4">
        <p className="text-sm text-center max-w-md">
          El ejemplo E1 presenta dos dibujos que parecen similares; pero tienen una pequeña diferencia:
          en el dibujo A la pala golpea la parte inferior de la pelota y en el B, la parte superior.
          <br />
          La pelota A subirá más porque la pala la golpea desde abajo. La respuesta correcta es la A.
          <br />
          <strong>¡Buena suerte!</strong>
        </p>
      </div>
  </Card>
  )}
        <CardContent>
          {currentPage > 0 && currentQuestions.map((q) => (
            <div key={q.id} className="mb-8 pb-6 border-b border-gray-200">
              <p className="font-semibold mb-3">{q.id}. {q.question}</p>
              
              {/* Image display */}
              <div className="my-4 flex justify-center">
                <img 
                  src={q.image} 
                  alt={`Question ${q.id} illustration`} 
                  className="max-w-full h-auto border rounded"
                />
              </div>
              
              <div className="space-y-2 mt-4">
                {q.options.map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="radio"
                      id={`q${q.id}-${option}`}
                      name={`question${q.id}`}
                      value={option}
                      checked={answers[q.id] === option}
                      onChange={() => handleAnswerChange(q.id, option)}
                      className="mr-2"
                      disabled={submitted || isLoading}
                    />
                    <label htmlFor={`q${q.id}-${option}`}>{option}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Pagination controls */}
          <div className="flex justify-between mt-6">
            <Button 
              onClick={handlePrevPage} 
              disabled={currentPage === 0 || submitted}
              variant="outline"
            >
              Anterior
            </Button>
            
            <Button 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages || submitted}
              variant="outline"
            >
              Siguiente
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col">
          {error && (
            <div className="text-red-500 mb-4 text-center">
              {error}
            </div>
          )}
          
          <div className="flex justify-between w-full">
            <div className="text-sm mt-2">
              {Object.keys(answers).length} de {testQuestions.length} preguntas contestadas
            </div>
            
            {currentPage === totalPages && (
              <Button 
                onClick={handleSubmit} 
                className="w-48"
                disabled={ 
                  submitted || isLoading
                }
              >
                {isLoading ? 'Submitting...' : 'Submit Test'}
              </Button>
            )}
          </div>
          
          {authLoading && (
            <div className="w-full mb-4 text-center text-gray-500 mt-4">
              Loading user information...
            </div>
          )}

          
          {submitted && testResults && (
            <div className="w-full text-center mt-6 flex flex-col items-center">
              <p className="text-lg font-semibold">Tu puntaje:</p>
              <p className="text-3xl mt-2">{(testResults as any).score}%</p>
              <Button 
              className="mt-4"
              variant="outline"
              onClick={() => window.history.back()}
              >
              Volver
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default MechanicalTestApp;