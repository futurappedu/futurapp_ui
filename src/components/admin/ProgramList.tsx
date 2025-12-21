import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { adminApi } from '@/services/adminApi';
import { useAuth0 } from '@auth0/auth0-react';
import { Search, BookOpen, GraduationCap, MapPin, Edit, Trash2, X } from 'lucide-react';
import ProgramForm from './ProgramForm';

interface Program {
  id_programa: number;
  id_universidad: number;
  universidad: string | null;
  pais: string | null;
  id_tipo_programa: number;
  tipo_programa: string | null;
  programa: string;
  nombre_programa: string | null;
  lugar: string | null;
  duracion_min_anos: number | null;
  duracion_max_anos: number | null;
  precio_min_anual: number | null;
  precio_max_anual: number | null;
}

interface University {
  id_universidad: number;
  universidad: string;
  pais: string;
}

export default function ProgramList() {
  const { getAccessTokenSilently } = useAuth0();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedUniversityId, setSelectedUniversityId] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingProgram, setEditingProgram] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const pageSize = 20;

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getPrograms(page, pageSize, search, selectedUniversityId, getAccessTokenSilently);
      setPrograms(data.items);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  const fetchUniversities = async () => {
    try {
      // Fetch all universities for the filter dropdown
      const data = await adminApi.getAllUniversities(getAccessTokenSilently);
      setUniversities(data.items);
    } catch (err: any) {
      console.error('Failed to load universities for filter', err);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [page, search, selectedUniversityId]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleUniversityFilter = (value: string) => {
    setSelectedUniversityId(value === 'all' ? undefined : parseInt(value));
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedUniversityId(undefined);
    setPage(1);
  };

  const handleEdit = async (program: Program) => {
    try {
      const fullProgram = await adminApi.getProgram(program.id_programa, getAccessTokenSilently);
      setEditingProgram(fullProgram);
      setShowForm(true);
    } catch (err: any) {
      alert(err.message || 'Failed to load program details');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this program?')) return;
    try {
      await adminApi.deleteProgram(id, getAccessTokenSilently);
      fetchPrograms();
    } catch (err: any) {
      alert(err.message || 'Failed to delete program');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProgram(null);
    fetchPrograms();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProgram(null);
  };

  const formatPrice = (min: number | null, max: number | null) => {
    if (min === null && max === null) return null;
    if (min === max || max === null) return `$${min?.toLocaleString()}`;
    if (min === null) return `Up to $${max?.toLocaleString()}`;
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const formatDuration = (min: number | null, max: number | null) => {
    if (min === null && max === null) return null;
    if (min === max || max === null) return `${min} year${min !== 1 ? 's' : ''}`;
    if (min === null) return `Up to ${max} years`;
    return `${min}-${max} years`;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Programs</CardTitle>
              <CardDescription>Manage university programs</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search programs by name..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="w-full sm:w-72">
                <Select
                  value={selectedUniversityId?.toString() || 'all'}
                  onValueChange={handleUniversityFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by university" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Universities</SelectItem>
                    {universities.map((uni) => (
                      <SelectItem key={uni.id_universidad} value={uni.id_universidad.toString()}>
                        {uni.universidad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {(search || selectedUniversityId) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            {loading ? (
              <div className="text-center py-8">Loading programs...</div>
            ) : programs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No programs found</div>
            ) : (
              <>
                <div className="space-y-2">
                  {programs.map((program) => (
                    <div
                      key={program.id_programa}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {program.nombre_programa || program.programa}
                          </div>
                          <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                            {program.universidad && (
                              <span className="flex items-center gap-1">
                                <GraduationCap className="h-3 w-3" />
                                {program.universidad}
                              </span>
                            )}
                            {program.pais && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {program.pais}
                              </span>
                            )}
                            {program.tipo_programa && (
                              <span className="bg-secondary px-2 py-0.5 rounded text-xs">
                                {program.tipo_programa}
                              </span>
                            )}
                            {formatDuration(program.duracion_min_anos, program.duracion_max_anos) && (
                              <span>{formatDuration(program.duracion_min_anos, program.duracion_max_anos)}</span>
                            )}
                            {formatPrice(program.precio_min_anual, program.precio_max_anual) && (
                              <span>{formatPrice(program.precio_min_anual, program.precio_max_anual)}/year</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(program)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(program.id_programa)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} programs
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p + 1)}
                      disabled={page * pageSize >= total}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <ProgramForm
          program={editingProgram}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
    </>
  );
}

