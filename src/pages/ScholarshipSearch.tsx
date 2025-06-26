import { useState, useEffect, useRef } from 'react';
import { Search, Filter, Calculator, GraduationCap, DollarSign, MapPin, Building2, Award, Percent } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';

export default function UniversityPlanner() {
  // State management
  const [searchProgram, setSearchProgram] = useState('');
  const [searchUniversity, setSearchUniversity] = useState('');
  const [selectedConvenio, setSelectedConvenio] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedProgramType, setSelectedProgramType] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [scholarshipOnly, setScholarshipOnly] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [resultCount, setResultCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const scrollAreaRef = useRef<HTMLDivElement>(null);


  const convenios = ['Erasmus+', 'Fulbright', 'DAAD', 'Chevening'];
  const countries = ['España', 'Reino Unido', 'Alemania', 'Francia', 'Estados Unidos'];
  const programTypes = ['Grado', 'Máster', 'Doctorado', 'MBA'];

  useEffect(() => {
    setVisibleCount(20);
  }, [programs]);


  useEffect(() => {
  const handleScroll = () => {
    const el = scrollAreaRef.current;
    if (!el) return;
    // Only load more if there are more programs to show
    if (
      el.scrollTop + el.clientHeight >= el.scrollHeight - 100 &&
      visibleCount < programs.length
    ) {
      setVisibleCount((prev) => Math.min(prev + 20, programs.length));
    }
  };
  const el = scrollAreaRef.current;
  if (el) el.addEventListener('scroll', handleScroll);
  return () => {
    if (el) el.removeEventListener('scroll', handleScroll);
  };
}, [visibleCount, programs.length]);
  
  const searchPrograms = async () => {
    setLoading(true);
    try {
      // Build filters from current state
      const filtros: Record<string, any> = {};

if (searchProgram.trim()) filtros.nombre_programa = searchProgram.trim();
if (searchUniversity.trim()) filtros.universidad = searchUniversity.trim();
if (selectedConvenio && selectedConvenio !== 'all') filtros.convenio = selectedConvenio;
if (selectedCountry && selectedCountry !== 'all') filtros.destino = selectedCountry;
if (selectedProgramType && selectedProgramType !== 'all') filtros.tipo_programa = selectedProgramType;
if (scholarshipOnly) filtros.beca = true;
if (priceRange && priceRange.length === 2) {
  filtros.min_cost = priceRange[0];
  filtros.max_cost = priceRange[1];
}
  
      const res = await fetch('https://futurappapi-staging.up.railway.app/filter_results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filtros),
      });
  
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
  
      setPrograms(data);
      setVisibleCount(20);
      setResultCount(data.length);
    } catch (err) {
      setPrograms([]);
      setResultCount(0);
      // Optionally handle error (e.g., set an error state)
    } finally {
      setLoading(false);
    }
  };

interface Program {
    id: number;
    nombre_programa: string;
    universidad: string;
    pais: string;
    tipo_programa: string;
    precio_min_anual: number;
    precio_max_anual: number;
    convenio: string;
}

interface Scholarship {
    id: number;
    nombre_beca: string;
    tipo_beca: string;
    tipo_de_estudiante: string;
    cobertura_de_la_beca: string;
    monto_beca_desde?: number;
    monto_beca_hasta?: number;
    porcentaje_beca_desde?: number;
    porcentaje_beca_hasta?: number;
    duracion_de_la_beca: string;
}

const loadScholarships = async (program: Program): Promise<void> => {
    setScholarships([]); // Clear previous scholarships
    try {
        const params = new URLSearchParams({
            programa_texto: program.nombre_programa,
            universidad: program.universidad
        });
        const res = await fetch(`https://futurappapi-staging.up.railway.app/becas?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const becas: Scholarship[] = await res.json();

        setScholarships(becas || []);
        // Optionally, you can also reset selectedScholarship if no becas
        if (!becas.length) setSelectedScholarship(null);
    } catch (e) {
        setScholarships([]);
        setSelectedScholarship(null);
        // Optionally, handle error state here
    }
};

  // Investment calculation
  const calculateInvestment = () => {
    if (!selectedProgram || !selectedScholarship) return null;

    const pMin = selectedProgram.precio_min_anual;
    const pMax = selectedProgram.precio_max_anual;
    const mMin = selectedScholarship.monto_beca_desde || 0;
    const mMax = selectedScholarship.monto_beca_hasta || 0;
    const pctMin = selectedScholarship.porcentaje_beca_desde || 0;
    const pctMax = selectedScholarship.porcentaje_beca_hasta || 0;

    // Fixed amount coverage
    const residualFixedMin = Math.max(0, pMin - mMax);
    const residualFixedMax = Math.max(0, pMax - mMin);

    // Percentage coverage
    const coveragePercentMin = pMin * (pctMin / 100);
    const coveragePercentMax = pMax * (pctMax / 100);
    const residualPercentMin = Math.max(0, pMin - coveragePercentMax);
    const residualPercentMax = Math.max(0, pMax - coveragePercentMin);

    return {
      program: selectedProgram,
      scholarship: selectedScholarship,
      tuitionRange: { min: pMin, max: pMax },
      fixedAmount: { min: mMin, max: mMax },
      percentageRange: { min: pctMin, max: pctMax },
      residualFixed: { min: residualFixedMin, max: residualFixedMax },
      residualPercent: { min: residualPercentMin, max: residualPercentMax },
      coverageAmount: { min: coveragePercentMin, max: coveragePercentMax }
    };
  };

  const calculation = calculateInvestment();

  // Show only the visible programs based on visibleCount
  const visiblePrograms = programs.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            University Planner
          </h1>
          <p className="text-gray-600">Encuentra el programa universitario perfecto y calcula tu inversión</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Filters Panel */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar programa..."
                    value={searchProgram}
                    onChange={(e) => setSearchProgram(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar universidad..."
                    value={searchUniversity}
                    onChange={(e) => setSearchUniversity(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Button onClick={searchPrograms} className="w-full" disabled={loading}>
                  {loading ? 'Buscando...' : 'Buscar'}
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Convenio</label>
                  <Select value={selectedConvenio} onValueChange={setSelectedConvenio}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los convenios" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {convenios.map(conv => (
                        <SelectItem key={conv} value={conv}>{conv}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">País</label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los países" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Tipo de programa</label>
                  <Select value={selectedProgramType} onValueChange={setSelectedProgramType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {programTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Rango de precio: €{priceRange[0].toLocaleString()} - €{priceRange[1].toLocaleString()}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100000}
                    min={0}
                    step={1000}
                    className="mt-2"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="scholarship-only"
                    checked={scholarshipOnly}
                    onCheckedChange={checked => setScholarshipOnly(checked === true)}
                  />
                  <label htmlFor="scholarship-only" className="text-sm font-medium">
                    Solo con beca
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Resultados</CardTitle>
              <CardDescription>
                Mostrando {resultCount} programas
              </CardDescription>
            </CardHeader>
            <CardContent>
            <div
              ref={scrollAreaRef}
              className="h-[600px] overflow-y-auto"
            >
                  <div className="space-y-4">
                    {visiblePrograms.map(program => (
                      <Card 
                        key={program.id} 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedProgram?.id === program.id ? 'ring-2 ring-indigo-500' : ''
                        }`}
                        onClick={() => {
                          setSelectedProgram(program);
                          loadScholarships(program);
                          setSelectedScholarship(null);
                        }}
                      >
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2">{program.nombre_programa}</h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              {program.universidad}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {program.pais}
                            </div>
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4" />
                              {program.tipo_programa}
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              €{program.precio_min_anual.toLocaleString()} - €{program.precio_max_anual.toLocaleString()}
                            </div>
                          </div>
                          <div className="mt-2">
                            <Badge variant="secondary">{program.convenio}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {visibleCount >= programs.length && (
      <div className="text-xs text-gray-500 text-center mt-2">
        Todos los resultados cargados.
      </div>
    )}
  

                  </div>
                
              </div>
            </CardContent>
          </Card>

          {/* Right Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Scholarships */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Becas disponibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[280px]">
                  {scholarships.length === 0 ? (
                    <p className="text-gray-500 text-sm">Selecciona un programa para ver las becas</p>
                  ) : (
                    <div className="space-y-3">
                      {scholarships.map(scholarship => (
                        <Card 
                          key={scholarship.id}
                          className={`cursor-pointer transition-all hover:shadow-sm ${
                            selectedScholarship?.id === scholarship.id ? 'ring-2 ring-green-500' : ''
                          }`}
                          onClick={() => setSelectedScholarship(scholarship)}
                        >
                          <CardContent className="p-3">
                            <h4 className="font-medium text-sm mb-1">{scholarship.nombre_beca}</h4>
                            <div className="space-y-1 text-xs text-gray-600">
                              <p>{scholarship.tipo_beca}</p>
                              <p>Para: {scholarship.tipo_de_estudiante}</p>
                              <p>{scholarship.cobertura_de_la_beca}</p>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                €{scholarship.monto_beca_desde?.toLocaleString()} - €{scholarship.monto_beca_hasta?.toLocaleString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Percent className="h-3 w-3" />
                                {scholarship.porcentaje_beca_desde}% - {scholarship.porcentaje_beca_hasta}%
                              </div>
                            </div>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {scholarship.duracion_de_la_beca}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Investment Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Cálculo de inversión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[280px]">
                  {!calculation ? (
                    <p className="text-gray-500 text-sm">Selecciona un programa y una beca para ver el cálculo</p>
                  ) : (
                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-medium text-base mb-2">Programa seleccionado</h4>
                        <p className="font-medium">{calculation.program.nombre_programa}</p>
                        <p className="text-gray-600">{calculation.program.universidad}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <DollarSign className="h-3 w-3" />
                          <span>Tuition anual: €{calculation.tuitionRange.min.toLocaleString()} - €{calculation.tuitionRange.max.toLocaleString()}</span>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium text-base mb-2">Beca seleccionada</h4>
                        <p className="font-medium">{calculation.scholarship.nombre_beca}</p>
                        <p className="text-gray-600">({calculation.scholarship.tipo_beca})</p>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-2">Cobertura por monto fijo</h4>
                        <p>La beca financia entre €{calculation.fixedAmount.min.toLocaleString()} y €{calculation.fixedAmount.max.toLocaleString()}</p>
                        <p className="font-medium text-green-600 mt-1">
                          Residual anual: €{calculation.residualFixed.min.toLocaleString()} - €{calculation.residualFixed.max.toLocaleString()}
                        </p>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-2">Cobertura por porcentaje</h4>
                        <p>La beca cubre entre {calculation.percentageRange.min}% y {calculation.percentageRange.max}% del tuition</p>
                        <p>Valor monetario: €{calculation.coverageAmount.min.toLocaleString()} - €{calculation.coverageAmount.max.toLocaleString()}</p>
                        <p className="font-medium text-green-600 mt-1">
                          Residual anual: €{calculation.residualPercent.min.toLocaleString()} - €{calculation.residualPercent.max.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

