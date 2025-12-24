import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseTestTimerProps {
  durationInMinutes?: number;
  onTimeUp: () => Promise<void>;
  submitted: boolean;
}

interface UseTestTimerReturn {
  timeRemaining: number;
  formattedTime: string;
  isTimeUp: boolean;
  isSubmitting: boolean;
  percentageRemaining: number;
}

export function useTestTimer({
  durationInMinutes = 60,
  onTimeUp,
  submitted,
}: UseTestTimerProps): UseTestTimerReturn {
  const navigate = useNavigate();
  const totalSeconds = durationInMinutes * 60;
  const [timeRemaining, setTimeRemaining] = useState(totalSeconds);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasSubmittedRef = useRef(false);

  // Format time as MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Handle time expiration
  useEffect(() => {
    if (timeRemaining <= 0 && !hasSubmittedRef.current && !submitted) {
      hasSubmittedRef.current = true;
      setIsTimeUp(true);
      setIsSubmitting(true);
      
      // Auto-submit and redirect
      onTimeUp()
        .then(() => {
          setTimeout(() => {
            navigate('/test_home');
          }, 500);
        })
        .catch(() => {
          setTimeout(() => {
            navigate('/test_home');
          }, 500);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  }, [timeRemaining, onTimeUp, navigate, submitted]);

  // Countdown timer
  useEffect(() => {
    if (submitted || isTimeUp) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [submitted, isTimeUp]);

  return {
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    isTimeUp,
    isSubmitting,
    percentageRemaining: (timeRemaining / totalSeconds) * 100,
  };
}

