import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { adminApi } from '@/services/adminApi';
import { useAuth0 } from '@auth0/auth0-react';
import { X } from 'lucide-react';

interface Scholarship {
  id_beca?: number;
  id_universidad: number;
  id_tipo_estudiante: number;
  nombre_beca: string;
  tipo_de_beca?: string | null;
  criterio_de_beca?: string | null;
  requisitos_beca?: string | null;
  elegibilidad?: string | null;
  fecha_limite_app?: string | null;
  cobertura_de_la_beca?: string | null;
  monto_beca_desde?: number | null;
  monto_beca_hasta?: number | null;
  porcentaje_beca_desde?: number | null;
  porcentaje_beca_hasta?: number | null;
  moneda_de_importe?: string | null;
  entrega_del_monto?: string | null;
  duracion_de_la_beca?: string | null;
  sujeta_a_renovacion?: boolean | null;
  carreras_o_programas_aplicables?: string | null;
  carreras_o_programas_inexiquibles?: string | null;
  mas_informacion?: string | null;
  enlace?: string | null;
}

interface ScholarshipFormProps {
  scholarship?: Scholarship | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ScholarshipForm({ scholarship, onSuccess, onCancel }: ScholarshipFormProps) {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [universities, setUniversities] = useState<any[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(true);
  const [formData, setFormData] = useState({
    id_universidad: '',
    id_tipo_estudiante: '',
    nombre_beca: '',
    tipo_de_beca: '',
    criterio_de_beca: '',
    requisitos_beca: '',
    elegibilidad: '',
    fecha_limite_app: '',
    cobertura_de_la_beca: '',
    monto_beca_desde: '',
    monto_beca_hasta: '',
    porcentaje_beca_desde: '',
    porcentaje_beca_hasta: '',
    moneda_de_importe: '',
    entrega_del_monto: '',
    duracion_de_la_beca: '',
    sujeta_a_renovacion: false,
    carreras_o_programas_aplicables: '',
    carreras_o_programas_inexiquibles: '',
    mas_informacion: '',
    enlace: '',
  });

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const data = await adminApi.getUniversities(1, 1000, '', getAccessTokenSilently);
        setUniversities(data.items);
      } catch (err) {
        console.error('Failed to load universities', err);
      } finally {
        setLoadingUniversities(false);
      }
    };
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (scholarship) {
      setFormData({
        id_universidad: scholarship.id_universidad.toString(),
        id_tipo_estudiante: scholarship.id_tipo_estudiante.toString(),
        nombre_beca: scholarship.nombre_beca || '',
        tipo_de_beca: scholarship.tipo_de_beca || '',
        criterio_de_beca: scholarship.criterio_de_beca || '',
        requisitos_beca: scholarship.requisitos_beca || '',
        elegibilidad: scholarship.elegibilidad || '',
        fecha_limite_app: scholarship.fecha_limite_app ? scholarship.fecha_limite_app.split('T')[0] : '',
        cobertura_de_la_beca: scholarship.cobertura_de_la_beca || '',
        monto_beca_desde: scholarship.monto_beca_desde?.toString() || '',
        monto_beca_hasta: scholarship.monto_beca_hasta?.toString() || '',
        porcentaje_beca_desde: scholarship.porcentaje_beca_desde?.toString() || '',
        porcentaje_beca_hasta: scholarship.porcentaje_beca_hasta?.toString() || '',
        moneda_de_importe: scholarship.moneda_de_importe || '',
        entrega_del_monto: scholarship.entrega_del_monto || '',
        duracion_de_la_beca: scholarship.duracion_de_la_beca || '',
        sujeta_a_renovacion: scholarship.sujeta_a_renovacion || false,
        carreras_o_programas_aplicables: scholarship.carreras_o_programas_aplicables || '',
        carreras_o_programas_inexiquibles: scholarship.carreras_o_programas_inexiquibles || '',
        mas_informacion: scholarship.mas_informacion || '',
        enlace: scholarship.enlace || '',
      });
    }
  }, [scholarship]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data: any = {
        id_universidad: parseInt(formData.id_universidad),
        id_tipo_estudiante: parseInt(formData.id_tipo_estudiante),
        nombre_beca: formData.nombre_beca,
        tipo_de_beca: formData.tipo_de_beca || null,
        criterio_de_beca: formData.criterio_de_beca || null,
        requisitos_beca: formData.requisitos_beca || null,
        elegibilidad: formData.elegibilidad || null,
        fecha_limite_app: formData.fecha_limite_app || null,
        cobertura_de_la_beca: formData.cobertura_de_la_beca || null,
        monto_beca_desde: formData.monto_beca_desde ? parseFloat(formData.monto_beca_desde) : null,
        monto_beca_hasta: formData.monto_beca_hasta ? parseFloat(formData.monto_beca_hasta) : null,
        porcentaje_beca_desde: formData.porcentaje_beca_desde ? parseFloat(formData.porcentaje_beca_desde) : null,
        porcentaje_beca_hasta: formData.porcentaje_beca_hasta ? parseFloat(formData.porcentaje_beca_hasta) : null,
        moneda_de_importe: formData.moneda_de_importe || null,
        entrega_del_monto: formData.entrega_del_monto || null,
        duracion_de_la_beca: formData.duracion_de_la_beca || null,
        sujeta_a_renovacion: formData.sujeta_a_renovacion,
        carreras_o_programas_aplicables: formData.carreras_o_programas_aplicables || null,
        carreras_o_programas_inexiquibles: formData.carreras_o_programas_inexiquibles || null,
        mas_informacion: formData.mas_informacion || null,
        enlace: formData.enlace || null,
      };

      if (scholarship && scholarship.id_beca) {
        await adminApi.updateScholarship(scholarship.id_beca, data, getAccessTokenSilently);
      } else {
        await adminApi.createScholarship(data, getAccessTokenSilently);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to save scholarship');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{scholarship ? 'Edit Scholarship' : 'Add Scholarship'}</CardTitle>
              <CardDescription>
                {scholarship ? 'Update scholarship information' : 'Create a new scholarship'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="id_universidad">University *</Label>
                <Select
                  value={formData.id_universidad}
                  onValueChange={(value) => setFormData({ ...formData, id_universidad: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select university" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingUniversities ? (
                      <SelectItem value="loading">Loading...</SelectItem>
                    ) : (
                      universities.map((uni) => (
                        <SelectItem key={uni.id_universidad} value={uni.id_universidad.toString()}>
                          {uni.universidad} - {uni.pais}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="id_tipo_estudiante">Student Type *</Label>
                <Select
                  value={formData.id_tipo_estudiante}
                  onValueChange={(value) => setFormData({ ...formData, id_tipo_estudiante: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select student type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Undergraduate</SelectItem>
                    <SelectItem value="2">Graduate</SelectItem>
                    <SelectItem value="3">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="nombre_beca">Scholarship Name *</Label>
              <Input
                id="nombre_beca"
                value={formData.nombre_beca}
                onChange={(e) => setFormData({ ...formData, nombre_beca: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="tipo_de_beca">Scholarship Type</Label>
              <Input
                id="tipo_de_beca"
                value={formData.tipo_de_beca}
                onChange={(e) => setFormData({ ...formData, tipo_de_beca: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monto_beca_desde">Amount From</Label>
                <Input
                  id="monto_beca_desde"
                  type="number"
                  step="0.01"
                  value={formData.monto_beca_desde}
                  onChange={(e) => setFormData({ ...formData, monto_beca_desde: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="monto_beca_hasta">Amount To</Label>
                <Input
                  id="monto_beca_hasta"
                  type="number"
                  step="0.01"
                  value={formData.monto_beca_hasta}
                  onChange={(e) => setFormData({ ...formData, monto_beca_hasta: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="porcentaje_beca_desde">Percentage From</Label>
                <Input
                  id="porcentaje_beca_desde"
                  type="number"
                  step="0.01"
                  value={formData.porcentaje_beca_desde}
                  onChange={(e) => setFormData({ ...formData, porcentaje_beca_desde: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="porcentaje_beca_hasta">Percentage To</Label>
                <Input
                  id="porcentaje_beca_hasta"
                  type="number"
                  step="0.01"
                  value={formData.porcentaje_beca_hasta}
                  onChange={(e) => setFormData({ ...formData, porcentaje_beca_hasta: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="fecha_limite_app">Application Deadline</Label>
              <Input
                id="fecha_limite_app"
                type="date"
                value={formData.fecha_limite_app}
                onChange={(e) => setFormData({ ...formData, fecha_limite_app: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="requisitos_beca">Requirements</Label>
              <Textarea
                id="requisitos_beca"
                value={formData.requisitos_beca}
                onChange={(e) => setFormData({ ...formData, requisitos_beca: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="elegibilidad">Eligibility</Label>
              <Textarea
                id="elegibilidad"
                value={formData.elegibilidad}
                onChange={(e) => setFormData({ ...formData, elegibilidad: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="enlace">Link</Label>
              <Input
                id="enlace"
                type="url"
                value={formData.enlace}
                onChange={(e) => setFormData({ ...formData, enlace: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="sujeta_a_renovacion"
                checked={formData.sujeta_a_renovacion}
                onCheckedChange={(checked) => setFormData({ ...formData, sujeta_a_renovacion: checked as boolean })}
              />
              <Label htmlFor="sujeta_a_renovacion">Subject to renewal</Label>
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : scholarship ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

