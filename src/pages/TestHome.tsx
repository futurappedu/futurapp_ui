import { useState } from 'react';
import { User, Pencil, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const { user, logout } = useAuth0(); 
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: user?.name,
    email: user?.email,
    title: "",
    company: "",
    location: "",
    bio: "",
    phone: ""
  });
  const [editingField, setEditingField] = useState<keyof UserData | null>(null);
  const [editValue, setEditValue] = useState("");
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(null);
  const [loadingTests, setIsLoadingTests] = useState(true);
  interface Test {
    id: number;
    name: string;
    label: string;
    url: string;
    score?: number;
    status?: "completed" | "pending";
  }

  const availableTests: Test[] = [
    { id: 1, name: "verbal" , label: "Razonamiento verbal" , url: "/verbal_test" },
    { id: 2, name: "mechanical", label: "Razonamiento mecánico", url: "/mechanical_test" },
    {id: 3, name: "numeric", label: "Razonamiento numérico", url: "/numerical_test"},
    {id: 4, name: "abstract", label: "Razonamiento abstracto", url: "/abstract_test"},
    {id:5, name: "spatial", label: "Razonamiento espacial", url: "/spatial_test"},
    // Add more tests as needed
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

  interface UserData {
    name: string;
    email: string;
    title: string;
    company: string;
    location: string;
    bio: string;
    phone: string;
  }

  const startEditing = (field: keyof UserData, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };

  const saveField = () => {
    if (editingField) {
      setUserData({
        ...userData,
        [editingField]: editValue
      });
      setEditingField(null);
    }
  };

  const cancelEdit = () => {
    setEditingField(null);
  };

  const renderEditableField = (
    label: string,
    field: keyof UserData,
    value: string
  ): JSX.Element => {
    return (
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <Label htmlFor={field} className="text-sm font-medium">{label}</Label>
          {!editingField && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => startEditing(field, value)}
              className="h-8 px-2 text-xs"
            >
              <Pencil size={14} className="mr-1" />
              {value ? "Edit" : "Add"}
            </Button>
          )}
        </div>
        {editingField === field ? (
          <div className="flex items-center gap-2">
            <Input
              id={field}
              type="text"
              value={editValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value)}
              className="h-9"
              placeholder={`Enter your ${label.toLowerCase()}`}
            />
            <Button size="sm" variant="ghost" onClick={saveField} className="h-9 px-2">
              <CheckCircle2 size={16} />
            </Button>
            <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-9 px-2">
              Cancel
            </Button>
          </div>
        ) : (
          <div className="text-sm py-1 px-1">
            {value || <span className="text-muted-foreground italic text-sm">Not provided</span>}
          </div>
        )}
      </div>
    );
  };

  // Submit updated profile to backend
  const handleProfileSubmit = async () => {
    setSubmitStatus(null);
    try {
      const res = await fetch('https://futurappapi-staging.up.railway.app/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (res.ok) {
        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
      }
    } catch (e) {
      setSubmitStatus("error");
    }
  };

  const handleTestClick = (testId: number) => {
    const test = tests.find(t => t.id === testId);
    if (test) {
      navigate(test.url);
    }
  };

  return (
    <div className="container max-w-6xl py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Profile Column */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="flex flex-col items-center text-center pb-2">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="bg-primary/10">
                  <User size={36} className="text-primary" />
                </AvatarFallback>
              </Avatar>
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
              <Alert variant="default" className="bg-primary/5 border-primary/20">
                <AlertTitle className="text-sm font-medium">Rellena tu perfil</AlertTitle>
                <AlertDescription className="text-xs">
                  Agrega información adicional para completar tu perfil y completar los tests faltantes.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
          {/* Additional Information Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Información adicional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {renderEditableField("Title", "title", userData.title)}
              {renderEditableField("Company", "company", userData.company)}
              {renderEditableField("Location", "location", userData.location)}
              {renderEditableField("Phone", "phone", userData.phone)}
              {renderEditableField("Bio", "bio", userData.bio)}
              <Button
                className="mt-2"
                variant="default"
                onClick={handleProfileSubmit}
              >
                Guardar perfil
              </Button>
              {submitStatus === "success" && (
                <div className="text-green-600 text-xs mt-2">Perfil actualizado correctamente.</div>
              )}
              {submitStatus === "error" && (
                <div className="text-red-600 text-xs mt-2">Error al actualizar el perfil.</div>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Tests Column */}
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tus tests</CardTitle>
              <CardDescription>
                Controla tu progreso y accede a los tests que has completado.
              </CardDescription>
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
                  {tests.map((test) => {
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
                          <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
                            Puntaje: {test.score}%
                          </Badge>
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
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}