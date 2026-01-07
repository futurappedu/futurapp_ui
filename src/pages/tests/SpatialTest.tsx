import { useState, useEffect, useRef, useCallback } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import spatialQuestions from '../../data/spatialQuestions.json';
import { saveAnswersToBackend, loadAnswersFromBackend } from '@/utils/answerPersistence';
import { useTestTimer } from '@/hooks/useTestTimer';
import { TestTimer } from '@/components/TestTimer';
import { apiUrl } from '@/config/api';

export default function SpatialReasoningTest() {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, getAccessTokenSilently } = useAuth0();
  const answersRef = useRef(answers);

  const questionsPerPage = 5;

  const testQuestions = spatialQuestions;
  
  const totalPages = Math.ceil(testQuestions.length / questionsPerPage);
  const startIndex = currentPage * questionsPerPage;
  const visibleQuestions = testQuestions.slice(startIndex, startIndex + questionsPerPage);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (user?.email && Object.keys(answersRef.current).length > 0 && !submitted) {
        try {
          const token = await getAccessTokenSilently();
          saveAnswersToBackend(user.email, 'spatial', answersRef.current, token);
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
      loadAnswersFromBackend(user.email, 'spatial').then(saved => {
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
          saveAnswersToBackend(user.email, 'spatial', answers, token);
        } catch {
          // Silently fail
        }
      }
    };
    saveAnswers();
  }, [answers, user?.email, submitted, getAccessTokenSilently]);
  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Auto-submit function for timer
  const handleAutoSubmit = useCallback(async () => {
    const submitPayload = {
      name: user?.name || 'anonymous',
      email: user?.email || 'no-email',
      test_name: 'spatial',
      answers: answersRef.current
    };

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(apiUrl('grade_test'), {
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
        await saveAnswersToBackend(user.email, 'spatial', {}, token);
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

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };
  const handleSubmit = async () => {
    const submitPayload = {
      name: user?.name || 'anonymous',
      email: user?.email || 'no-email',
      test_name: 'spatial',
      answers: answers
    };

    setIsLoading(true);
    setError(null);

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(apiUrl('grade_test'), {
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
        await saveAnswersToBackend(user.email, 'spatial', {}, token);
      }
    } catch (err) {
      setError('Failed to submit test. Please try again.');
      console.error('Test submission error:', err);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50">
      <TestTimer 
        formattedTime={formattedTime} 
        percentageRemaining={percentageRemaining} 
        isTimeUp={isTimeUp} 
      />
      <h1 className="text-2xl font-bold mb-6 text-center">Test de Razonamiento Espacial</h1>
      {/* Instruction Section */}
<div className="mb-8">
  {/* First text block */}
  <div className="mb-4 text-center text-base">
  En cada ejercicio se presenta un modelo o patrón en el que algunas zonas están sombreadas y en otras aparecen pequeños dibujos. A la derecha de cada modelo se ofrecen cuatro figuras de tres dimensiones. Su tarea consiste en averiguar cuál de esas figuras es la única que ha podido formarse a partir del modelo. Éste siempre presenta la parte exterior de la figura.
  </div>
  {/* Image block */}
  <div className="flex justify-center mb-4">
    <img
      src="/spatial/questions/instrucciones_espacial.png" // Ajusta la ruta según tu estructura
      alt="Ejemplo de instrucciones"
      className="w-full max-w-xl rounded shadow"
    />
  </div>
  {/* Second text block */}
  <div className="text-center text-base">
  En el Ejemplo E1 el modelo formará un caja rectangular con las dos caras mayores y una de las pequeñas laterales sombreadas. Fíjese en las respuestas A, B, C y D. Las respuestas A y C son incorrectas porque la cara superior no está sombreada. La respuesta B, tampoco es correcta porque tiene sombreados uno de los laterales largos. La respuesta correcta es D porque la cara superior y uno de los laterales cortos están sombreados. La cara inferior está oculta a la vista
    <br />
    <strong>¡Buena suerte!</strong>
  </div>
</div>
      
      <div className="flex justify-between mb-4">
        <div className="text-lg font-medium">Página {currentPage + 1} de {totalPages}</div>
        <div className="text-lg font-medium">Preguntas contestadas: {Object.keys(answers).length} de {testQuestions.length}</div>
      </div>
      
      {visibleQuestions.map((question) => (
        <Card key={question.id} className="mb-12 p-6">
          <h2 className="text-xl font-semibold mb-4">Pregunta {question.id}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
            {/* Problem Section */}
            <Card className="p-4 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4 text-center">Figura PROBLEMA</h3>
            <img
              src={question.problem}
              alt={`Problema ${question.id}`}
              className="w-full h-full object-contain"
            />
          </Card>

            {/* Options Image Section */}
            <Card className="p-4 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4 text-center">Figuras RESPUESTA</h3>
            <img
              src={question.options}
              alt={`Opciones ${question.id}`}
              className="w-full h-full object-contain"
            />
          </Card>
          </div>

          {/* Choices Section */}
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Seleccione su respuesta</h3>
            <RadioGroup 
              value={answers[question.id] || ""}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
              className="flex justify-center gap-8"
            >
              {question.choices.map((choice) => (
                <div key={choice} className="flex items-center space-x-2">
                  <RadioGroupItem value={choice} id={`question-${question.id}-option-${choice}`} />
                  <Label htmlFor={`question-${question.id}-option-${choice}`} className="text-lg font-medium">{choice}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </Card>
      ))}




      {/* Pagination Controls */}
      <div className="flex justify-between mt-8">
        <Button 
          onClick={goToPrevPage} 
          disabled={currentPage === 0}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" /> Anterior
        </Button>
        
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <Button
              key={index}
              variant={currentPage === index ? "default" : "outline"}
              className="w-8 h-8 p-0"
              onClick={() => {
                setCurrentPage(index);
                window.scrollTo(0, 0);
              }}
            >
              {index + 1}
            </Button>
          ))}
        </div>
        
        <Button 
          onClick={goToNextPage} 
          disabled={currentPage === totalPages - 1}
          variant="outline"
          className="flex items-center gap-2"
        >
          Siguiente <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

   
      {/* Error Message */}
      {error && (
        <div className="text-red-500 my-4 text-center">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center mt-8">
        {currentPage === totalPages - 1 && (
          <Button 
            onClick={handleSubmit} 
            className="w-48"
            disabled={ 
              submitted || 
              isLoading
            }
          >
            {isLoading ? 'Submitting...' : 'Submit Test'}
          </Button>
        )}
      </div>

      {/* Show results after submission */}
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
    </div>
  );
}