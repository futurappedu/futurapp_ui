import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth0 } from '@auth0/auth0-react'; // Import Auth0 hook

interface TestResults {
    totalQuestions: number;
    correctAnswers: number;
    scorePercentage: number;
}

const testQuestions = [
  {
    "id": 1,
    "question": "... es a empezar como fin es a ...",
    "options": [
      "A. comienzo - continuar",
      "B. emprender - comienzo",
      "C. inicio - terminar",
      "D. terminar - conclusión",
      "E. objetivo - iniciar"
    ]
  },
  {
    "id": 2,
    "question": "... es a mago como chiste es a ...",
    "options": [
      "A. truco - habilidad",
      "B. actor - risa",
      "C. comediante - actor",
      "D. habilidad - trágico",
      "E. truco - humorista"
    ]
  },
  {
    "id": 3,
    "question": "... es a pentágono como diez es a ...",
    "options": [
      "A. polígono - doble",
      "B. cinco - decálogo",
      "C. ángulo - decálogo",
      "D. pentagrama - cinco",
      "E. decámetro - doble"
    ]
  },
  {
    "id": 4,
    "question": "... es a mano como calcetín es a ...",
    "options": [
      "A. dedo - zapato",
      "B. guante - pie",
      "C. gesto - zapato",
      "D. brazo - pie",
      "E. pulgar - lana"
    ]
  },
  {
    "id": 5,
    "question": "... es a arañar como avispa es a ...",
    "options": [
      "A. uña - aguijón",
      "B. gato - picar",
      "C. morder - araña",
      "D. uña - tela",
      "E. morder - veneno"
    ]
  },
  {
    "id": 6,
    "question": "... es a izar como abajo es a ...",
    "options": [
      "A. subir - arriba",
      "B. peso - descender",
      "C. arriba - arriar",
      "D. vela - mar",
      "E. bandera - vela"
    ]
  },
  {
    "id": 7,
    "question": "... es a boca como guiño es a ...",
    "options": [
      "A. mueca - ojo",
      "B. cara - gesto",
      "C. ademán - burla",
      "D. diente - gesto",
      "E. rostro - ojo"
    ]
  },
  {
    "id": 8,
    "question": "... es a tierra como golfo es a ...",
    "options": [
      "A. cabo - mar",
      "B. lago - bahía",
      "C. muelle - cabo",
      "D. mar - playa",
      "E. río - bahía"
    ]
  },
  {
    "id": 9,
    "question": "... es a tarde como primero es a ...",
    "options": [
      "A. temprano - número",
      "B. pronto - uno",
      "C. mañana - pronto",
      "D. temprano - último",
      "E. segundo - último"
    ]
  },
  {
    "id": 10,
    "question": "... es a red como eslabón es a ...",
    "options": [
      "A. pesca - hierro",
      "B. malla - cadena",
      "C. tejido - anillo",
      "D. barca - hierro",
      "E. hilo - pedernal"
    ]
  },
  {
    "id": 11,
    "question": "... es a ordinario como peculiar es a ...",
    "options": [
      "A. habitual - general",
      "B. común - característico",
      "C. raro - propio",
      "D. familiar - vulgar",
      "E. raro - específico"
    ]
  },
  {
    "id": 12,
    "question": "... es a nuez como piel es a ...",
    "options": [
      "A. fruta - animal",
      "B. cáscara - uva",
      "C. vegetal - corteza",
      "D. aceite - vino",
      "E. ardilla - lobo"
    ]
  },
  {
    "id": 13,
    "question": "... es a pobreza como abundancia es a ...",
    "options": [
      "A. dinero - ahorro",
      "B. dinero - opulencia",
      "C. riqueza - bienestar",
      "D. escasez - miseria",
      "E. riqueza - escasez"
    ]
  },
  {
    "id": 14,
    "question": "... es a flotil como soldado es a ...",
    "options": [
      "A. mar - guerra",
      "B. barco - guerra",
      "C. buque - ejército",
      "D. mar - infantería",
      "E. armada - capitán"
    ]
  },
  {
    "id": 15,
    "question": "... es a alumno como pediatra es a ...",
    "options": [
      "A. educación - salud",
      "B. profesor - médico",
      "C. colegio - maestro",
      "D. libro - puericultor",
      "E. profesor - niño"
    ]
  },
  {
    "id": 16,
    "question": "... es a azar como recompensa es a ...",
    "options": [
      "A. sorteo - castigo",
      "B. suerte - fortuna",
      "C. destino - elección",
      "D. suerte - mérito",
      "E. premio - dinero"
    ]
  },
  {
    "id": 17,
    "question": "... es a muelle como avión es a ...",
    "options": [
      "A. puerto - piloto",
      "B. mercancía - nave",
      "C. aterrizaje - pista",
      "D. descarga - comandante",
      "E. barco - hangar"
    ]
  },
  {
    "id": 18,
    "question": "... es a frecuente como escaso es a ...",
    "options": [
      "A. corriente - bastante",
      "B. ordinario - vulgar",
      "C. abundante - raro",
      "D. suficiente - habitual",
      "E. vulgar - corriente"
    ]
  },
  {
    "id": 19,
    "question": "... es a despejar como clave es a ...",
    "options": [
      "A. tiempo - aclarar",
      "B. resolver - símbolo",
      "C. ocultar - secreto",
      "D. incógnita - descifrar",
      "E. problema - ocultar"
    ]
  },
  {
    "id": 20,
    "question": "... es a abandonar como aceptar es a ...",
    "options": [
      "A. desertar - dimitir",
      "B. iniciar - consentir",
      "C. dimitir - renunciar",
      "D. emprender - renunciar",
      "E. huir - rechazar"
    ]
  },
  {
    "id": 21,
    "question": "... es a avión como timonel es a ...",
    "options": [
      "A. motor - hélice",
      "B. aeropuerto - puerto",
      "C. piloto - embarcación",
      "D. piloto - capitán",
      "E. embarcación - timón"
    ]
  },
  {
    "id": 22,
    "question": "... es a copia como creación es a ...",
    "options": [
      "A. original - reproducción",
      "B. auténtico - invención",
      "C. falso - fraude",
      "D. real - ficticio",
      "E. imitación - fraude"
    ]
  },
  {
    "id": 23,
    "question": "... es a cortés como tosco es a ...",
    "options": [
      "A. gentil - grotesco",
      "B. delicado - terco",
      "C. educado - grosero",
      "D. correcto - fino",
      "E. grosero - rudo"
    ]
  },
  {
    "id": 24,
    "question": "... es a fatiga como bebida es a ...",
    "options": [
      "A. descanso - sed",
      "B. trabajo - sed",
      "C. cansancio - agua",
      "D. sueño - alimento",
      "E. trabajo - alimento"
    ]
  },
  {
    "id": 25,
    "question": "... es a cuervo como pelo es a ...",
    "options": [
      "A. nido - cabeza",
      "B. ave - animal",
      "C. rapiña - zorro",
      "D. pluma - zorro",
      "E. ave - abrigo"
    ]
  },
  {
    "id": 26,
    "question": "... es a ganar como desear es a ...",
    "options": [
      "A. trabajar - pedir",
      "B. perder - optar",
      "C. competir - conseguir",
      "D. jugar - escoger",
      "E. participar - aborrecer"
    ]
  },
  {
    "id": 27,
    "question": "... es a tiempo como inmenso es a ...",
    "options": [
      "A. movimiento - medida",
      "B. momento - vasto",
      "C. eterno - cantidad",
      "D. dilatado - momento",
      "E. medida - cantidad"
    ]
  },
  {
    "id": 28,
    "question": "... es a caliente como gélido es a ...",
    "options": [
      "A. hirviente - tórrido",
      "B. tórrido - frío",
      "C. tibio - incandescente",
      "D. templado - glaciar",
      "E. fuego - frío"
    ]
  },
  {
    "id": 29,
    "question": "... es a aceptación como proyecto es a ...",
    "options": [
      "A. promesa - compromiso",
      "B. presupuesto - plano",
      "C. propuesta - ejecución",
      "D. obra - oferta",
      "E. contrato - obligación"
    ]
  },
  {
    "id": 30,
    "question": "... es a consultar como respuesta es a ...",
    "options": [
      "A. interrogar - argumento",
      "B. aconsejar - duda",
      "C. consejo - réplica",
      "D. preguntar - consejo",
      "E. opinión - disputar"
    ]
  },
  {
    "id": 31,
    "question": "... es a zanja como arado es a ...",
    "options": [
      "A. cimiento - surco",
      "B. excavar - tierra",
      "C. draga - cultivo",
      "D. excavadora - surco",
      "E. hoyo - siembra"
    ]
  },
  {
    "id": 32,
    "question": "... es a rechazar como agredir es a ...",
    "options": [
      "A. avanzar - insultar",
      "B. luchar - enemigo",
      "C. repeler - retroceder",
      "D. atacar - repeler",
      "E. golpe - daño"
    ]
  },
  {
    "id": 33,
    "question": "... es a árbol como manantial es a ...",
    "options": [
      "A. tierra - fuente",
      "B. fruta - roca",
      "C. hierva - nieve",
      "D. tallo - río",
      "E. abono - fuente"
    ]
  },
  {
    "id": 34,
    "question": "... es a separar como proximidad es a ...",
    "options": [
      "A. unir - cercanía",
      "B. despedida - volver",
      "C. alejar - incluir",
      "D. juntar - distancia",
      "E. cercanía - amistad"
    ]
  },
  {
    "id": 35,
    "question": "... es a esculpir como cuero es a ...",
    "options": [
      "A. buril - repujar",
      "B. curtir - piel",
      "C. cincel - adornar",
      "D. piedra - repujar",
      "E. estatua - taller"
    ]
  },
  {
    "id": 36,
    "question": "... es a fino como copioso es a ...",
    "options": [
      "A. subir - arriba",
      "B. delgado - escaso",
      "C. gordo - opulento",
      "D. elegante - exiguo",
      "E. grueso - exiguo"
    ]
  },
  {
    "id": 37,
    "question": "... es a frase como letra es a ...",
    "options": [
      "A. verbo - escritura",
      "B. escritura - música",
      "C. párrafo - escritura",
      "D. adjetivo - ortografía",
      "E. palabra - palabra"
    ]
  },
  {
    "id": 38,
    "question": "... es a vigilia como dormir es a ...",
    "options": [
      "A. atención - soñar",
      "B. sueño - velar",
      "C. noche - soñar",
      "D. despertar - fatiga",
      "E. centinela - descansar"
    ]
  },
  {
    "id": 39,
    "question": "... es a balanza como máquina es a ...",
    "options": [
      "A. campo - herramienta",
      "B. tierra - producción",
      "C. agricultor - ingeniero",
      "D. apero - mecánico",
      "E. apero - fabricación"
    ]
  },
  {
    "id": 40,
    "question": "... es a seguridad como indicio es a ...",
    "options": [
      "A. policía - crimen",
      "B. sospecha - evidencia",
      "C. justicia - prueba",
      "D. sospecha - orden",
      "E. certeza - persuasión"
    ]
  }
];

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
            <CardTitle className="text-2xl text-center">Verbal Reasoning Test</CardTitle>
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
              <p className="text-lg font-semibold">Your Score:</p>
              <p className="text-3xl mt-2">{(testResults as any).score}%</p>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  export default VerbalTestApp;