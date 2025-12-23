import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { adminApi } from '@/services/adminApi';
import { useAuth0 } from '@auth0/auth0-react';
import { X } from 'lucide-react';

interface University {
  id_universidad: number;
  universidad: string;
  pais: string;
  contact_email: string | null;
}

interface UniversityFormProps {
  university?: University | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UniversityForm({ university, onSuccess, onCancel }: UniversityFormProps) {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [formData, setFormData] = useState({
    universidad: '',
    pais: '',
    contact_email: '',
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await adminApi.getCountries(getAccessTokenSilently);
        setCountries(data.items);
      } catch (err) {
        console.error('Failed to load countries', err);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, [getAccessTokenSilently]);

  useEffect(() => {
    if (university) {
      setFormData({
        universidad: university.universidad,
        pais: university.pais,
        contact_email: university.contact_email || '',
      });
    }
  }, [university]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = {
        universidad: formData.universidad,
        pais: formData.pais,
        contact_email: formData.contact_email || null,
      };

      if (university) {
        await adminApi.updateUniversity(university.id_universidad, data, getAccessTokenSilently);
      } else {
        await adminApi.createUniversity(data, getAccessTokenSilently);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to save university');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{university ? 'Edit University' : 'Add University'}</CardTitle>
              <CardDescription>
                {university ? 'Update university information' : 'Create a new university'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="universidad">University Name *</Label>
              <Input
                id="universidad"
                value={formData.universidad}
                onChange={(e) => setFormData({ ...formData, universidad: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="pais">Country *</Label>
              <Select
                value={formData.pais}
                onValueChange={(value) => setFormData({ ...formData, pais: value })}
                required
              >
                <SelectTrigger id="pais">
                  <SelectValue placeholder={loadingCountries ? "Loading..." : "Select country"} />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : university ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

