import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/services/adminApi';
import { useAuth0 } from '@auth0/auth0-react';
import { Search, Award, GraduationCap, Plus, Edit, Trash2 } from 'lucide-react';
import ScholarshipForm from './ScholarshipForm';

interface Scholarship {
  id_beca: number;
  id_universidad: number;
  universidad: string | null;
  nombre_beca: string;
  tipo_de_beca: string | null;
  criterio_de_beca: string | null;
  monto_beca_desde: number | null;
  monto_beca_hasta: number | null;
  porcentaje_beca_desde: number | null;
  porcentaje_beca_hasta: number | null;
}

export default function ScholarshipList() {
  const { getAccessTokenSilently } = useAuth0();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [showForm, setShowForm] = useState(false);
  const pageSize = 20;

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getScholarships(page, pageSize, search, undefined, getAccessTokenSilently);
      setScholarships(data.items);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load scholarships');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, [page, search]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleEdit = async (scholarship: Scholarship) => {
    try {
      const fullScholarship = await adminApi.getScholarship(scholarship.id_beca, getAccessTokenSilently);
      setEditingScholarship(fullScholarship);
      setShowForm(true);
    } catch (err: any) {
      alert(err.message || 'Failed to load scholarship details');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this scholarship?')) return;
    try {
      await adminApi.deleteScholarship(id, getAccessTokenSilently);
      fetchScholarships();
    } catch (err: any) {
      alert(err.message || 'Failed to delete scholarship');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingScholarship(null);
    fetchScholarships();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingScholarship(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Scholarships</CardTitle>
              <CardDescription>Manage scholarships</CardDescription>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Scholarship
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search scholarships..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            {loading ? (
              <div className="text-center py-8">Loading scholarships...</div>
            ) : scholarships.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No scholarships found</div>
            ) : (
              <>
                <div className="space-y-2">
                  {scholarships.map((scholarship) => (
                    <div
                      key={scholarship.id_beca}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Award className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{scholarship.nombre_beca}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                            {scholarship.universidad && (
                              <span className="flex items-center gap-1">
                                <GraduationCap className="h-3 w-3" />
                                {scholarship.universidad}
                              </span>
                            )}
                            {scholarship.tipo_de_beca && (
                              <span>{scholarship.tipo_de_beca}</span>
                            )}
                            {(scholarship.monto_beca_desde || scholarship.porcentaje_beca_desde) && (
                              <span>
                                {scholarship.monto_beca_desde
                                  ? `$${scholarship.monto_beca_desde}${scholarship.monto_beca_hasta ? ` - $${scholarship.monto_beca_hasta}` : ''}`
                                  : scholarship.porcentaje_beca_desde
                                  ? `${scholarship.porcentaje_beca_desde}%${scholarship.porcentaje_beca_hasta ? ` - ${scholarship.porcentaje_beca_hasta}%` : ''}`
                                  : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(scholarship)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(scholarship.id_beca)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} scholarships
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
        <ScholarshipForm
          scholarship={editingScholarship}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
    </>
  );
}

