import { useState } from 'react';
import {  CheckCircle2, Clock, ArrowRight, FileDown } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Svg, Polygon, G, Text as PdfText } from '@react-pdf/renderer';


function getHexagonPoints(scores: Record<string, number>, maxScore = 30, radius = 70, cx = 100, cy = 100) {
  const labels = ['R', 'I', 'A', 'S', 'E', 'C'];
  return labels.map((label, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const score = scores[label] || 0;
    const r = (score / maxScore) * radius;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');
}

function getHexagonBasePoints(radius = 70, cx = 100, cy = 100) {
  return Array.from({ length: 6 }).map((_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');
}
// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 8,
  },
  testName: {
    width: '70%',
    fontSize: 12,
  },
  testScore: {
    width: '30%',
    fontSize: 12,
    textAlign: 'right',
  },
  completionInfo: {
    marginTop: 15,
    fontSize: 12,
    color: '#6b7280',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 10,
  },
});

// PDF Document Component
interface ScoreReportProps {
  userData: {
    name: string;
    email: string;
    title?: string;
    company?: string;
    location?: string;
    bio?: string;
    phone?: string;
  };
  tests: {
    id: number;
    name: string;
    label: string;
    url: string;
    score?: number;
    status?: "completed" | "pending";
  }[];
  completedTests: number;
}

const ScoreReport = ({ userData, tests, completedTests }: ScoreReportProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Reporte de Tests</Text>
        <Text style={styles.subtitle}>{userData.name} ({userData.email})</Text>
        {userData.title && <Text style={styles.subtitle}>{userData.title} at {userData.company || 'N/A'}</Text>}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resultados</Text>
        
        <View style={styles.row}>
          <Text style={[styles.testName, { fontWeight: 'bold' }]}>Nombre del test</Text>
          <Text style={[styles.testScore, { fontWeight: 'bold' }]}>Puntaje</Text>
        </View>
        
        {tests.map((test) => (
          <View key={test.id} style={styles.row}>
            <Text style={styles.testName}>{test.label}</Text>
            <Text style={styles.testScore}>
              {test.status === "completed" ? `${test.score}%` : "Pending"}
            </Text>
          </View>
        ))}
        
        {/* RIASEC Hexagon */}
{(() => {
  // Find the RIASEC scores (assuming you store them in the Realista test)
  const riasecTest = tests.find(t => t.name === "Realista" && t.score && typeof t.score === "object");
  const riasecScores = riasecTest?.score as Record<string, number> | undefined;
  if (!riasecScores) return null;

  const labels = ['R', 'I', 'A', 'S', 'E', 'C'];
  const labelNames: Record<string, string> = {
    R: "Realista", I: "Investigativo", A: "Artistico", S: "Social", E: "Emprendedor", C: "Convencional"
  };

  return (
    <View style={{ marginTop: 30, alignItems: 'center' }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Perfil RIASEC</Text>
      <Svg width="200" height="200" viewBox="0 0 200 200">
        {/* Hexagon base */}
        <Polygon
          points={getHexagonBasePoints(70, 100, 100)}
          stroke="#999"
          strokeWidth={2}
          fill="none"
        />
        {/* Profile polygon */}
        <Polygon
          points={getHexagonPoints(riasecScores, 30, 70, 100, 100)}
          fill="rgba(30,144,255,0.4)"
          stroke="#1e90ff"
          strokeWidth={2}
        />
        {/* Labels */}
        {labels.map((label, i) => {
          const angle = (Math.PI / 3) * i - Math.PI / 2;
          const x = 100 + 85 * Math.cos(angle);
          const y = 100 + 85 * Math.sin(angle);
          return (
            <G key={label}>
              <PdfText x={x - 10} y={y + 5} >{labelNames[label]}</PdfText>
            </G>
          );
        })}
      </Svg>
      <View style={{ marginTop: 8 }}>
        {labels.map(label => (
          <Text key={label} style={{ fontSize: 10 }}>
            {labelNames[label]}: {riasecScores[label] ?? 0}
          </Text>
        ))}
      </View>
    </View>
  );
})()}
        <Text style={styles.completionInfo}>
          Tests completados: {completedTests} de {tests.length} ({Math.round((completedTests / tests.length) * 100)}%)
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Text>Reporte generado {new Date().toLocaleDateString()}</Text>
      </View>
    </Page>
  </Document>
);

export default function UserProfile() {
  const { user, logout } = useAuth0(); 
  const navigate = useNavigate();
  const [userData] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    title: "",
    company: "",
    location: "",
    bio: "",
    phone: ""
  });
  const [loadingTests, setIsLoadingTests] = useState(true);
  
  interface Test {
    id: number;
    name: string;
    label: string;
    url: string;
    score?: number;
    status?: "completed" | "pending";
    hideInTable?: boolean; 
  }

  const availableTests = [
    { id: 1, name: "verbal" , label: "Razonamiento verbal" , url: "/verbal_test" },
    { id: 2, name: "mechanical", label: "Razonamiento mecánico", url: "/mechanical_test" },
    { id: 3, name: "numeric", label: "Razonamiento numérico", url: "/numerical_test"},
    { id: 4, name: "abstract", label: "Razonamiento abstracto", url: "/abstract_test"},
    { id: 5, name: "spatial", label: "Razonamiento espacial", url: "/spatial_test"},
    { id: 6, name: "Realista", label: "Test de personalidad", url: "/personality_test" },
    { id: 7, name: "Investigativo", label: "Investigativa", url: "/personality_test", hideInTable: true },
  { id: 8, name: "Artistico", label: "Artística", url: "/personality_test", hideInTable: true },
  { id: 9, name: "Social", label: "Social", url: "/personality_test" , hideInTable: true },
  { id: 10, name: "Emprendedor", label: "Emprendedora", url: "/personality_test", hideInTable: true },
  { id: 11, name: "Convencional", label: "Convencional", url: "/personality_test", hideInTable: true }
  ];

  const [tests, setTests] = useState<Test[]>([]);

  useEffect(() => {
    if (!user?.email) return;
    setIsLoadingTests(true); // Start loading
    Promise.all(
      availableTests.map(async (test) => {
        const res = await fetch('https://futurappapi-staging.up.railway.app/scores-tests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            testType: test.name
          })
        });
        const data = await res.json();
        return {
          ...test,
          score: typeof data.score === 'number' ? data.score : undefined,
          status: data.completed ? "completed" as const : "pending" as const
        };
      })
    ).then(setTests)
     .finally(() => setIsLoadingTests(false)); // Stop loading
  }, [user?.email, user?.name]);

  const completedTests = tests.filter(test => test.status === "completed").length;
  const completionPercentage = (completedTests / tests.length) * 100;


  const handleTestClick = (testId: number) => {
    const test = tests.find(t => t.id === testId);
    if (test) {
      navigate(test.url);
    }
  };

  // Handle PDF generation

  return (
    <div className="container max-w-6xl py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Profile Column */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="flex flex-col items-center text-center pb-2">
              <CardTitle className="text-xl">{userData.name}</CardTitle>
              <CardDescription className="text-sm">{userData.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Progreso</Label>
                <Progress value={completionPercentage} className="h-2" />
                <div className="text-xs text-right text-muted-foreground">
                  {completedTests} de {tests.length} tests completados
                </div>
              </div>
              <Separator />              
            </CardContent>
          </Card>
          
        </div>
        {/* Tests Column */}
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Tus tests</CardTitle>
                <CardDescription>
                  Controla tu progreso y accede a los tests que has completado.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {loadingTests ? (
                <div className="flex justify-center items-center h-32">
                  <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  <span className="ml-4 text-primary text-lg">Cargando tests...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {tests
                  .filter(test => !test.hideInTable)
                  .map((test) => {
                    const isCompleted = test.status === "completed";
                    return (
                      <div
                        key={test.id}
                        className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                          !isCompleted
                            ? "hover:bg-accent/50 cursor-pointer"
                            : "bg-muted/50 cursor-not-allowed opacity-70"
                        }`}
                        onClick={() => {
                          if (!isCompleted) handleTestClick(test.id);
                        }}
                        tabIndex={isCompleted ? -1 : 0}
                        aria-disabled={isCompleted}
                      >
                      <div className="flex items-center gap-3">
                        {isCompleted ? (
                          <div className="rounded-full p-2 bg-green-100">
                            <CheckCircle2 size={20} className="text-green-600" />
                          </div>
                        ) : (
                          <div className="rounded-full p-2 bg-amber-100">
                            <Clock size={20} className="text-amber-600" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium text-sm">{test.label}</h3>
                          <p className="text-xs text-muted-foreground">
                            {isCompleted ? "Completado" : "Pendiente"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                      {isCompleted ? (
  test.name !== "Realista" ? (
    <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
      Puntaje: {test.score}%
    </Badge>
  ) : (
    <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
      Completado
    </Badge>
  )
) : (
  <Badge variant="outline" className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200">
    Empieza el test
  </Badge>
)}
                        <ArrowRight
                          size={16}
                          className={`text-muted-foreground ${isCompleted ? "opacity-40 pointer-events-none" : ""}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            </CardContent>
            <CardFooter>
              <Alert variant="default" className="w-full bg-muted/50">
                <AlertDescription className="text-xs text-muted-foreground">
                  Los resultados de los tests se guardan automáticamente.
                </AlertDescription>
              </Alert>
            </CardFooter>
             {/* PDF Download Section */}
             <div className="pt-2">
                {!loadingTests ? (
                  <PDFDownloadLink
                    document={<ScoreReport userData={userData} tests={tests} completedTests={completedTests} />}
                    fileName={`score-report-${(userData.name ?? 'usuario').replace(/\s+/g, '-').toLowerCase()}.pdf`}
                    className="w-full"
                  >
                    {({ loading }) => (
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center justify-center"
                        disabled={loading}
                      >
                        <FileDown size={16} className="mr-2" />
                        {loading ? 'Generando PDF...' : 'Descargar Reporte PDF de los Tests'}
                      </Button>
                    )}
                  </PDFDownloadLink>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    <FileDown size={16} className="mr-2" />
                    Cargando datos...
                  </Button>
                )}
                {/* Recomendador IA Button */}
  {completedTests === tests.length && (
    <Button
      variant="default"
      className="w-full mt-4"
      onClick={() => {
        navigate("/career_recommender");
      }}
    >
      Recomendador IA
    </Button>
  )}
              </div>
          </Card>
          {/* Basic Information Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Información de usuario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Nombre</Label>
                  <div className="text-sm py-2">{userData.name}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <div className="text-sm py-2">{userData.email}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}