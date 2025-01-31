import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import axios from 'axios';

const questions =  [
  {
    "question": "1. ... es a empezar como fin es a ...",
    "options": [
      "A. comienzo - continuar",
      "B. emprender - comienzo",
      "C. inicio - terminar",
      "D. terminar - conclusión",
      "E. objetivo - iniciar"
    ]
  },
  {
    "question": "2. ... es a mago como chiste es a ...",
    "options": [
      "A. truco - habilidad",
      "B. actor - risa",
      "C. comediante - actor",
      "D. habilidad - trágico",
      "E. truco - humorista"
    ]
  },
  {
    "question": "3. ... es a pentágono como diez es a ...",
    "options": [
      "A. polígono - doble",
      "B. cinco - decálogo",
      "C. ángulo - decálogo",
      "D. pentagrama - cinco",
      "E. decámetro - doble"
    ]
  },
  {
    "question": "4. ... es a mano como calcetín es a ...",
    "options": [
      "A. dedo - zapato",
      "B. guante - pie",
      "C. gesto - zapato",
      "D. brazo - pie",
      "E. pulgar - lana"
    ]
  },
  {
    "question": "5. ... es a arañar como avispa es a ...",
    "options": [
      "A. uña - aguijón",
      "B. gato - picar",
      "C. morder - araña",
      "D. uña - tela",
      "E. morder - veneno"
    ]
  },
  {
    "question": "6. ... es a izar como abajo es a ...",
    "options": [
      "A. subir - arriba",
      "B. peso - descender",
      "C. arriba - arriar",
      "D. vela - mar",
      "E. bandera - vela"
    ]
  },
  {
    "question": "7. ... es a boca como guiño es a ...",
    "options": [
      "A. mueca - ojo",
      "B. cara - gesto",
      "C. ademán - burla",
      "D. diente - gesto",
      "E. rostro - ojo"
    ]
  },
  {
    "question": "8. ... es a tierra como golfo es a ...",
    "options": [
      "A. cabo - mar",
      "B. lago - bahía",
      "C. muelle - cabo",
      "D. mar - playa",
      "E. río - bahía"
    ]
  },
  {
    "question": "9. ... es a tarde como primero es a ...",
    "options": [
      "A. temprano - número",
      "B. pronto - uno",
      "C. mañana - pronto",
      "D. temprano - último",
      "E. segundo - último"
    ]
  },
  {
    "question": "10. ... es a red como eslabón es a ...",
    "options": [
      "A. pesca - hierro",
      "B. malla - cadena",
      "C. tejido - anillo",
      "D. barca - hierro",
      "E. hilo - pedernal"
    ]
  },
  {
    "question": "11. ... es a ordinario como peculiar es a ...",
    "options": [
      "A. habitual - general",
      "B. común - característico",
      "C. raro - propio",
      "D. familiar - vulgar",
      "E. raro - específico"
    ]
  },
  {
    "question": "12. ... es a nuez como piel es a ...",
    "options": [
      "A. fruta - animal",
      "B. cáscara - uva",
      "C. vegetal - corteza",
      "D. aceite - vino",
      "E. ardilla - lobo"
    ]
  },
  {
    "question": "13. ... es a pobreza como abundancia es a ...",
    "options": [
      "A. dinero - ahorro",
      "B. dinero - opulencia",
      "C. riqueza - bienestar",
      "D. escasez - miseria",
      "E. riqueza - escasez"
    ]
  },
  {
    "question": "14. ... es a flotil como soldado es a ...",
    "options": [
      "A. mar - guerra",
      "B. barco - guerra",
      "C. buque - ejército",
      "D. mar - infantería",
      "E. armada - capitán"
    ]
  },
  {
    "question": "15. ... es a alumno como pediatra es a ...",
    "options": [
      "A. educación - salud",
      "B. profesor - médico",
      "C. colegio - maestro",
      "D. libro - puericultor",
      "E. profesor - niño"
    ]
  },
  {
    "question": "16. ... es a azar como recompensa es a ...",
    "options": [
      "A. sorteo - castigo",
      "B. suerte - fortuna",
      "C. destino - elección",
      "D. suerte - mérito",
      "E. premio - dinero"
    ]
  },
  {
    "question": "17. ... es a muelle como avión es a ...",
    "options": [
      "A. puerto - piloto",
      "B. mercancía - nave",
      "C. aterrizaje - pista",
      "D. descarga - comandante",
      "E. barco - hangar"
    ]
  },
  {
    "question": "18. ... es a frecuente como escaso es a ...",
    "options": [
      "A. corriente - bastante",
      "B. ordinario - vulgar",
      "C. abundante - raro",
      "D. suficiente - habitual",
      "E. vulgar - corriente"
    ]
  },
  {
    "question": "19. ... es a despejar como clave es a ...",
    "options": [
      "A. tiempo - aclarar",
      "B. resolver - símbolo",
      "C. ocultar - secreto",
      "D. incógnita - descifrar",
      "E. problema - ocultar"
    ]
  },
  {
    "question": "20. ... es a abandonar como aceptar es a ...",
    "options": [
      "A. desertar - dimitir",
      "B. iniciar - consentir",
      "C. dimitir - renunciar",
      "D. emprender - renunciar",
      "E. huir - rechazar"
    ]
  },
  {
    "question": "21. ... es a avión como timonel es a ...",
    "options": [
      "A. motor - hélice",
      "B. aeropuerto - puerto",
      "C. piloto - embarcación",
      "D. piloto - capitán",
      "E. embarcación - timón"
    ]
  },
  {
    "question": "22. ... es a copia como creación es a ...",
    "options": [
      "A. original - reproducción",
      "B. auténtico - invención",
      "C. falso - fraude",
      "D. real - ficticio",
      "E. imitación - fraude"
    ]
  },
  {
    "question": "23. ... es a cortés como tosco es a ...",
    "options": [
      "A. gentil - grotesco",
      "B. delicado - terco",
      "C. educado - grosero",
      "D. correcto - fino",
      "E. grosero - rudo"
    ]
  },
  {
    "question": "24. ... es a fatiga como bebida es a ...",
    "options": [
      "A. descanso - sed",
      "B. trabajo - sed",
      "C. cansancio - agua",
      "D. sueño - alimento",
      "E. trabajo - alimento"
    ]
  },
  {
    "question": "25. ... es a cuervo como pelo es a ...",
    "options": [
      "A. nido - cabeza",
      "B. ave - animal",
      "C. rapiña - zorro",
      "D. pluma - zorro",
      "E. ave - abrigo"
    ]
  },
  {
    "question": "26. ... es a ganar como desear es a ...",
    "options": [
      "A. trabajar - pedir",
      "B. perder - optar",
      "C. competir - conseguir",
      "D. jugar - escoger",
      "E. participar - aborrecer"
    ]
  },
  {
    "question": "27. ... es a tiempo como inmenso es a ...",
    "options": [
      "A. movimiento - medida",
      "B. momento - vasto",
      "C. eterno - cantidad",
      "D. dilatado - momento",
      "E. medida - cantidad"
    ]
  },
  {
    "question": "28. ... es a caliente como gélido es a ...",
    "options": [
      "A. hirviente - tórrido",
      "B. tórrido - frío",
      "C. tibio - incandescente",
      "D. templado - glaciar",
      "E. fuego - frío"
    ]
  },
  {
    "question": "29. ... es a aceptación como proyecto es a ...",
    "options": [
      "A. promesa - compromiso",
      "B. presupuesto - plano",
      "C. propuesta - ejecución",
      "D. obra - oferta",
      "E. contrato - obligación"
    ]
  },
  {
    "question": "30. ... es a consultar como respuesta es a ...",
    "options": [
      "A. interrogar - argumento",
      "B. aconsejar - duda",
      "C. consejo - réplica",
      "D. preguntar - consejo",
      "E. opinión - disputar"
    ]
  },
  {
    "question": "31. ... es a zanja como arado es a ...",
    "options": [
      "A. cimiento - surco",
      "B. excavar - tierra",
      "C. draga - cultivo",
      "D. excavadora - surco",
      "E. hoyo - siembra"
    ]
  },
  {
    "question": "32. ... es a rechazar como agredir es a ...",
    "options": [
      "A. avanzar - insultar",
      "B. luchar - enemigo",
      "C. repeler - retroceder",
      "D. atacar - repeler",
      "E. golpe - daño"
    ]
  },
  {
    "question": "33. ... es a árbol como manantial es a ...",
    "options": [
      "A. tierra - fuente",
      "B. fruta - roca",
      "C. hierva - nieve",
      "D. tallo - río",
      "E. abono - fuente"
    ]
  },
  {
    "question": "34. ... es a separar como proximidad es a ...",
    "options": [
      "A. unir - cercanía",
      "B. despedida - volver",
      "C. alejar - incluir",
      "D. juntar - distancia",
      "E. cercanía - amistad"
    ]
  },
  {
    "question": "35. ... es a esculpir como cuero es a ...",
    "options": [
      "A. buril - repujar",
      "B. curtir - piel",
      "C. cincel - adornar",
      "D. piedra - repujar",
      "E. estatua - taller"
    ]
  },
  {
    "question": "36. ... es a fino como copioso es a ...",
    "options": [
      "A. subir - arriba",
      "B. delgado - escaso",
      "C. gordo - opulento",
      "D. elegante - exiguo",
      "E. grueso - exiguo"
    ]
  },
  {
    "question": "37. ... es a frase como letra es a ...",
    "options": [
      "A. verbo - escritura",
      "B. escritura - música",
      "C. párrafo - escritura",
      "D. adjetivo - ortografía",
      "E. palabra - palabra"
    ]
  },
  {
    "question": "38. ... es a vigilia como dormir es a ...",
    "options": [
      "A. atención - soñar",
      "B. sueño - velar",
      "C. noche - soñar",
      "D. despertar - fatiga",
      "E. centinela - descansar"
    ]
  },
  {
    "question": "39. ... es a balanza como máquina es a ...",
    "options": [
      "A. campo - herramienta",
      "B. tierra - producción",
      "C. agricultor - ingeniero",
      "D. apero - mecánico",
      "E. apero - fabricación"
    ]
  },
  {
    "question": "40. ... es a seguridad como indicio es a ...",
    "options": [
      "A. policía - crimen",
      "B. sospecha - evidencia",
      "C. justicia - prueba",
      "D. sospecha - orden",
      "E. certeza - persuasión"
    ]
  }
];

// This should be replaced with actual correct answers
const answers = {
  "0": "C", "1": "B", "2": "A", "3": "B", "4": "A",
  "5": "C", "6": "A", "7": "A", "8": "D", "9": "B",
  "10": "B", "11": "B", "12": "E", "13": "C", "14": "E",
  "15": "D", "16": "E", "17": "C", "18": "D", "19": "E",
  "20": "C", "21": "A", "22": "C", "23": "A", "24": "D",
  "25": "C", "26": "C", "27": "B", "28": "C", "29": "A",
  "30": "D", "31": "D", "32": "C", "33": "D", "34": "A",
  "35": "B", "36": "E", "37": "B", "38": "D", "39": "E"
};

// This should be replaced with actual distribution data
const distributionData = [
  { correct_answers: 10, percentile: 25 },
  { correct_answers: 20, percentile: 50 },
  { correct_answers: 30, percentile: 75 },
  { correct_answers: 40, percentile: 100 }
];

const calculatePercentile = (correctAnswers, distribution) => {
  distribution.sort((a, b) => a.correct_answers - b.correct_answers);

  const scores = distribution.map(item => item.correct_answers);
  const percentiles = distribution.map(item => item.percentile);

  const index = scores.findIndex(score => score >= correctAnswers);

  if (index === -1) return 100.0;
  if (scores[index] === correctAnswers) return percentiles[index];

  if (index > 0) {
    const lowerScore = scores[index - 1];
    const lowerPercentile = percentiles[index - 1];
    const upperScore = scores[index];
    const upperPercentile = percentiles[index];

    const slope = (upperPercentile - lowerPercentile) / (upperScore - lowerScore);
    const interpolatedPercentile = lowerPercentile + slope * (correctAnswers - lowerScore);

    return Number(interpolatedPercentile.toFixed(2));
  }

  return 0.0;
};

const gradeTest = (responses) => {
  let score = 0;
  const distribution = distributionData.map(item => ({ correct_answers: item.correct_answers, percentile: item.percentile }));

  if (responses.some(response => response === null)) {
    const indices = responses.map((response, index) => response === null ? index + 1 : null).filter(index => index !== null);
    throw new Error(`No se puede quedar ningun valor en 0. Preguntas sin respuesta: ${indices.join(', ')}`);
  }

  responses.forEach((response, i) => {
    const responseParsed = response.split('.')[0];
    if (responseParsed === answers[i]) {
      score += 1;
    }
  });

  const percentile = calculatePercentile(score, distribution);
  return `Your score: ${percentile}; correct answers: ${score}`;
};

const VerbalTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState('');

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      try {
        const responses = questions.map((_, index) => answers[index] || null);
        const gradeResult = gradeTest(responses);
        setResult(gradeResult);
        setShowResults(true);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateProgress = () => {
    return (Object.keys(answers).length / questions.length) * 100;
  };

  if (showResults) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">{result}</p>
          <p>Thank you for completing the verbal test!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Verbal Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={calculateProgress()} className="w-full" />
        </div>
        <h3 className="mb-4 font-semibold">{questions[currentQuestion].question}</h3>
        <RadioGroup onValueChange={handleAnswer} value={answers[currentQuestion]}>
          {questions[currentQuestion].options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={option} id={`q${currentQuestion}-${index}`} />
              <Label htmlFor={`q${currentQuestion}-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={prevQuestion} disabled={currentQuestion === 0}>Previous</Button>
        <span>{currentQuestion + 1} / {questions.length}</span>
        <Button onClick={nextQuestion}>
          {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VerbalTest;