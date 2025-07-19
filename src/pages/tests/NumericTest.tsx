import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth0 } from '@auth0/auth0-react'; // Import Auth0 hook
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import numericalQuestions from '../../data/numericalQuestions.json'; // Import your questions data
import { saveAnswersToBackend, loadAnswersFromBackend } from '@/utils/answerPersistence';

interface TestResults {
    totalQuestions: number;
    correctAnswers: number;
    scorePercentage: number;
}

const testQuestions =  numericalQuestions;
  
const NumericTestApp = () => {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [testResults, setTestResults] = useState<TestResults | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user, isLoading: authLoading } = useAuth0(); // Get user info from Auth0
    const answersRef = useRef(answers);

    useEffect(() => {
      answersRef.current = answers;
    }, [answers]);
  
    useEffect(() => {
      const handleBeforeUnload = async () => {
        if (user?.email && Object.keys(answersRef.current).length > 0 && !submitted) {
          // Save answers synchronously (fire and forget)
          saveAnswersToBackend(user.email, 'numeric', answersRef.current);
        }
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [user?.email, submitted]);
  
    useEffect(() => {
      if (user?.email) {
        loadAnswersFromBackend(user.email, 'numeric').then(saved => {
          if (saved && Object.keys(saved).length > 0) {
            setAnswers(saved);
          }
        });
      }
    }, [user?.email]);
  
    useEffect(() => {
      if (user?.email && Object.keys(answers).length > 0 && !submitted) {
        saveAnswersToBackend(user.email, 'numeric', answers);
      }
    }, [answers, user?.email, submitted]);
    const handleAnswerChange = (questionId: string, selectedOption: string) => {
      setAnswers(prev => ({
        ...prev,
        [questionId]: selectedOption
      }));
    };
  
    const handleSubmit = async () => {
      // Prepare the payload for backend
      const submitPayload = {
        name: user?.name || 'anonymous', // Use Auth0 user ID or fallback
        email: user?.email || 'no-email',
        test_name: 'numeric',
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
          await saveAnswersToBackend(user.email, 'numeric', {});
        }
      } catch (err) {
        setError('Failed to submit test. Please try again.');
        console.error('Test submission error:', err);
      } finally {
        setIsLoading(false);
      }
    };
     // Función para renderizar expresiones matemáticas
  const renderMathExpression = (text: string) => {
    // Patrones para identificar diferentes tipos de expresiones matemáticas
    const fractionPattern = /\(([^)]+)\)\/\(([^)]+)\)/g;
    const simpleFractionPattern = /(\d+)\/(\d+)/g;
    const squarePattern = /(\d+)x²/g;
    const sqrtPattern = /√(\d+)/g;
    
    // Si el texto contiene expresiones matemáticas específicas
    if (text.includes('×') || text.includes('/') || 
        text.includes('²') || text.includes('√')) {
      
      // Reemplazar patrones específicos con formato LaTeX
      let latexText = text
        .replace(/×/g, '\\times')
        .replace(squarePattern, '$1x^2')
        .replace(sqrtPattern, '\\sqrt{$1}');
      
      // Manejar fracciones complejas
      if (fractionPattern.test(text)) {
        latexText = text.replace(fractionPattern, '\\frac{$1}{$2}');
      } 
      // Manejar fracciones simples
      else if (simpleFractionPattern.test(text) && !text.includes('+') && !text.includes('=')) {
        latexText = text.replace(simpleFractionPattern, '\\frac{$1}{$2}');
      }
      
      // Casos especiales para la pregunta 32
      if (text === "(-3 × 2)/6") {
        return <InlineMath math={"\\frac{-3 \\times 2}{6}"} />;
      } else if (text === "-6/(-2 × -3)") {
        return <InlineMath math={"\\frac{-6}{-2 \\times -3}"} />;
      } else if (text === "(2 × -3)/6") {
        return <InlineMath math={"\\frac{2 \\times -3}{6}"} />;
      } else if (text === "6/(-3 × -2)") {
        return <InlineMath math={"\\frac{6}{-3 \\times -2}"} />;
      }
      
      return <InlineMath math={latexText} />;
    }
    
    return text;
  };

   // Función para renderizar preguntas y opciones con expresiones matemáticas
   const renderQuestionText = (text: string) => {
    // Verificar si la pregunta contiene expresiones matemáticas
    if (text.includes('²') || text.includes('√') || 
        text.includes('/') || text.includes('×')) {
      
      // Dividir el texto en partes para renderizar las expresiones matemáticas
      const parts = text.split(/(√\d+|\d+x²|\d+\/\d+|[×])/g);
      
      return (
        <>
          {parts.map((part, index) => {
            if (part.match(/(√\d+|\d+x²|\d+\/\d+|[×])/g)) {
              return <InlineMath key={index} math={part
                .replace(/√(\d+)/g, '\\sqrt{$1}')
                .replace(/(\d+)x²/g, '$1x^2')
                .replace(/×/g, '\\times')
                .replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}')} />;
            }
            return part;
          })}
        </>
      );
    }
    
    return text;
  };
  
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Test de Razonamiento Númerico</CardTitle>
          </CardHeader>
          <CardContent>
            {testQuestions.map((q) => (
              <div key={q.id} className="mb-4">
                <p className="font-semibold mb-2">
                {q.id}. {renderQuestionText(q.question)}
                </p>
                <div className="space-y-2">
                  {q.options.map((option) => {
                  // Separar el identificador (A., B., etc.) del contenido
                  const parts = option.split('. ');
                  const identifier = parts[0];
                  const content = parts.length > 1 ? parts[1] : '';
                  return (
                    <div key={option} className="flex items-center">
                      <input
                        type="radio"
                        id={`q${q.id}-${identifier}`}
                        name={`question${q.id}`}
                        value={option}
                        checked={answers[q.id] === option}
                        onChange={() => handleAnswerChange(`${q.id}`, option)}
                        className="mr-2"
                        disabled={submitted || isLoading}
                      />
                      <label htmlFor={`q${q.id}-${identifier}`}>
                        {identifier}. {content && renderMathExpression(content)}
                      </label>
                    </div>
                   );
                })}
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
              disabled={
                Object.keys(answers).length !== testQuestions.length || 
                submitted || 
                isLoading
              }
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
  
  export default NumericTestApp;