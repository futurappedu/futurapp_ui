/**
 * Schema Configuration for Bulk CSV Import
 * 
 * Defines the target database fields for each importable table.
 * Used by the Column Mapper to match CSV headers to database columns.
 */

export interface FieldDefinition {
  name: string;           // Database column name
  label: string;          // Human-readable label
  required: boolean;      // Whether this field is required
  description?: string;   // Help text for the field
  type: 'text' | 'number' | 'boolean' | 'date' | 'fk';  // Data type for validation hints
}

export interface TableSchema {
  name: string;                     // Display name
  targetTable: 'scholarships' | 'programs';  // Backend table identifier
  fields: FieldDefinition[];
}

/**
 * Programs (programas_universitarios) schema
 */
export const programsSchema: TableSchema = {
  name: 'University Programs',
  targetTable: 'programs',
  fields: [
    { 
      name: 'id_programa', 
      label: 'Program ID', 
      required: false, 
      type: 'number',
      description: 'Leave empty for new records. Include for updates.'
    },
    { 
      name: 'id_universidad', 
      label: 'University ID', 
      required: true, 
      type: 'fk',
      description: 'Foreign key to universidad table'
    },
    { 
      name: 'id_tipo_programa', 
      label: 'Program Type ID', 
      required: true, 
      type: 'fk',
      description: 'Foreign key to tipo_programas table'
    },
    { name: 'programa', label: 'Program Name', required: true, type: 'text' },
    { name: 'nombre_programa', label: 'Program Display Name', required: false, type: 'text' },
    { name: 'convenio', label: 'Agreement', required: false, type: 'text' },
    { name: 'estado', label: 'State/Status', required: false, type: 'text' },
    { name: 'lugar', label: 'Location', required: false, type: 'text' },
    { name: 'duracion_min_anos', label: 'Min Duration (years)', required: false, type: 'number' },
    { name: 'duracion_max_anos', label: 'Max Duration (years)', required: false, type: 'number' },
    { name: 'precio_min_anual', label: 'Min Annual Price', required: false, type: 'number' },
    { name: 'precio_max_anual', label: 'Max Annual Price', required: false, type: 'number' },
    { name: 'rango_precio', label: 'Price Range Text', required: false, type: 'text' },
    { name: 'observacion_universidad', label: 'University Notes', required: false, type: 'text' },
    { name: 'observacion_programa', label: 'Program Notes', required: false, type: 'text' },
    { name: 'enlace', label: 'URL Link', required: false, type: 'text' },
  ]
};

/**
 * Scholarships (becas_universitarias) schema
 */
export const scholarshipsSchema: TableSchema = {
  name: 'Scholarships',
  targetTable: 'scholarships',
  fields: [
    { 
      name: 'id_beca', 
      label: 'Scholarship ID', 
      required: false, 
      type: 'number',
      description: 'Leave empty for new records. Include for updates.'
    },
    { 
      name: 'id_universidad', 
      label: 'University ID', 
      required: true, 
      type: 'fk',
      description: 'Foreign key to universidad table'
    },
    { 
      name: 'id_tipo_estudiante', 
      label: 'Student Type ID', 
      required: true, 
      type: 'fk',
      description: 'Foreign key to tipo_estudiante table'
    },
    { name: 'nombre_beca', label: 'Scholarship Name', required: true, type: 'text' },
    { name: 'tipo_de_beca', label: 'Scholarship Type', required: false, type: 'text' },
    { name: 'criterio_de_beca', label: 'Scholarship Criteria', required: false, type: 'text' },
    { name: 'requisitos_beca', label: 'Requirements', required: false, type: 'text' },
    { name: 'elegibilidad', label: 'Eligibility', required: false, type: 'text' },
    { name: 'fecha_limite_app', label: 'Application Deadline', required: false, type: 'date' },
    { name: 'cobertura_de_la_beca', label: 'Coverage', required: false, type: 'text' },
    { name: 'monto_beca_desde', label: 'Min Amount', required: false, type: 'number' },
    { name: 'monto_beca_hasta', label: 'Max Amount', required: false, type: 'number' },
    { name: 'porcentaje_beca_desde', label: 'Min Percentage', required: false, type: 'number' },
    { name: 'porcentaje_beca_hasta', label: 'Max Percentage', required: false, type: 'number' },
    { name: 'moneda_de_importe', label: 'Currency', required: false, type: 'text' },
    { name: 'entrega_del_monto', label: 'Payment Method', required: false, type: 'text' },
    { name: 'duracion_de_la_beca', label: 'Duration', required: false, type: 'text' },
    { name: 'sujeta_a_renovacion', label: 'Renewable', required: false, type: 'boolean' },
    { name: 'carreras_o_programas_aplicables', label: 'Applicable Programs', required: false, type: 'text' },
    { name: 'carreras_o_programas_inexiquibles', label: 'Excluded Programs', required: false, type: 'text' },
    { name: 'mas_informacion', label: 'More Information', required: false, type: 'text' },
    { name: 'enlace', label: 'URL Link', required: false, type: 'text' },
  ]
};

/**
 * Get schema by target table name
 */
export function getSchema(targetTable: 'scholarships' | 'programs'): TableSchema {
  if (targetTable === 'programs') return programsSchema;
  if (targetTable === 'scholarships') return scholarshipsSchema;
  throw new Error(`Unknown target table: ${targetTable}`);
}

/**
 * Get all available schemas
 */
export const availableSchemas: TableSchema[] = [programsSchema, scholarshipsSchema];


