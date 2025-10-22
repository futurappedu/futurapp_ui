import { useState, useEffect, useRef } from 'react';
import { Search, Filter, Calculator, GraduationCap, DollarSign, MapPin, Building2, Award, Percent, Star, Clock, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { useNavigate } from 'react-router-dom';

interface Program {
  id: number;
  nombre_programa: string;
  universidad: string;
  pais: string;
  tipo_programa: string;
  precio_min_anual: number;
  precio_max_anual: number;
  moneda_de_importe: string;
  enlace: string;
}

interface Scholarship {
  id: number;
  nombre_beca: string;
  tipo_beca: string;
  tipo_de_estudiante: string;
  cobertura_de_la_beca: string;
  universidad?: string;
  monto_beca_desde?: number;
  monto_beca_hasta?: number;
  porcentaje_beca_desde?: number;
  porcentaje_beca_hasta?: number;
  duracion_de_la_beca: string;
}

export default function ScholarshipSearch() {
  const navigate = useNavigate();
  const [searchProgram, setSearchProgram] = useState('');
  const [searchUniversity, setSearchUniversity] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedProgramTypes, setSelectedProgramTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [scholarshipOnly, setScholarshipOnly] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [resultCount, setResultCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [countries, setCountries] = useState<string[]>([]);
  const [programTypes, setProgramTypes] = useState<string[]>([]);
  const [scholarshipTypes, setScholarshipTypes] = useState<string[]>([]);
  const [selectedScholarshipType, setSelectedScholarshipType] = useState('all');
  const [durationRange, setDurationRange] = useState([1, 10]); // Default max 10 years
  const [maxDuration, setMaxDuration] = useState(10);
  const [studentBudget, setStudentBudget] = useState<number>(0);

  const isInitialMount = useRef(true);
  useEffect(() => {
    setVisibleCount(20);
  }, [programs]);

  useEffect(() => {
    const handleScroll = () => {
      const el = scrollAreaRef.current;
      if (!el) return;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100 && visibleCount < programs.length) {
        setVisibleCount((prev) => Math.min(prev + 20, programs.length));
      }
    };
    const el = scrollAreaRef.current;
    if (el) el.addEventListener('scroll', handleScroll);
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
    };
  }, [visibleCount, programs.length]);
  
  useEffect(() => {
    const fetchFilters = async () => {
      setFiltersLoading(true);
      try {
        const res = await fetch('https://futurappapi-staging.up.railway.app/filter_options');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setCountries(data.paises || []);
        setProgramTypes(data.tipos || []);
        setScholarshipTypes(data.tipos_beca || []);

        // Set max duration from backend
      if (data.duracion) {
        setMaxDuration(data.duracion);
        setDurationRange([1, data.duracion]);
      }
      
       // Set price range from backend
      if (data.min_price !== undefined && data.max_price !== undefined) {
        setMinPrice(data.min_price);
        setMaxPrice(data.max_price);
        setPriceRange([data.min_price, data.max_price]);
      }

  

      } catch (err) {
        console.error('Error loading filters:', err);
        setCountries([]);
        setProgramTypes([]);
        setScholarshipTypes([]);
      } finally {
        setFiltersLoading(false);
      }
    };
    fetchFilters();
  }, []);

useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      searchPrograms(); // Load all programs on mount
    }
  }, []);

  useEffect(() => {
    // Skip the initial mount (already handled above)
    if (isInitialMount.current) return;

    // Debounce: wait 500ms after last filter change
    const timeoutId = setTimeout(() => {
      searchPrograms();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    selectedCountries,
    selectedProgramTypes,
    priceRange,
    durationRange,
    scholarshipOnly,
    selectedScholarshipType,
    // Note: searchProgram and searchUniversity are NOT here
    // because those should only trigger on button click
  ]);

  const searchPrograms = async () => {
    setLoading(true);
    try {
      const filtros: Record<string, any> = {};
      if (searchProgram.trim()) filtros.nombre_programa = searchProgram.trim();
      if (searchUniversity.trim()) filtros.universidad = searchUniversity.trim();
      if (selectedCountries.length > 0) filtros.destinos = selectedCountries.map((c) => c.toLowerCase());
      if (selectedScholarshipType && selectedScholarshipType !== 'all') {
        filtros.tipo_beca = selectedScholarshipType;
      }
      if (selectedProgramTypes.length > 0) filtros.tipos_programa = selectedProgramTypes;
      if (scholarshipOnly) filtros.beca = true;
      if (priceRange && priceRange.length === 2) {
        filtros.min_cost = priceRange[0];
        filtros.max_cost = priceRange[1];
      }
      if (durationRange && durationRange.length === 2) {
      filtros.min_duracion = durationRange[0];
      filtros.max_duracion = durationRange[1];
    }
     
    const res = await fetch('https://futurappapi-staging.up.railway.app/filter_results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filtros),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
   
    const data = await res.json();

    let filteredData = data;
    if (studentBudget > 0) {
      filteredData = data.filter((program: Program) => {
        const bestCost = calculateBestProgramCost(program);
        return bestCost <= studentBudget;
      });
      console.log(`Budget filter applied: ${data.length} → ${filteredData.length} programs`);
    }

    setPrograms(filteredData);
    setVisibleCount(20);
    setResultCount(filteredData.length);

  } catch (err) {
    console.error('Error details:', err);
    setPrograms([]);
    setResultCount(0);
  } finally {
    setLoading(false);
  }
};

  const loadScholarships = async (program: Program): Promise<void> => {
    setScholarships([]);
    try {
      const params = new URLSearchParams({
        programa_texto: program.nombre_programa,
        universidad: program.universidad
      });
      const res = await fetch(`https://futurappapi-staging.up.railway.app/becas?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const becas: Scholarship[] = await res.json();
      setScholarships(becas || []);
      if (!becas.length) setSelectedScholarship(null);
    } catch (e) {
      console.error('Error loading scholarships:', e);
      setScholarships([]);
      setSelectedScholarship(null);
    }
  };

const calculateBestProgramCost = (program: Program): number => {
  const baseCost = parseFloat(String(program.precio_max_anual)) || 0;
  
  // Get scholarships for this program
  const programScholarships = scholarships.filter(s => 
    s.universidad?.toLowerCase() === program.universidad?.toLowerCase()
  );
  
  if (programScholarships.length === 0) return baseCost;
  
  // Find the best (lowest) cost with scholarships
  let bestCost = baseCost;
  programScholarships.forEach(scholarship => {
    const finalCost = calculateFinalCost(baseCost, scholarship);
    if (finalCost < bestCost) {
      bestCost = finalCost;
    }
  });
  
  return bestCost;
};

// Update the calculateFinalCost function to handle the scholarship interface (around line 216)
const calculateFinalCost = (baseCost: number, scholarship: Scholarship) => {
  let finalCost = parseFloat(String(baseCost)) || 0;
  const percentage = parseFloat(String(scholarship.porcentaje_beca_hasta)) || 
                     parseFloat(String(scholarship.porcentaje_beca_desde)) || 0;
  const amount = parseFloat(String(scholarship.monto_beca_hasta)) || 
                 parseFloat(String(scholarship.monto_beca_desde)) || 0;

  if (percentage && percentage > 0) {
    const rate = percentage > 1 ? percentage / 100 : percentage;
    finalCost = finalCost * (1 - rate);
  }
  if (amount && amount > 0) {
    finalCost = Math.max(0, finalCost - amount);
  }
  return Math.max(0, finalCost);
};


  const calculateInvestment = () => {
    if (!selectedProgram || !selectedScholarship) return null;

    const pMin = selectedProgram.precio_min_anual;
    const pMax = selectedProgram.precio_max_anual;
    const mMin = selectedScholarship.monto_beca_desde || 0;
    const mMax = selectedScholarship.monto_beca_hasta || 0;
    const pctMin = selectedScholarship.porcentaje_beca_desde || 0;
    const pctMax = selectedScholarship.porcentaje_beca_hasta || 0;

    const residualFixedMin = Math.max(0, pMin - mMax);
    const residualFixedMax = Math.max(0, pMax - mMin);

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
  const visiblePrograms = programs.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="p-2 bg-indigo-100 rounded-lg">
                <GraduationCap className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Buscador de Programas</h1>
                <p className="text-sm text-gray-600">Encuentra el programa universitario perfecto y calcula tu inversión</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Panel */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="h-5 w-5 text-indigo-600" />
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

                <Button 
                  onClick={searchPrograms} 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Buscando...' : 'Buscar'}
                </Button>
              </div>

              <Separator />

              {filtersLoading ? (
                <div className="py-8 flex flex-col items-center text-gray-400">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2"></div>
                  <span className="text-sm">Cargando filtros...</span>
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4 pr-4">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">País</Label>
                      <div className="space-y-2">
                        {countries.map(country => (
                          <div key={country} className="flex items-center space-x-2">
                            <Checkbox
                              id={`country-${country}`}
                              checked={selectedCountries.includes(country)}
                              onCheckedChange={checked => {
                                setSelectedCountries(checked
                                  ? [...selectedCountries, country]
                                  : selectedCountries.filter(c => c !== country)
                                );
                              }}
                            />
                            <Label 
                              htmlFor={`country-${country}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {country}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Tipo de programa</Label>
                      <div className="space-y-2">
                        {programTypes.map(type => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={`type-${type}`}
                              checked={selectedProgramTypes.includes(type)}
                              onCheckedChange={checked => {
                                setSelectedProgramTypes(checked
                                  ? [...selectedProgramTypes, type]
                                  : selectedProgramTypes.filter(t => t !== type)
                                );
                              }}
                            />
                            <Label 
                              htmlFor={`type-${type}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {type}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                  <Separator />

                  {/* Duration Slider - UPDATED */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Duración</Label>
                      <Badge variant="outline" className="text-xs">
                        {durationRange[0]} - {durationRange[1]} años
                      </Badge>
                    </div>
                    <Slider
                      value={durationRange}
                      onValueChange={setDurationRange}
                      max={maxDuration}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1 año</span>
                      <span>{maxDuration} años</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Price Range Slider - UPDATED */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Precio del programa</Label>
                      <Badge variant="outline" className="text-xs font-mono">
                        €{priceRange[0].toLocaleString()} - €{priceRange[1].toLocaleString()}
                      </Badge>
                    </div>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={maxPrice}
                      min={minPrice}
                      step={1000}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>€{minPrice.toLocaleString()}</span>
                      <span>€{maxPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <Separator />
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="scholarship-only"
                        checked={scholarshipOnly}
                        onCheckedChange={checked => setScholarshipOnly(checked === true)}
                      />
                      <Label htmlFor="scholarship-only" className="text-sm font-normal cursor-pointer">
                        Solo con beca
                      </Label>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Tipo de beca</Label>
                      <Select value={selectedScholarshipType} onValueChange={setSelectedScholarshipType}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona tipo de beca" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los tipos</SelectItem>
                          {scholarshipTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Results Panel */}

            <Card className="lg:col-span-2">
  {/* Budget Filter - NEW LOCATION */}
  <div className="p-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
    <Label className="text-sm font-medium mb-2 block text-gray-700">
      💰 Presupuesto Anual del Estudiante
    </Label>
    <div className="flex gap-2 items-center">
      <div className="relative flex-1">
        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          type="number"
          placeholder="Ingresa tu presupuesto anual (€)..."
          value={studentBudget || ''}
          onChange={(e) => {
            const value = parseFloat(e.target.value) || 0;
            setStudentBudget(value);
          }}
          className="pl-10"
          min="0"
          step="1000"
        />
      </div>
      {studentBudget > 0 && (
        <Badge variant="secondary" className="text-sm">
          €{studentBudget.toLocaleString()}/año
        </Badge>
      )}
    </div>
    {studentBudget > 0 && (
      <p className="text-xs text-gray-600 mt-2">
        ✓ Mostrando solo programas dentro de tu presupuesto (costo - mejor beca)
      </p>
    )}
  </div>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Programas Encontrados</CardTitle>
                  <CardDescription className="mt-1">
                    {resultCount > 0 ? `${resultCount} programa${resultCount !== 1 ? 's' : ''} disponible${resultCount !== 1 ? 's' : ''}` : 'Usa los filtros para buscar programas'}
                  </CardDescription>
                </div>
                {resultCount > 0 && (
                  <Badge variant="secondary">
                    {visibleCount} de {resultCount}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div ref={scrollAreaRef} className="h-[600px] overflow-y-auto">
                {programs.length === 0 && !loading ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Search className="h-12 w-12 mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No hay resultados</p>
                    <p className="text-sm">Prueba ajustando los filtros de búsqueda</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {visiblePrograms.map((program) => (
                      <div
                        key={program.id}
                        className={`p-6 cursor-pointer transition-all hover:bg-gray-50 ${
                          selectedProgram?.id === program.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
                        }`}
                        onClick={() => {
                          setSelectedProgram(program);
                          loadScholarships(program);
                          setSelectedScholarship(null);
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">
                              {program.nombre_programa}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                              <Building2 className="h-4 w-4" />
                              <span className="font-medium">{program.universidad}</span>
                            </div>
                          </div>
                          <Badge variant={selectedProgram?.id === program.id ? "default" : "secondary"}>
                            {program.tipo_programa}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{program.pais}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-green-700">
                              €{program.precio_min_anual.toLocaleString()} - €{program.precio_max_anual.toLocaleString()}/año
                            </span>
                          </div>
                        </div>

                        {program.enlace && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={program.enlace} target="_blank" rel="noopener noreferrer">
                              Ver programa →
                            </a>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Scholarships */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Becas Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[280px]">
                  {!selectedProgram ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <Award className="h-8 w-8 mb-2 text-gray-300" />
                      <p className="text-sm text-center">Selecciona un programa</p>
                    </div>
                  ) : scholarships.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <Clock className="h-8 w-8 mb-2 text-gray-300" />
                      <p className="text-sm text-center">No hay becas disponibles</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {scholarships.map(scholarship => (
                        <Card 
                          key={scholarship.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedScholarship?.id === scholarship.id ? 'ring-2 ring-yellow-400 bg-yellow-50' : ''
                          }`}
                          onClick={() => setSelectedScholarship(scholarship)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-sm flex-1">{scholarship.nombre_beca}</h4>
                              {selectedScholarship?.id === scholarship.id && (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs mb-2">{scholarship.tipo_beca}</Badge>
                            <div className="space-y-1 text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                <span>€{scholarship.monto_beca_desde?.toLocaleString()} - €{scholarship.monto_beca_hasta?.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Percent className="h-3 w-3" />
                                <span>{scholarship.porcentaje_beca_desde}% - {scholarship.porcentaje_beca_hasta}%</span>
                              </div>
                            </div>
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
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator className="h-5 w-5 text-green-600" />
                  Cálculo de Inversión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[280px]">
                  {!calculation ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <Calculator className="h-8 w-8 mb-2 text-gray-300" />
                      <p className="text-sm text-center">Selecciona programa y beca</p>
                    </div>
                  ) : (
                    <div className="space-y-4 text-sm">
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-3">
                          <h4 className="font-semibold text-blue-900 mb-1">Programa</h4>
                          <p className="text-xs text-blue-800 mb-2">{calculation.program.nombre_programa}</p>
                          <div className="flex items-center gap-1 text-xs">
                            <DollarSign className="h-3 w-3" />
                            <span>€{calculation.tuitionRange.min.toLocaleString()} - €{calculation.tuitionRange.max.toLocaleString()}/año</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-yellow-50 border-yellow-200">
                        <CardContent className="p-3">
                          <h4 className="font-semibold text-yellow-900 mb-1">Beca</h4>
                          <p className="text-xs text-yellow-800">{calculation.scholarship.nombre_beca}</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-3">
                          <h4 className="font-semibold text-green-900 mb-2 text-xs">Tu Inversión (Monto Fijo)</h4>
                          <p className="font-semibold text-green-700 text-sm">
                            €{calculation.residualFixed.min.toLocaleString()} - €{calculation.residualFixed.max.toLocaleString()}/año
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-purple-50 border-purple-200">
                        <CardContent className="p-3">
                          <h4 className="font-semibold text-purple-900 mb-2 text-xs">Tu Inversión (Porcentaje)</h4>
                          <p className="font-semibold text-purple-700 text-sm">
                            €{calculation.residualPercent.min.toLocaleString()} - €{calculation.residualPercent.max.toLocaleString()}/año
                          </p>
                        </CardContent>
                      </Card>
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