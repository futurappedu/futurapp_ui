/**
 * Column Mapper Step Component
 * 
 * Allows users to map CSV columns to database fields.
 * Shows required fields and provides auto-matching for common names.
 */

import { useState, useEffect } from 'react';
import { ArrowRight, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getSchema, FieldDefinition } from './schemaConfig';

interface ColumnMapperStepProps {
  csvHeaders: string[];
  targetTable: 'scholarships' | 'programs';
  onMappingComplete: (mapping: Record<string, string>) => void;
  onBack: () => void;
}

export default function ColumnMapperStep({
  csvHeaders,
  targetTable,
  onMappingComplete,
  onBack
}: ColumnMapperStepProps) {
  const schema = getSchema(targetTable);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<string[]>([]);

  // Auto-match columns on mount
  useEffect(() => {
    const autoMapping: Record<string, string> = {};
    
    for (const csvHeader of csvHeaders) {
      const normalizedCsv = csvHeader.toLowerCase().replace(/[_\s-]/g, '');
      
      for (const field of schema.fields) {
        const normalizedField = field.name.toLowerCase().replace(/[_\s-]/g, '');
        const normalizedLabel = field.label.toLowerCase().replace(/[_\s-]/g, '');
        
        if (normalizedCsv === normalizedField || normalizedCsv === normalizedLabel) {
          autoMapping[csvHeader] = field.name;
          break;
        }
      }
    }
    
    setMapping(autoMapping);
  }, [csvHeaders, schema.fields]);

  const handleMappingChange = (csvHeader: string, dbField: string) => {
    setMapping(prev => {
      const newMapping = { ...prev };
      if (dbField === '__none__') {
        delete newMapping[csvHeader];
      } else {
        // Remove any existing mapping to this db field
        for (const key of Object.keys(newMapping)) {
          if (newMapping[key] === dbField) {
            delete newMapping[key];
          }
        }
        newMapping[csvHeader] = dbField;
      }
      return newMapping;
    });
    setErrors([]);
  };

  const validateMapping = (): boolean => {
    const newErrors: string[] = [];
    const mappedDbFields = new Set(Object.values(mapping));
    
    // Check required fields
    for (const field of schema.fields) {
      if (field.required && !mappedDbFields.has(field.name)) {
        newErrors.push(`Required field "${field.label}" is not mapped`);
      }
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleContinue = () => {
    if (validateMapping()) {
      onMappingComplete(mapping);
    }
  };

  const getMappedField = (csvHeader: string): FieldDefinition | undefined => {
    const dbFieldName = mapping[csvHeader];
    return schema.fields.find(f => f.name === dbFieldName);
  };

  const getAvailableFields = (currentCsvHeader: string): FieldDefinition[] => {
    const currentMapping = mapping[currentCsvHeader];
    const usedFields = new Set(
      Object.entries(mapping)
        .filter(([csv]) => csv !== currentCsvHeader)
        .map(([, db]) => db)
    );
    
    return schema.fields.filter(f => 
      !usedFields.has(f.name) || f.name === currentMapping
    );
  };

  const mappedCount = Object.keys(mapping).length;
  const requiredFields = schema.fields.filter(f => f.required);
  const mappedRequiredCount = requiredFields.filter(f => 
    Object.values(mapping).includes(f.name)
  ).length;

  return (
    <div className="space-y-6">
      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{mappedCount}</p>
              <p className="text-sm text-muted-foreground">Columns Mapped</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{csvHeaders.length - mappedCount}</p>
              <p className="text-sm text-muted-foreground">Unmapped</p>
            </div>
          </CardContent>
        </Card>
        <Card className={mappedRequiredCount === requiredFields.length ? 'border-green-500' : 'border-yellow-500'}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">
                {mappedRequiredCount}/{requiredFields.length}
              </p>
              <p className="text-sm text-muted-foreground">Required Fields</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {errors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Mapping Table */}
      <Card>
        <CardHeader>
          <CardTitle>Column Mapping</CardTitle>
          <CardDescription>
            Match each CSV column to a database field. Required fields are marked with a star.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {csvHeaders.map((csvHeader) => {
              const mappedField = getMappedField(csvHeader);
              const availableFields = getAvailableFields(csvHeader);
              
              return (
                <div 
                  key={csvHeader}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  {/* CSV Column */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{csvHeader}</p>
                  </div>
                  
                  {/* Arrow */}
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  
                  {/* DB Field Selector */}
                  <div className="flex-1 min-w-0">
                    <Select
                      value={mapping[csvHeader] || '__none__'}
                      onValueChange={(value) => handleMappingChange(csvHeader, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select field..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">
                          <span className="text-muted-foreground">-- Skip this column --</span>
                        </SelectItem>
                        {availableFields.map((field) => (
                          <SelectItem key={field.name} value={field.name}>
                            <span className="flex items-center gap-2">
                              {field.label}
                              {field.required && (
                                <span className="text-red-500">*</span>
                              )}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Status/Info */}
                  <div className="w-24 flex items-center gap-2 flex-shrink-0">
                    {mappedField ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        {mappedField.required && (
                          <Badge variant="secondary" className="text-xs">Required</Badge>
                        )}
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">Skipped</span>
                    )}
                    {mappedField?.description && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{mappedField.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Required Fields Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Required Fields Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {requiredFields.map((field) => {
              const isMapped = Object.values(mapping).includes(field.name);
              return (
                <Badge 
                  key={field.name}
                  variant={isMapped ? "default" : "outline"}
                  className={isMapped ? "bg-green-500" : "border-red-300 text-red-600"}
                >
                  {isMapped && <CheckCircle2 className="h-3 w-3 mr-1" />}
                  {field.label}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          size="lg" 
          onClick={handleContinue}
          disabled={mappedRequiredCount !== requiredFields.length}
        >
          Continue to Preview
        </Button>
      </div>
    </div>
  );
}


