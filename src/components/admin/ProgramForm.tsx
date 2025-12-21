import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { adminApi } from '@/services/adminApi';
import { useAuth0 } from '@auth0/auth0-react';
import { X } from 'lucide-react';

interface Program {
  id_programa: number;
  id_universidad: number;
  universidad: string | null;
  pais: string | null;
  id_tipo_programa: number;
  tipo_programa: string | null;
  convenio: string | null;
  estado: string | null;
  lugar: string | null;
  programa: string;
  nombre_programa: string | null;
  duracion_min_anos: number | null;
  duracion_max_anos: number | null;
  precio_min_anual: number | null;
  precio_max_anual: number | null;
  rango_precio: string | null;
  observacion_universidad: string | null;
  observacion_programa: string | null;
  enlace: string | null;
}

interface University {
  id_universidad: number;
  universidad: string;
  pais: string;
}

interface ProgramType {
  id_tipo_programa: number;
  descripcion: string;
}

interface ProgramFormProps {
  program?: Program | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProgramForm({ program, onSuccess, onCancel }: ProgramFormProps) {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [programTypes, setProgramTypes] = useState<ProgramType[]>([]);
  const [formData, setFormData] = useState({
    id_universidad: 0,
    id_tipo_programa: 0,
    programa: '',
    nombre_programa: '',
    convenio: '',
    estado: '',
    lugar: '',
    duracion_min_anos: '',
    duracion_max_anos: '',
    precio_min_anual: '',
    precio_max_anual: '',
    rango_precio: '',
    observacion_universidad: '',
    observacion_programa: '',
    enlace: '',
  });

  useEffect(() => {
    fetchUniversities();
    fetchProgramTypes();
  }, []);

  useEffect(() => {
    if (program) {
      setFormData({
        id_universidad: program.id_universidad,
        id_tipo_programa: program.id_tipo_programa,
        programa: program.programa || '',
        nombre_programa: program.nombre_programa || '',
        convenio: program.convenio || '',
        estado: program.estado || '',
        lugar: program.lugar || '',
        duracion_min_anos: program.duracion_min_anos?.toString() || '',
        duracion_max_anos: program.duracion_max_anos?.toString() || '',
        precio_min_anual: program.precio_min_anual?.toString() || '',
        precio_max_anual: program.precio_max_anual?.toString() || '',
        rango_precio: program.rango_precio || '',
        observacion_universidad: program.observacion_universidad || '',
        observacion_programa: program.observacion_programa || '',
        enlace: program.enlace || '',
      });
    }
  }, [program]);

  const fetchUniversities = async () => {
    try {
      const data = await adminApi.getAllUniversities(getAccessTokenSilently);
      setUniversities(data.items);
    } catch (err) {
      console.error('Failed to load universities', err);
    }
  };

  const fetchProgramTypes = async () => {
    try {
      const data = await adminApi.getProgramTypes(getAccessTokenSilently);
      setProgramTypes(data.items);
    } catch (err) {
      console.error('Failed to load program types', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = {
        id_universidad: formData.id_universidad,
        id_tipo_programa: formData.id_tipo_programa,
        programa: formData.programa,
        nombre_programa: formData.nombre_programa || null,
        convenio: formData.convenio || null,
        estado: formData.estado || null,
        lugar: formData.lugar || null,
        duracion_min_anos: formData.duracion_min_anos ? parseInt(formData.duracion_min_anos) : null,
        duracion_max_anos: formData.duracion_max_anos ? parseInt(formData.duracion_max_anos) : null,
        precio_min_anual: formData.precio_min_anual ? parseFloat(formData.precio_min_anual) : null,
        precio_max_anual: formData.precio_max_anual ? parseFloat(formData.precio_max_anual) : null,
        rango_precio: formData.rango_precio || null,
        observacion_universidad: formData.observacion_universidad || null,
        observacion_programa: formData.observacion_programa || null,
        enlace: formData.enlace || null,
      };

      if (program) {
        await adminApi.updateProgram(program.id_programa, data, getAccessTokenSilently);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to save program');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Edit Program</CardTitle>
              <CardDescription>Update program information</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="id_universidad">University *</Label>
                <Select
                  value={formData.id_universidad?.toString() || ''}
                  onValueChange={(value) => setFormData({ ...formData, id_universidad: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select university" />
                  </SelectTrigger>
                  <SelectContent>
                    {universities.map((uni) => (
                      <SelectItem key={uni.id_universidad} value={uni.id_universidad.toString()}>
                        {uni.universidad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="id_tipo_programa">Program Type *</Label>
                <Select
                  value={formData.id_tipo_programa?.toString() || ''}
                  onValueChange={(value) => setFormData({ ...formData, id_tipo_programa: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select program type" />
                  </SelectTrigger>
                  <SelectContent>
                    {programTypes.map((type) => (
                      <SelectItem key={type.id_tipo_programa} value={type.id_tipo_programa.toString()}>
                        {type.descripcion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="programa">Program (Internal Name) *</Label>
              <Input
                id="programa"
                value={formData.programa}
                onChange={(e) => setFormData({ ...formData, programa: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="nombre_programa">Program Name (Display)</Label>
              <Input
                id="nombre_programa"
                value={formData.nombre_programa}
                onChange={(e) => setFormData({ ...formData, nombre_programa: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="convenio">Agreement</Label>
                <Input
                  id="convenio"
                  value={formData.convenio}
                  onChange={(e) => setFormData({ ...formData, convenio: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="estado">State</Label>
                <Input
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="lugar">Location</Label>
                <Input
                  id="lugar"
                  value={formData.lugar}
                  onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duracion_min_anos">Min Duration (years)</Label>
                <Input
                  id="duracion_min_anos"
                  type="number"
                  min="0"
                  value={formData.duracion_min_anos}
                  onChange={(e) => setFormData({ ...formData, duracion_min_anos: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="duracion_max_anos">Max Duration (years)</Label>
                <Input
                  id="duracion_max_anos"
                  type="number"
                  min="0"
                  value={formData.duracion_max_anos}
                  onChange={(e) => setFormData({ ...formData, duracion_max_anos: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="precio_min_anual">Min Annual Price ($)</Label>
                <Input
                  id="precio_min_anual"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.precio_min_anual}
                  onChange={(e) => setFormData({ ...formData, precio_min_anual: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="precio_max_anual">Max Annual Price ($)</Label>
                <Input
                  id="precio_max_anual"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.precio_max_anual}
                  onChange={(e) => setFormData({ ...formData, precio_max_anual: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="rango_precio">Price Range (text)</Label>
                <Input
                  id="rango_precio"
                  value={formData.rango_precio}
                  onChange={(e) => setFormData({ ...formData, rango_precio: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="enlace">Link (URL)</Label>
              <Input
                id="enlace"
                type="url"
                value={formData.enlace}
                onChange={(e) => setFormData({ ...formData, enlace: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="observacion_universidad">University Notes</Label>
              <Textarea
                id="observacion_universidad"
                value={formData.observacion_universidad}
                onChange={(e) => setFormData({ ...formData, observacion_universidad: e.target.value })}
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="observacion_programa">Program Notes</Label>
              <Textarea
                id="observacion_programa"
                value={formData.observacion_programa}
                onChange={(e) => setFormData({ ...formData, observacion_programa: e.target.value })}
                rows={2}
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
                {loading ? 'Saving...' : 'Update'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

