import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth0 } from '@auth0/auth0-react'; // Import Auth0 hook
import mechanicalQuestions from '../../data/mechanicalQuestions.json'; // Import your questions data
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
  const [currentPage, setCurrentPage] = useState(1);
  const { user, isLoading: authLoading, logout } = useAuth0();
  
  const questionsPerPage = 5;
  const totalPages = Math.ceil(testQuestions.length / questionsPerPage);
  
  const handleAnswerChange = (questionId: number, selectedOption: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };
  
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
  const currentQuestions = testQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  
  return (
    <div className="container mx-auto p-4 max-w-2xl">
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
        
        <CardContent>
          {currentQuestions.map((q) => (
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
              disabled={currentPage === 1 || submitted}
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
                  Object.keys(answers).length < testQuestions.length || 
                  submitted || 
                  isLoading
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