/**
 * Preview Step Component
 * 
 * Shows a preview of the data that will be imported.
 * Displays the first 10 rows with the mapped columns.
 */

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { AlertCircle, CheckCircle2, Eye } from 'lucide-react';
import { getSchema } from './schemaConfig';

interface PreviewStepProps {
  previewData: Record<string, string>[];
  columnMapping: Record<string, string>;
  targetTable: 'scholarships' | 'programs';
  totalRows: number;
  onConfirm: () => void;
  onBack: () => void;
}

export default function PreviewStep({
  previewData,
  columnMapping,
  targetTable,
  totalRows,
  onConfirm,
  onBack
}: PreviewStepProps) {
  const schema = getSchema(targetTable);
  
  // Get the mapped CSV columns and their corresponding DB field info
  const mappedColumns = Object.entries(columnMapping).map(([csvCol, dbField]) => ({
    csvColumn: csvCol,
    dbField: dbField,
    fieldInfo: schema.fields.find(f => f.name === dbField)
  }));

  const requiredFields = schema.fields.filter(f => f.required);
  const mappedRequiredFields = requiredFields.filter(f => 
    Object.values(columnMapping).includes(f.name)
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{totalRows.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Rows</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{mappedColumns.length}</p>
              <p className="text-sm text-muted-foreground">Mapped Columns</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-500">
                {mappedRequiredFields.length}/{requiredFields.length}
              </p>
              <p className="text-sm text-muted-foreground">Required Fields</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{schema.name}</p>
              <p className="text-sm text-muted-foreground">Target Table</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Column Mapping Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Column Mapping Summary
          </CardTitle>
          <CardDescription>
            The following columns will be imported
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {mappedColumns.map(({ csvColumn, dbField, fieldInfo }) => (
              <Badge 
                key={csvColumn} 
                variant="secondary"
                className="text-sm py-1"
              >
                <span className="text-muted-foreground">{csvColumn}</span>
                <span className="mx-1">→</span>
                <span className="font-medium">{fieldInfo?.label || dbField}</span>
                {fieldInfo?.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Data Preview
          </CardTitle>
          <CardDescription>
            Showing first {Math.min(10, previewData.length)} rows of {totalRows.toLocaleString()} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  {mappedColumns.map(({ csvColumn, fieldInfo }) => (
                    <TableHead key={csvColumn} className="min-w-[150px]">
                      <div className="flex flex-col">
                        <span>{fieldInfo?.label || csvColumn}</span>
                        <span className="text-xs text-muted-foreground font-normal">
                          {csvColumn}
                        </span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.slice(0, 10).map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell className="text-center text-muted-foreground">
                      {rowIndex + 1}
                    </TableCell>
                    {mappedColumns.map(({ csvColumn }) => (
                      <TableCell key={csvColumn} className="max-w-[200px] truncate">
                        {row[csvColumn] || (
                          <span className="text-muted-foreground italic">empty</span>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Warning */}
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                Review before importing
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                This operation will import {totalRows.toLocaleString()} rows into the {schema.name} table.
                Rows with existing IDs will be updated. Invalid rows will be collected in a rejection report.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Mapping
        </Button>
        <Button size="lg" onClick={onConfirm}>
          Start Import
        </Button>
      </div>
    </div>
  );
}


