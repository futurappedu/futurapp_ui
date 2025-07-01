import { useState, useEffect, useRef } from 'react';
import { Search, Filter, Calculator, GraduationCap, DollarSign, MapPin, Building2, Award, Percent, Star, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Label } from "@/components/ui/label"
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';

export default function UniversityPlanner() {
  // State management
  const [searchProgram, setSearchProgram] = useState('');
  const [searchUniversity, setSearchUniversity] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedProgramTypes, setSelectedProgramTypes] = useState<string[]>([]);
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
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [countries, setCountries] = useState<string[]>([]);
  const [programTypes, setProgramTypes] = useState<string[]>([]);
  const [scholarshipTypes, setScholarshipTypes] = useState<string[]>([]);
  const [selectedScholarshipType, setSelectedScholarshipType] = useState('all');

  useEffect(() => {
    setVisibleCount(20);
  }, [programs]);

  useEffect(() => {
    const handleScroll = () => {
      const el = scrollAreaRef.current;
      if (!el) return;
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
  
  useEffect(() => {
    const fetchFilters = async () => {
      setFiltersLoading(true);
      try {
        const res = await fetch('http://127.0.0.1:8080/filter_options');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setCountries(data.paises || []);
        setProgramTypes(data.tipos || []);
        setScholarshipTypes(data.tipos_beca || []);
      } catch (err) {
        setCountries([]);
        setProgramTypes([]);
        setScholarshipTypes([]);
      } finally {
        setFiltersLoading(false);
      }
    };
    fetchFilters();
  }, []);
  const searchPrograms = async () => {
    setLoading(true);
    try {
      const filtros: Record<string, any> = {};

      if (searchProgram.trim()) filtros.nombre_programa = searchProgram.trim();
      if (searchUniversity.trim()) filtros.universidad = searchUniversity.trim();
      if (selectedCountries.length > 0) filtros.destino = selectedCountries;
      if (selectedScholarshipType && selectedScholarshipType !== 'all') {
  filtros.tipo_beca = selectedScholarshipType;
}
if (selectedProgramTypes.length > 0) filtros.tipo_programa = selectedProgramTypes;
      if (scholarshipOnly) filtros.beca = true;
      if (priceRange && priceRange.length === 2) {
        filtros.min_cost = priceRange[0];
        filtros.max_cost = priceRange[1];
      }
  
      const res = await fetch('http://127.0.0.1:8080/filter_results', {
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
    moneda_de_importe: string;
    enlace: string;
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
      setScholarships([]);
      setSelectedScholarship(null);
    }
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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">University Planner</h1>
              <p className="text-gray-600 mt-1">Encuentra el programa universitario perfecto y calcula tu inversión</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)]">
          {/* Filters Panel */}
          <Card className="lg:col-span-1 shadow-sm">
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
                    className="pl-10 border-gray-200 focus:border-indigo-300"
                  />
                </div>
                
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar universidad..."
                    value={searchUniversity}
                    onChange={(e) => setSearchUniversity(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-indigo-300"
                  />
                </div>

                <Button 
              onClick={searchPrograms} 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
              </div>

              <Separator />
              {filtersLoading ? (
    <div className="py-8 flex flex-col items-center text-gray-400">
      <svg className="animate-spin h-6 w-6 mb-2" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
      <span className="text-sm">Cargando filtros...</span>
    </div>
  ) : (
              <div className="space-y-4">
           

                <div className="space-y-3">
  <Label className="text-sm font-medium text-foreground">País</Label>
  <ScrollArea className="h-40 w-full rounded-md border p-4">
    <div className="space-y-3">
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
  </ScrollArea>
</div>
<div className="space-y-3">
  <Label className="text-sm font-medium text-foreground">Tipo de programa</Label>
  <ScrollArea className="h-40 w-full rounded-md border p-4">
    <div className="space-y-3">
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
  </ScrollArea>
</div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">
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
                  <label htmlFor="scholarship-only" className="text-sm font-medium text-gray-700">
                    Solo con beca
                  </label>
                </div>
              <div className="space-y-3">
  <Label className="text-sm font-medium text-foreground">Tipo de beca</Label>
  <Select
    value={selectedScholarshipType}
    onValueChange={setSelectedScholarshipType}
  >
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
  )}

            </CardContent>
          </Card>

          {/* Results Panel - Improved Layout */}
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Programas Encontrados</CardTitle>
                  <CardDescription className="mt-1">
                    {resultCount > 0 ? `${resultCount} programa${resultCount !== 1 ? 's' : ''} disponible${resultCount !== 1 ? 's' : ''}` : 'Usa los filtros para buscar programas'}
                  </CardDescription>
                </div>
                {resultCount > 0 && (
                  <Badge variant="secondary" className="text-sm">
                    {visibleCount} de {resultCount}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div
                ref={scrollAreaRef}
                className="h-[580px] overflow-y-auto"
              >
                {programs.length === 0 && !loading ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Search className="h-12 w-12 mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No hay resultados</p>
                    <p className="text-sm">Prueba ajustando los filtros de búsqueda</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {visiblePrograms.map((program) => (
                      <div
                        key={program.id}
                        className={`p-6 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                          selectedProgram?.id === program.id 
                            ? 'bg-indigo-50 border-l-4 border-indigo-500' 
                            : 'hover:border-l-4 hover:border-gray-200'
                        }`}
                        onClick={() => {
                          setSelectedProgram(program);
                          loadScholarships(program);
                          setSelectedScholarship(null);
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
                              {program.nombre_programa}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                              <Building2 className="h-4 w-4 flex-shrink-0" />
                              <span className="font-medium">{program.universidad}</span>
                            </div>
                          </div>
                          <Badge 
                            variant={selectedProgram?.id === program.id ? "default" : "secondary"}
                            className="ml-4 flex-shrink-0"
                          >
                            {program.tipo_programa}
                          </Badge>
                          <div className="mb-2">
                          <a
                            href={program.enlace}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 rounded bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition"
                          >
                            Ir al sitio del programa
                            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 7l-10 10M17 17V7H7" />
                            </svg>
                          </a>
                        </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{program.pais}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <GraduationCap className="h-4 w-4 text-gray-400" />
                            <span>{program.tipo_programa}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-green-700">
                              €{program.precio_min_anual.toLocaleString()} - €{program.precio_max_anual.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500">/ año</span>
                          </div>
                          
                          {selectedProgram?.id === program.id && (
                            <div className="flex items-center gap-1 text-indigo-600 text-sm font-medium">
                              <Star className="h-4 w-4 fill-current" />
                              Seleccionado
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {visibleCount < programs.length && (
                      <div className="p-4 text-center">
                        <p className="text-sm text-gray-500 mb-2">
                          Mostrando {visibleCount} de {programs.length} resultados
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${(visibleCount / programs.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {visibleCount >= programs.length && programs.length > 0 && (
                      <div className="p-4 text-center text-sm text-gray-500">
                        ✨ Todos los resultados han sido cargados
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Scholarships */}
            <Card className="shadow-sm">
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
                      <p className="text-sm text-center">Selecciona un programa para ver las becas disponibles</p>
                    </div>
                  ) : scholarships.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <Clock className="h-8 w-8 mb-2 text-gray-300" />
                      <p className="text-sm text-center">No hay becas disponibles para este programa</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {scholarships.map(scholarship => (
                        <Card 
                          key={scholarship.id}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            selectedScholarship?.id === scholarship.id 
                              ? 'ring-2 ring-yellow-400 bg-yellow-50' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedScholarship(scholarship)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-sm text-gray-900 line-clamp-2 flex-1">
                                {scholarship.nombre_beca}
                              </h4>
                              {selectedScholarship?.id === scholarship.id && (
                                <Star className="h-4 w-4 text-yellow-500 fill-current ml-2 flex-shrink-0" />
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <Badge variant="outline" className="text-xs">
                                {scholarship.tipo_beca}
                              </Badge>
                              
                              <div className="space-y-1 text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  <span>{scholarship.tipo_de_estudiante}</span>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  <span>
                                    €{scholarship.monto_beca_desde?.toLocaleString()} - €{scholarship.monto_beca_hasta?.toLocaleString()}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <Percent className="h-3 w-3" />
                                  <span>{scholarship.porcentaje_beca_desde}% - {scholarship.porcentaje_beca_hasta}%</span>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{scholarship.duracion_de_la_beca}</span>
                                </div>
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
            <Card className="shadow-sm">
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
                      <p className="text-sm text-center">Selecciona un programa y una beca para ver el cálculo de inversión</p>
                    </div>
                  ) : (
                    <div className="space-y-4 text-sm">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-1">Programa Seleccionado</h4>
                        <p className="font-medium text-blue-800 text-xs mb-1">{calculation.program.nombre_programa}</p>
                        <p className="text-blue-700 text-xs mb-2">{calculation.program.universidad}</p>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-blue-600" />
                          <span className="text-xs text-blue-800 font-medium">
                            Matrícula anual: €{calculation.tuitionRange.min.toLocaleString()} - €{calculation.tuitionRange.max.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <h4 className="font-semibold text-yellow-900 mb-1">Beca Seleccionada</h4>
                        <p className="font-medium text-yellow-800 text-xs mb-1">{calculation.scholarship.nombre_beca}</p>
                        <p className="text-yellow-700 text-xs">({calculation.scholarship.tipo_beca})</p>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <h4 className="font-semibold text-green-900 mb-2 text-xs">Cobertura por Monto Fijo</h4>
                          <p className="text-green-800 text-xs mb-1">
                            Financia: €{calculation.fixedAmount.min.toLocaleString()} - €{calculation.fixedAmount.max.toLocaleString()}
                          </p>
                          <p className="font-semibold text-green-700 text-xs">
                            💰 Tu inversión: €{calculation.residualFixed.min.toLocaleString()} - €{calculation.residualFixed.max.toLocaleString()} anuales
                          </p>
                        </div>

                        <div className="p-3 bg-purple-50 rounded-lg">
                          <h4 className="font-semibold text-purple-900 mb-2 text-xs">Cobertura por Porcentaje</h4>
                          <p className="text-purple-800 text-xs mb-1">
                            Cubre: {calculation.percentageRange.min}% - {calculation.percentageRange.max}% de la matrícula
                          </p>
                          <p className="text-purple-700 text-xs mb-1">
                            Valor: €{calculation.coverageAmount.min.toLocaleString()} - €{calculation.coverageAmount.max.toLocaleString()}
                          </p>
                          <p className="font-semibold text-purple-700 text-xs">
                            💰 Tu inversión: €{calculation.residualPercent.min.toLocaleString()} - €{calculation.residualPercent.max.toLocaleString()} anuales
                          </p>
                        </div>
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