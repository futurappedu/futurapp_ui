import { useState, useEffect, useRef } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import abstractQuestions from '../../data/abstractQuestions.json';
import { saveAnswersToBackend, loadAnswersFromBackend } from '@/utils/answerPersistence';

export default function AbstractReasoningTest() {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user} = useAuth0();
  const answersRef = useRef(answers);
  const questionsPerPage = 3;

  const testQuestions = abstractQuestions;
  
  const totalPages = Math.ceil(testQuestions.length / questionsPerPage);
  const startIndex = currentPage * questionsPerPage;
  const visibleQuestions = testQuestions.slice(startIndex, startIndex + questionsPerPage);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (user?.email && Object.keys(answersRef.current).length > 0 && !submitted) {
        // Save answers synchronously (fire and forget)
        saveAnswersToBackend(user.email, 'abstract', answersRef.current);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user?.email, submitted]);

  useEffect(() => {
    if (user?.email) {
      loadAnswersFromBackend(user.email, 'abstract').then(saved => {
        if (saved && Object.keys(saved).length > 0) {
          setAnswers(saved);
        }
      });
    }
  }, [user?.email]);

  useEffect(() => {
    if (user?.email && Object.keys(answers).length > 0 && !submitted) {
      saveAnswersToBackend(user.email, 'abstract', answers);
    }
  }, [answers, user?.email, submitted]);
  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };
  

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
      test_name: 'abstract',
      answers: answers
    };

    setIsLoading(true);
    setError(null);

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

      const data = await response.json();
      setTestResults(data);
      setSubmitted(true);

      if (user?.email) {
        await saveAnswersToBackend(user.email, 'abstract', {});
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
      <h1 className="text-2xl font-bold mb-6 text-center">Test de Razonamiento Abstracto</h1>
      <div className="flex justify-between mb-4">
        <div className="text-lg font-medium">Página {currentPage + 1} de {totalPages}</div>
        <div className="text-lg font-medium">Preguntas contestadas: {Object.keys(answers).length} de {testQuestions.length}</div>
      </div>
      {currentPage === 0 && (
  <Card className="mb-8 p-6 bg-white">
    <h2 className="text-xl font-semibold mb-4 text-center">Instrucciones</h2>
    <p className="mb-4 text-center">
     En esta prueba se trata de apreciar la capacidad de razonar con figuras o dibujos. En cada fila hay cuatro figuras llamadas PROBLEMAS
     y cinco llamadas RESPUESTA. Las figuras PROBLEMA forman una serie porque estan ordenadas siguiendo una ley. Su tarea consiste en elegir,
     entre las figuras RESPUESTA, la que debería ir a continuación de las figuras PROBLEMA.
     <br/>
     Fíjese en el ejemplo:
    </p>
    <div className="flex justify-center">
      <img
        src="/abstract/questions/instrucciones_abstracto.png" // Coloca aquí la ruta de tu imagen de instrucciones
        alt="Ejemplo de instrucciones"
        className="max-w-lg rounded shadow"
      />
      </div>
      <div className="w-full flex justify-center mt-4">
        <p className="text-sm text-center max-w-md">
          En el ejemplo E1, puede ver que la flecha gira 90 grados, en el sentido de las agujas del reloj, de un
          recuadro a otro. ¿Cual debería ser la proxima figura de la serie? La respuesta correcta es la A
          porque la posición siguiente de la flecha debería ser vertical hacia arriba.
          <br />
          <strong>¡Buena suerte!</strong>
        </p>
      </div>
  </Card>
  )}

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
            <h3 className="text-lg font-medium mb-2">Select Your Answer:</h3>
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
              Object.keys(answers).length < testQuestions.length || 
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