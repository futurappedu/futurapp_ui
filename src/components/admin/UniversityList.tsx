import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/services/adminApi';
import { useAuth0 } from '@auth0/auth0-react';
import { Search, GraduationCap, MapPin, Mail, Plus, Edit, Trash2 } from 'lucide-react';
import UniversityForm from './UniversityForm';

interface University {
  id_universidad: number;
  universidad: string;
  pais: string;
  contact_email: string | null;
}

export default function UniversityList() {
  const { getAccessTokenSilently } = useAuth0();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const [showForm, setShowForm] = useState(false);
  const pageSize = 20;

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getUniversities(page, pageSize, search, getAccessTokenSilently);
      setUniversities(data.items);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load universities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, [page, search]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleEdit = (university: University) => {
    setEditingUniversity(university);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this university?')) return;
    try {
      await adminApi.deleteUniversity(id, getAccessTokenSilently);
      fetchUniversities();
    } catch (err: any) {
      alert(err.message || 'Failed to delete university');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingUniversity(null);
    fetchUniversities();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingUniversity(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Universities</CardTitle>
              <CardDescription>Manage universities</CardDescription>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add University
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search universities..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            {loading ? (
              <div className="text-center py-8">Loading universities...</div>
            ) : universities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No universities found</div>
            ) : (
              <>
                <div className="space-y-2">
                  {universities.map((university) => (
                    <div
                      key={university.id_universidad}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">
                            <span className="text-muted-foreground text-sm mr-2">#{university.id_universidad}</span>
                            {university.universidad}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {university.pais}
                            </span>
                            {university.contact_email && (
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {university.contact_email}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(university)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(university.id_universidad)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} universities
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
        <UniversityForm
          university={editingUniversity}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
    </>
  );
}

