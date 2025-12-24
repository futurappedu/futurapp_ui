import { Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestTimerProps {
  formattedTime: string;
  percentageRemaining: number;
  isTimeUp: boolean;
  isSubmitting?: boolean;
}

export function TestTimer({ formattedTime, percentageRemaining, isTimeUp, isSubmitting }: TestTimerProps) {
  // Determine urgency level for styling
  const isLowTime = percentageRemaining <= 16.67; // Less than 10 minutes (10/60 * 100)
  const isVeryLowTime = percentageRemaining <= 8.33; // Less than 5 minutes (5/60 * 100)

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all duration-300',
        {
          'bg-white border border-gray-200 text-gray-700': !isLowTime && !isVeryLowTime && !isTimeUp,
          'bg-amber-50 border border-amber-300 text-amber-700': isLowTime && !isVeryLowTime && !isTimeUp,
          'bg-red-50 border border-red-400 text-red-700 animate-pulse': (isVeryLowTime && !isTimeUp),
          'bg-blue-50 border border-blue-400 text-blue-700': isTimeUp,
        }
      )}
    >
      {isSubmitting ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : isVeryLowTime || isTimeUp ? (
        <AlertTriangle className="h-5 w-5" />
      ) : (
        <Clock className="h-5 w-5" />
      )}
      <span className="font-mono text-lg font-semibold tracking-wider">
        {formattedTime}
      </span>
      {isVeryLowTime && !isTimeUp && (
        <span className="text-xs font-medium ml-1">¡Tiempo bajo!</span>
      )}
      {isTimeUp && isSubmitting && (
        <span className="text-xs font-medium ml-1">Guardando resultados...</span>
      )}
      {isTimeUp && !isSubmitting && (
        <span className="text-xs font-medium ml-1">¡Tiempo agotado!</span>
      )}
    </div>
  );
}

