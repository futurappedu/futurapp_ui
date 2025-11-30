/**
 * Submit Step Component
 * 
 * Handles the actual upload and shows import progress.
 * Polls for job status until completion.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Upload, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Download, 
  RotateCcw,
  FileWarning
} from 'lucide-react';
import { adminApi, ImportJobStatus } from '@/services/adminApi';
import { useAuth0 } from '@auth0/auth0-react';

interface SubmitStepProps {
  file: File;
  columnMapping: Record<string, string>;
  targetTable: 'scholarships' | 'programs';
  onComplete: () => void;
  onStartOver: () => void;
}

type Phase = 'uploading' | 'processing' | 'completed' | 'failed';

export default function SubmitStep({
  file,
  columnMapping,
  targetTable,
  onComplete,
  onStartOver
}: SubmitStepProps) {
  const { getAccessTokenSilently } = useAuth0();
  const [phase, setPhase] = useState<Phase>('uploading');
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<ImportJobStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Prevent double uploads (React StrictMode or double-clicks)
  const uploadStartedRef = useRef(false);

  // Upload file and create job
  const startUpload = useCallback(async () => {
    // Prevent duplicate uploads
    if (uploadStartedRef.current) {
      console.log('Upload already in progress, skipping duplicate');
      return;
    }
    uploadStartedRef.current = true;
    
    try {
      setPhase('uploading');
      setError(null);
      setUploadProgress(0);

      // Simulate upload progress (actual progress tracking would require XHR)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await adminApi.uploadImport(
        file,
        targetTable,
        columnMapping,
        getAccessTokenSilently
      );

      clearInterval(progressInterval);
      setUploadProgress(100);
      setJobId(result.job_id);
      setPhase('processing');
    } catch (err) {
      setPhase('failed');
      setError(err instanceof Error ? err.message : 'Upload failed');
      // Reset ref so retry can work
      uploadStartedRef.current = false;
    }
  }, [file, targetTable, columnMapping, getAccessTokenSilently]);

  // Poll for job status
  useEffect(() => {
    if (phase !== 'processing' || !jobId) return;

    let isMounted = true;
    const pollInterval = setInterval(async () => {
      try {
        const status = await adminApi.getImportJobStatus(jobId, getAccessTokenSilently);
        if (!isMounted) return;

        setJobStatus(status);

        if (status.status === 'completed') {
          setPhase('completed');
          clearInterval(pollInterval);
        } else if (status.status === 'failed') {
          setPhase('failed');
          setError(status.error_message || 'Import failed');
          clearInterval(pollInterval);
        }
      } catch (err) {
        // Continue polling on network errors
        console.error('Polling error:', err);
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [phase, jobId, getAccessTokenSilently]);

  // Start upload on mount
  useEffect(() => {
    startUpload();
  }, []);

  const handleDownloadRejections = async () => {
    if (!jobId) return;
    try {
      await adminApi.downloadRejections(jobId, getAccessTokenSilently);
    } catch (err) {
      console.error('Failed to download rejections:', err);
    }
  };

  const getProgressValue = () => {
    if (phase === 'uploading') return uploadProgress;
    if (phase === 'completed') return 100;
    if (!jobStatus || jobStatus.total_rows === 0) return 0;
    return Math.round(((jobStatus.valid_rows + jobStatus.invalid_rows) / jobStatus.total_rows) * 100);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {phase === 'uploading' && <Upload className="h-5 w-5 animate-pulse" />}
            {phase === 'processing' && <Loader2 className="h-5 w-5 animate-spin" />}
            {phase === 'completed' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            {phase === 'failed' && <XCircle className="h-5 w-5 text-red-500" />}
            
            {phase === 'uploading' && 'Uploading File...'}
            {phase === 'processing' && 'Processing Import...'}
            {phase === 'completed' && 'Import Complete!'}
            {phase === 'failed' && 'Import Failed'}
          </CardTitle>
          <CardDescription>
            {phase === 'uploading' && 'Uploading your CSV file to the server'}
            {phase === 'processing' && 'Validating and importing your data'}
            {phase === 'completed' && 'Your data has been successfully imported'}
            {phase === 'failed' && 'There was an error processing your import'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={getProgressValue()} className="h-3" />
          
          {/* Status Details */}
          {jobStatus && (
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">{jobStatus.total_rows.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Rows</p>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{jobStatus.valid_rows.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Successful</p>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{jobStatus.invalid_rows.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Failed</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success with Rejections */}
      {phase === 'completed' && jobStatus?.has_rejections && (
        <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <FileWarning className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800 dark:text-yellow-200">
            Some rows were rejected
          </AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-300">
            {jobStatus.invalid_rows} rows could not be imported due to validation errors.
            Download the rejection report to see the details.
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        {phase === 'completed' && (
          <>
            {jobStatus?.has_rejections && (
              <Button variant="outline" onClick={handleDownloadRejections}>
                <Download className="h-4 w-4 mr-2" />
                Download Rejections
              </Button>
            )}
            <Button onClick={onComplete}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Done
            </Button>
          </>
        )}

        {phase === 'failed' && (
          <>
            <Button variant="outline" onClick={onStartOver}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Start Over
            </Button>
            <Button onClick={startUpload}>
              Retry Upload
            </Button>
          </>
        )}
      </div>

      {/* Processing Message */}
      {phase === 'processing' && (
        <p className="text-center text-sm text-muted-foreground">
          This may take a few minutes for large files. You can leave this page 
          and check back later.
        </p>
      )}
    </div>
  );
}


