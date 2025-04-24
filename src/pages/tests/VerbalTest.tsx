import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth0 } from '@auth0/auth0-react'; // Import Auth0 hook
import verbalQuestions from '../../data/verbalQuestions.json'; // Import your questions data
interface TestResults {
    totalQuestions: number;
    correctAnswers: number;
    scorePercentage: number;
}

const testQuestions = verbalQuestions;

const VerbalTestApp = () => {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [testResults, setTestResults] = useState<TestResults | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user, isLoading: authLoading, logout } = useAuth0(); // Get user info from Auth0
  
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
        test_name: 'verbal',
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
            <CardTitle className="text-2xl text-center">Test de Razonamiento Verbal </CardTitle>
          </CardHeader>
          <CardContent>
            {testQuestions.map((q) => (
              <div key={q.id} className="mb-4">
                <p className="font-semibold mb-2">{q.id}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((option) => (
                    <div key={option} className="flex items-center">
                      <input
                        type="radio"
                        id={`q${q.id}-${option}`}
                        name={`question${q.id}`}
                        value={option}
                        checked={answers[q.id] === option}
                        onChange={() => handleAnswerChange(`${q.id}`, option)}
                        className="mr-2"
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
              <p className="text-lg font-semibold">Tu Puntaje:</p>
              <p className="text-3xl mt-2">{(testResults as any).score}%</p>
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
  
  export default VerbalTestApp;