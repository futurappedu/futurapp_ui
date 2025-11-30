/**
 * Bulk Importer Wizard
 * 
 * Main wizard component that orchestrates the 4-step import process:
 * 1. Upload - Select file and target table
 * 2. Map Columns - Match CSV headers to database fields
 * 3. Preview - Review data before import
 * 4. Submit - Upload and track progress
 */

import { useState } from 'react';
import { Card, CardContent} from '@/components/ui/card';
import { Upload, ArrowRightLeft, Eye, Send, CheckCircle2 } from 'lucide-react';
import UploadStep from './UploadStep';
import ColumnMapperStep from './ColumnMapperStep';
import PreviewStep from './PreviewStep';
import SubmitStep from './SubmitStep';

type WizardStep = 'upload' | 'map' | 'preview' | 'submit';

interface StepInfo {
  id: WizardStep;
  label: string;
  icon: React.ReactNode;
}

const steps: StepInfo[] = [
  { id: 'upload', label: 'Upload', icon: <Upload className="h-4 w-4" /> },
  { id: 'map', label: 'Map Columns', icon: <ArrowRightLeft className="h-4 w-4" /> },
  { id: 'preview', label: 'Preview', icon: <Eye className="h-4 w-4" /> },
  { id: 'submit', label: 'Import', icon: <Send className="h-4 w-4" /> },
];

interface WizardState {
  file: File | null;
  csvHeaders: string[];
  previewData: Record<string, string>[];
  totalRows: number;
  targetTable: 'scholarships' | 'programs' | null;
  columnMapping: Record<string, string>;
}

export default function BulkImporterWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('upload');
  const [state, setState] = useState<WizardState>({
    file: null,
    csvHeaders: [],
    previewData: [],
    totalRows: 0,
    targetTable: null,
    columnMapping: {},
  });

  const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep);

  const handleFileLoaded = (
    file: File,
    headers: string[],
    previewData: Record<string, string>[],
    totalRows: number,
    targetTable: 'scholarships' | 'programs'
  ) => {
    setState(prev => ({
      ...prev,
      file,
      csvHeaders: headers,
      previewData,
      totalRows,
      targetTable,
    }));
    setCurrentStep('map');
  };

  const handleMappingComplete = (mapping: Record<string, string>) => {
    setState(prev => ({
      ...prev,
      columnMapping: mapping,
    }));
    setCurrentStep('preview');
  };

  const handleConfirmPreview = () => {
    setCurrentStep('submit');
  };

  const handleComplete = () => {
    // Reset wizard
    setState({
      file: null,
      csvHeaders: [],
      previewData: [],
      totalRows: 0,
      targetTable: null,
      columnMapping: {},
    });
    setCurrentStep('upload');
  };

  const handleStartOver = () => {
    setState({
      file: null,
      csvHeaders: [],
      previewData: [],
      totalRows: 0,
      targetTable: null,
      columnMapping: {},
    });
    setCurrentStep('upload');
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                      ${index < getCurrentStepIndex() 
                        ? 'bg-primary border-primary text-primary-foreground' 
                        : index === getCurrentStepIndex()
                          ? 'border-primary text-primary'
                          : 'border-muted text-muted-foreground'
                      }
                    `}
                  >
                    {index < getCurrentStepIndex() ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span 
                    className={`
                      mt-2 text-sm font-medium
                      ${index <= getCurrentStepIndex() ? 'text-foreground' : 'text-muted-foreground'}
                    `}
                  >
                    {step.label}
                  </span>
                </div>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div 
                    className={`
                      flex-1 h-0.5 mx-4 mt-[-24px]
                      ${index < getCurrentStepIndex() ? 'bg-primary' : 'bg-muted'}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 'upload' && (
        <UploadStep onFileLoaded={handleFileLoaded} />
      )}

      {currentStep === 'map' && state.targetTable && (
        <ColumnMapperStep
          csvHeaders={state.csvHeaders}
          targetTable={state.targetTable}
          onMappingComplete={handleMappingComplete}
          onBack={() => setCurrentStep('upload')}
        />
      )}

      {currentStep === 'preview' && state.targetTable && (
        <PreviewStep
          previewData={state.previewData}
          columnMapping={state.columnMapping}
          targetTable={state.targetTable}
          totalRows={state.totalRows}
          onConfirm={handleConfirmPreview}
          onBack={() => setCurrentStep('map')}
        />
      )}

      {currentStep === 'submit' && state.file && state.targetTable && (
        <SubmitStep
          file={state.file}
          columnMapping={state.columnMapping}
          targetTable={state.targetTable}
          onComplete={handleComplete}
          onStartOver={handleStartOver}
        />
      )}
    </div>
  );
}


