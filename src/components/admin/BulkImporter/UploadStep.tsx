/**
 * Upload Step Component
 * 
 * Handles CSV file upload and parsing using papaparse.
 * Parses CSV in the browser to extract headers and preview data.
 */

import { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import Papa from 'papaparse';
import { availableSchemas, TableSchema } from './schemaConfig';

interface UploadStepProps {
  onFileLoaded: (
    file: File,
    headers: string[],
    previewData: Record<string, string>[],
    totalRows: number,
    targetTable: 'scholarships' | 'programs'
  ) => void;
}

export default function UploadStep({ onFileLoaded }: UploadStepProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseResult, setParseResult] = useState<{
    headers: string[];
    previewRows: Record<string, string>[];
    totalRows: number;
  } | null>(null);
  const [selectedSchema, setSelectedSchema] = useState<TableSchema | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const parseCSV = useCallback((file: File) => {
    setIsProcessing(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      preview: 100, // Parse first 100 rows for preview
      complete: (results) => {
        if (results.errors.length > 0) {
          setError(`CSV parsing error: ${results.errors[0].message}`);
          setIsProcessing(false);
          return;
        }

        if (!results.meta.fields || results.meta.fields.length === 0) {
          setError('No columns found in CSV file');
          setIsProcessing(false);
          return;
        }

        const headers = results.meta.fields;
        const previewRows = (results.data as Record<string, string>[]).slice(0, 10);

        // Get total row count by parsing again without preview limit
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (fullResults) => {
            const totalRows = (fullResults.data as Record<string, string>[]).length;
            setParseResult({
              headers,
              previewRows,
              totalRows
            });
            setIsProcessing(false);
          },
          error: () => {
            // If full parse fails, use preview count as estimate
            setParseResult({
              headers,
              previewRows,
              totalRows: previewRows.length
            });
            setIsProcessing(false);
          }
        });
      },
      error: (err) => {
        setError(`Failed to parse CSV: ${err.message}`);
        setIsProcessing(false);
      }
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv' || file?.name.endsWith('.csv')) {
      setSelectedFile(file);
      parseCSV(file);
    } else {
      setError('Please upload a CSV file');
    }
  }, [parseCSV]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      parseCSV(file);
    }
  }, [parseCSV]);

  const handleContinue = () => {
    if (selectedFile && parseResult && selectedSchema) {
      onFileLoaded(
        selectedFile,
        parseResult.headers,
        parseResult.previewRows,
        parseResult.totalRows,
        selectedSchema.targetTable
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Target Table Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Import Target</CardTitle>
          <CardDescription>
            Choose which database table you want to import data into
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="target-table">Target Table</Label>
            <Select
              value={selectedSchema?.targetTable || ''}
              onValueChange={(value) => {
                const schema = availableSchemas.find(s => s.targetTable === value);
                setSelectedSchema(schema || null);
              }}
            >
              <SelectTrigger id="target-table">
                <SelectValue placeholder="Select a table..." />
              </SelectTrigger>
              <SelectContent>
                {availableSchemas.map((schema) => (
                  <SelectItem key={schema.targetTable} value={schema.targetTable}>
                    {schema.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedSchema && (
              <p className="text-sm text-muted-foreground mt-2">
                Required fields: {selectedSchema.fields.filter(f => f.required).map(f => f.label).join(', ')}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
          <CardDescription>
            Drag and drop your CSV file or click to browse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`
              border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
              transition-colors duration-200
              ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
              ${selectedFile ? 'bg-muted/30' : ''}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileSelect}
            />
            
            {isProcessing ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-lg font-medium">Processing CSV...</p>
              </div>
            ) : selectedFile ? (
              <div className="flex flex-col items-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                <p className="text-lg font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Drop your CSV file here</p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse
                </p>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Parse Results */}
      {parseResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              File Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Total Rows</p>
                <p className="text-2xl font-bold">{parseResult.totalRows.toLocaleString()}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Columns</p>
                <p className="text-2xl font-bold">{parseResult.headers.length}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Detected Columns:</p>
              <div className="flex flex-wrap gap-2">
                {parseResult.headers.map((header) => (
                  <span 
                    key={header} 
                    className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                  >
                    {header}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={!selectedFile || !parseResult || !selectedSchema}
        >
          Continue to Column Mapping
        </Button>
      </div>
    </div>
  );
}


