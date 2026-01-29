import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth0 } from '@auth0/auth0-react';

export default function ProfileCompletionForm() {

    const { user } = useAuth0(); 
    const navigate = useNavigate();
    const authData = {
        name: user?.name ?? "",
        email: user?.email ?? "",
    };

    const [formData, setFormData] = useState<{
        phone_number: string;
        date_of_birth: string;
        citizenship: string;
        city_of_residence: string;
        school: string;
        average_score: string;
        bi_diploma: string;
        graduation_year: string;
        type_of_program: string;
        area_of_interest: string[];
        destination: string[];
        english_level: string;
        study_budget: string;
        sports: string;
        city_characteristics: string;
        five_characteristics: string[];
        about_you: string;
    }>({
        phone_number: "",
        date_of_birth: "",
        citizenship: "",
        city_of_residence: "",
        school: "",
        average_score: "",
        bi_diploma: "",
        graduation_year: "",
        type_of_program: "",
        area_of_interest: [],
        destination: [],
        english_level: "",
        study_budget: "",
        sports: "",
        city_characteristics: "",
        five_characteristics: [],
        about_you: "",
    });

  
    const handleCheckboxChange = (name: string, value: string) => {
        setFormData((prev: any) => {
            const arr = prev[name] || [];
            if (arr.includes(value)) {
                return { ...prev, [name]: arr.filter((v: string) => v !== value) };
            } else {
                return { ...prev, [name]: [...arr, value] };
            }
        });
    };

    const [formState, setFormState] = useState<{
        isSubmitting: boolean;
        isSubmitted: boolean;
        error: string | null;
    }>({
        isSubmitting: false,
        isSubmitted: false,
        error: null
    });



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const fieldLabels: Record<string, string> = {
        phone_number: "Whatsapp",
        date_of_birth: "Fecha de nacimiento",
        citizenship: "Nacionalidad",
        city_of_residence: "Ciudad de residencia",
        school: "Colegio",
        average_score: "Promedio",
        bi_diploma: "¿Bachillerato Internacional?",
        graduation_year: "Año de graduación",
        type_of_program: "Tipo de programa",
        area_of_interest: "Áreas de interés",
        destination: "Destino de interés",
        english_level: "Nivel de inglés",
        study_budget: "Presupuesto de estudios",
        sports: "Deporte",
        city_characteristics: "Tipo de ciudad",
        five_characteristics: "Cinco características más importantes",
        about_you: "Dinos más de ti",
      };
      

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // Check for empty required fields (strings, arrays, numbers)
        // about_you is optional, so exclude it from validation
        const optionalFields = ['about_you'];
        const missingFields = Object.entries(formData)
        .filter(([key, value]) => {
          if (optionalFields.includes(key)) return false; // Skip optional fields
          if (typeof value === "number") return false;
          if (Array.isArray(value)) return value.length === 0;
          return value === "" || value === null || value === undefined;
        })
        .map(([key]) => fieldLabels[key] || key);
      
      if (missingFields.length > 0) {
        setFormState({
          ...formState,
          error: `Por favor, completa los siguientes campos obligatorios: ${missingFields.join(", ")}.`,
        });
        return;
      }
        setFormState({ ...formState, isSubmitting: true, error: null });
    
        try {
            const response = await fetch("https://futurappapi-staging.up.railway.app/insert_student", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...authData,
                    ...formData,
                    bi_diploma: formData.bi_diploma === "yes" ? true : false,
                })
            });
            
            if (!response.ok) {
                throw new Error("Error al enviar los datos. Intenta nuevamente.");
            }
            
            navigate("/scholarship_search");

            setFormState({
                isSubmitting: false,
                isSubmitted: true,
                error: null
            });
        } catch (error: any) {
            setFormState({
                isSubmitting: false,
                isSubmitted: false,
                error: error.message || "Error desconocido"
            });
        }
    };
    const destinationOptions = ["Alemania", "Australia", "Bulgaria", "Canadá", "Chipre", "Escocia", "España", "Estados Unidos", "Francia", "India", "Inglaterra", "Irlanda", "Italia", "Malaysia", "Nueva Zelanda", "Países Bajos", "Reino Unido", "Suiza", "UAE", "No estoy segur@, quiero ver varias opciones", "Otros"];

    const knowledgeareas =  [
        "Negocios y Emprendimiento",
        "Ingeniería y Tecnología",
        "Ciencias de la Computación y Desarrollo de Software",
        "Diseño, Arte y Creatividad Digital",
        "Ciencias Sociales y Humanidades",
        "Psicología y Ciencias del Comportamiento",
        "Comunicación, Marketing y Medios Digitales",
        "Derecho, Política y Relaciones Internacionales",
        "Medicina y Ciencias de la Salud",
        "Biotecnología, Genética y Ciencias Biomédicas",
        "Ciencias Ambientales y Sostenibilidad",
        "Arquitectura y Diseño Urbano",
        "Ciencias Económicas y Finanzas",
        "Educación, Pedagogía y Desarrollo Humano",
        "Matemáticas, Estadística y Ciencia de Datos",
        "Ciberseguridad y Tecnologías de la Información",
        "Inteligencia Artificial y Robótica",
        "Turismo, Hospitalidad y Gestión de Eventos",
        "Producción Audiovisual, Cine y Medios Interactivos",
        "Deporte, Nutrición y Ciencias del Movimiento Humano"
    ];
    const characteristicsOptions = [
        "Tipo y ubicación del campus",
        "Tamaño de la ciudad",
        "Posibilidad de pasantías",
        "Tipo y ubicación de alojamientos",
        "Practicar un deporte específico",
        "Torneos y clubes estudiantiles",
        "Clases con grupos reducidos",
        "Estilo o metodología de enseñanza",
        "Idioma de enseñanza",
        "Nationality mix",
        "Alta exigencia académica",
        "Clima",
        "Ambiente universitario dentro del campus",
        "Afiliación religiosa particular",
        "Infraestructura del campus",
        "Comunidad estudiantil activa",
        "Posibilidad de intercambios",
        "Networking de alto nivel",
        "Alto ranking y prestigio",
        "Fuerte comunidad latina en el campus",
        "Alta empleabilidad luego de graduarme",
        "Retorno de la inversión",
        "Posibilidad de trabajar durante los estudios",
        "Posibilidad de permanecer legalmente luego de graduarme"
    ];

    if (formState.isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-500" />
                        <CardTitle>¡Perfil completado!</CardTitle>
                        <CardDescription>
                            Gracias por completar tu perfil. ¡Tu viaje ha comenzado!
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Button onClick={() => window.location.href = "/dashboard"}>
                            Ir al Panel
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div>
                            <CardTitle>Completa tu perfil</CardTitle>
                            <CardDescription>Configura tu perfil para comenzar tu viaje</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Pre-filled Auth0 Information */}
                         {/* SECCIÓN: INFORMACIÓN PERSONAL */}
          <div>
            <h2 className="text-lg font-bold mb-4">Información Personal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Nombre</Label>
                                <Input 
                                    id="name" 
                                    value={authData.name} 
                                    disabled 
                                    className="bg-gray-100"
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    value={authData.email} 
                                    disabled 
                                    className="bg-gray-100"
                                />
                            </div>
                        </div>

                        {/* Additional Profile Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="date_of_birth">Fecha de nacimiento</Label>
                                <Input
                                    id="date_of_birth"
                                    name="date_of_birth"
                                    type="date"
                                    value={formData.date_of_birth}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone_number">Whatsapp</Label>
                                <Input 
                                    id="phone_number" 
                                    name="phone_number"
                                    placeholder="+593 99 999 9999" 
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Citizenship */}
                            <div>
                                <Label htmlFor="citizenship">Nacionalidad</Label>
                                <Input
                                    id="citizenship"
                                    name="citizenship"
                                    value={formData.citizenship}
                                    onChange={handleChange}
                                />
                            </div>
                            {/* City of Residence */}
                            <div>
                                <Label htmlFor="city_of_residence">Ciudad de residencia</Label>
                                <Input
                                    id="city_of_residence"
                                    name="city_of_residence"
                                    value={formData.city_of_residence}
                                    onChange={handleChange}
                                />
                            </div>
                            {/* School */}
                            <div>
                                <Label htmlFor="school">Colegio</Label>
                                <Input
                                    id="school"
                                    name="school"
                                    value={formData.school}
                                    onChange={handleChange}
                                />
                            </div>
                            {/* Average Grade */}
                            <div>
                                <Label htmlFor="average_score">Promedio (En Escala de 10)</Label>
                                <Input
                                    id="average_score"
                                    name="average_score"
                                    type="text"
                                    inputMode="decimal"
                                    pattern="^\d+(\.\d{1,2})?$"
                                    placeholder="Ej: 8.5"
                                    value={formData.average_score}
                                    onChange={e => {
                                        // Only allow numbers and dot as decimal separator
                                        const val = e.target.value.replace(/[^0-9.]/g, '');
                                        setFormData(prev => ({ ...prev, average_score: val }));
                                    }}
                                />
                                <span className="text-xs text-gray-500">Usa punto (.) como separador decimal. Ejemplo: 8.5</span>
                            </div>
                            {/* Bi Diploma */}
                            <div>
                                <Label htmlFor="bi_diploma">¿Bachillerato Internacional?</Label>
                                <Select
                                    value={formData.bi_diploma}
                                    onValueChange={value => setFormData(prev => ({ ...prev, bi_diploma: value }))}
                                >
                                    <SelectTrigger id="bi_diploma">
                                        <SelectValue placeholder="Selecciona" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="yes">Sí</SelectItem>
                                        <SelectItem value="no">No</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Graduation Date */}
                            <div>
                                <Label htmlFor="graduation_year">Año de graduación</Label>
                                <Input
                                    id="graduation_year"
                                    name="graduation_year"
                                    type="number"
                                    min="1950"
                                    max="2040"
                                    value={formData.graduation_year}
                                    onChange={handleChange}
                                />
                            </div>
                             {/* English Level */}
                             <div>
                                <Label htmlFor="english_level">Nivel de inglés</Label>
                                <Select
                                    value={formData.english_level}
                                    onValueChange={value => setFormData(prev => ({ ...prev, english_level: value }))}
                                >
                                    <SelectTrigger id="english_level">
                                        <SelectValue placeholder="Selecciona" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Alto">Alto</SelectItem>
                                        <SelectItem value="Medio Alto">Medio Alto</SelectItem>
                                        <SelectItem value="Medio">Medio</SelectItem>
                                        <SelectItem value="Bajo">Bajo</SelectItem>
                                        <SelectItem value="Ningun conocimiento del idioma inglés">Ningún conocimiento del idioma inglés</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Sports Practice */}
                            <div>
                                <Label htmlFor="sports">¿Practicas algún deporte de forma competitiva? ¿Cuál?
                                </Label>
                                <Input
                                    id="sports"
                                    name="sports"
                                    value={formData.sports}
                                    onChange={handleChange}
                                />
                            </div>
                            {/* Study Budget */}
                            <div>
                                <Label htmlFor="study_budget">Presupuesto de estudios</Label>
                                <Select
                                    value={formData.study_budget}
                                    onValueChange={value => setFormData(prev => ({ ...prev, study_budget: value }))}
                                >
                                    <SelectTrigger id="study_budget">
                                        <SelectValue placeholder="Selecciona" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7.000 USD- 12.000 USD por año">7.000 USD- 12.000 USD por año</SelectItem>
                                        <SelectItem value="12.000 USD - 17.000 USD por año">12.000 USD - 17.000 USD por año</SelectItem>
                                        <SelectItem value="25.000 USD - 35.000 USD por año">25.000 USD - 35.000 USD por año</SelectItem>
                                        <SelectItem value="35.000 USD en adelante">35.000 USD en adelante</SelectItem>
                                        <SelectItem value="No tengo problemas con el presupuesto">No tengo problemas con el presupuesto</SelectItem>
                                        <SelectItem value="No cuento con presupuesto">No cuento con presupuesto</SelectItem>
                                    </SelectContent>
                                </Select>
                                <span className="text-xs text-gray-500">El presupuesto incluye tanto costo de estudios como costos de vida</span>
                            </div>
                        </div>
                        </div>
                        <Separator />
                        <div>
                    <h2 className="text-lg font-bold mb-4">Intereses Académicos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                            {/* Program Interest */}
                            <div>
                                <Label htmlFor="type_of_program">Tipo de programa</Label>
                                <Select
                                    value={formData.type_of_program}
                                    onValueChange={value => setFormData(prev => ({ ...prev, type_of_program: value }))}
                                >
                                    <SelectTrigger id="type_of_program">
                                        <SelectValue placeholder="Selecciona" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pregrado">Pregrado</SelectItem>
                                        <SelectItem value="Posgrado">Posgrado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            
                            
                            {/* Destination Interest - IMPROVED WITH SHADCN CHECKBOXES */}
                            <div className="col-span-2">
                                <Label className="text-base font-medium mb-2 block">Destino de interés</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border rounded-md p-4 bg-gray-50">
                                    {destinationOptions.map((option) => (
                                        <div key={option} className="flex items-center space-x-2">
                                            <Checkbox 
                                                id={`destination-${option}`}
                                                checked={formData.destination.includes(option)}
                                                onCheckedChange={() => handleCheckboxChange("destination", option)}
                                            />
                                            <Label 
                                                htmlFor={`destination-${option}`}
                                                className="text-sm font-normal"
                                            >
                                                {option}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* City Interest */}
                            <div>
                                <Label htmlFor="city_characteristics">Tipo de ciudad</Label>
                                <Select
                                    value={formData.city_characteristics}
                                    onValueChange={value => setFormData(prev => ({ ...prev, city_characteristics: value }))}
                                >
                                    <SelectTrigger id="city_characteristics">
                                        <SelectValue placeholder="Selecciona" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pequeña y tranquila">Pequeña y tranquila</SelectItem>
                                        <SelectItem value="Mediana y manejable pero activa">Mediana y manejable pero activa</SelectItem>
                                        <SelectItem value="Grande y cosmopolita">Grande y cosmopolita</SelectItem>
                                        <SelectItem value="Me da igual, tengo otras prioridades">Me da igual, tengo otras prioridades</SelectItem>
                                        <SelectItem value="Ya se en qué ciudad estudiar y eso no es negociable">Ya sé en qué ciudad estudiar y eso no es negociable</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                                                        {/* Area Interest */}
                                                        <div className="col-span-2">
                                <div className="flex justify-between mb-2">
                                    <Label className="text-base font-medium">Areas de interés</Label>
                                    <Badge variant="outline">
                                        {formData.area_of_interest.length}/2 seleccionadas
                                    </Badge>
                                </div>
                                <div className="border rounded-md p-4 bg-gray-50 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {knowledgeareas.map((option) => (
                                            <div key={option} className="flex items-center space-x-2">
                                                <Checkbox 
                                                    id={`area-${option}`}
                                                    checked={formData.area_of_interest.includes(option)}
                                                    onCheckedChange={() => {
                                                        if (
                                                            !formData.area_of_interest.includes(option) &&
                                                            formData.area_of_interest.length >= 2
                                                        ) return;
                                                        handleCheckboxChange("area_of_interest", option);
                                                    }}
                                                    disabled={!formData.area_of_interest.includes(option) && formData.area_of_interest.length >= 2}
                                                />
                                                <Label 
                                                    htmlFor={`area-${option}`}
                                                    className="text-sm font-normal"
                                                >
                                                    {option}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Puedes seleccionar hasta 2 opciones.</p>
                            </div>
                            
                            {/* Five Characteristics - IMPROVED WITH SHADCN CHECKBOXES */}
                            <div className="col-span-2">
                                <div className="flex justify-between mb-2">
                                    <Label className="text-base font-medium">Cinco características más importantes</Label>
                                    <Badge variant="outline">
                                        {formData.five_characteristics.length}/5 seleccionadas
                                    </Badge>
                                </div>
                                <div className="border rounded-md p-4 bg-gray-50 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {characteristicsOptions.map((option) => (
                                            <div key={option} className="flex items-center space-x-2">
                                                <Checkbox 
                                                    id={`characteristic-${option}`}
                                                    checked={formData.five_characteristics.includes(option)}
                                                    onCheckedChange={() => {
                                                        if (
                                                            !formData.five_characteristics.includes(option) &&
                                                            formData.five_characteristics.length >= 5
                                                        ) return;
                                                        handleCheckboxChange("five_characteristics", option);
                                                    }}
                                                    disabled={!formData.five_characteristics.includes(option) && formData.five_characteristics.length >= 5}
                                                />
                                                <Label 
                                                    htmlFor={`characteristic-${option}`}
                                                    className="text-sm font-normal"
                                                >
                                                    {option}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Puedes seleccionar hasta 5 opciones.</p>
                            </div>
                            
                            {/* About You - Optional */}
                            <div className="col-span-2">
                                <Label htmlFor="about_you">Dinos más de ti y de lo que buscas (opcional)</Label>
                                <Textarea
                                    id="about_you"
                                    name="about_you"
                                    placeholder="Cuéntanos un poco sobre ti, tus metas, y qué buscas en tu experiencia de estudios en el extranjero..."
                                    value={formData.about_you}
                                    onChange={handleChange}
                                    className="min-h-[100px]"
                                />
                            </div>
                            
                            <Separator className="col-span-2 my-2" />


                            {formState.error && (
                                <Alert variant="destructive" className="col-span-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{formState.error}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    
                
                <CardFooter className="flex justify-end">
                    <Button 
                        type="submit"
                        disabled={formState.isSubmitting}
                    >
                        {formState.isSubmitting ? "Enviando..." : "Completar perfil"}
                    </Button>
                </CardFooter>
                </form>
                </CardContent>
            </Card>
            
        </div>
    );
}