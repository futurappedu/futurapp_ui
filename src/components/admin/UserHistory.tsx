import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { adminApi } from '@/services/adminApi';
import { useAuth0 } from '@auth0/auth0-react';
import { ExternalLink, MousePointerClick, Heart, Eye } from 'lucide-react';


interface HistoryItem {
  id: number;
  action: 'VIEW' | 'OPEN_URL' | 'INTEREST' | 'FAVORITE_ADD' | 'FAVORITE_REMOVE';
  entity_type: 'PROGRAM' | 'UNIVERSITY';
  entity_id: number;
  created_at: string;
  meta: any;
  details?: {
    nombre_programa?: string;
    programa?: string;
  };
}

interface UserHistoryProps {
  userId: number;
  userName: string;
}

export default function UserHistory({ userId, userName }: UserHistoryProps) {
  const { getAccessTokenSilently } = useAuth0();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminApi.getUserHistory(userId, getAccessTokenSilently);
        setHistory(data.history);
      } catch (err: any) {
        setError(err.message || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchHistory();
    }
  }, [userId]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'OPEN_URL':
        return <ExternalLink className="h-4 w-4 text-blue-500" />;
      case 'FAVORITE_ADD':
        return <Heart className="h-4 w-4 text-red-500 fill-red-500" />;
      case 'FAVORITE_REMOVE':
        return <Heart className="h-4 w-4 text-gray-400" />;
      case 'INTEREST':
        return <MousePointerClick className="h-4 w-4 text-green-500" />;
      default:
        return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'OPEN_URL': return 'Opened Link';
      case 'FAVORITE_ADD': return 'Favorited';
      case 'FAVORITE_REMOVE': return 'Unfavorited';
      case 'INTEREST': return 'Showed Interest';
      case 'VIEW': return 'Viewed';
      default: return action;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading history...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity History for {userName}</CardTitle>
        <CardDescription>Recent actions and clicks</CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No activity recorded yet.
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 p-3 rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <div className="mt-1 p-2 bg-muted rounded-full">
                  {getActionIcon(item.action)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">
                      {getActionLabel(item.action)}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {item.details?.nombre_programa || item.details?.programa || `Item #${item.entity_id}`}
                  </div>

                  {item.action === 'OPEN_URL' && item.meta?.url && (
                    <div className="mt-2 p-2 bg-slate-50 rounded border text-xs break-all font-mono">
                      {item.meta.url}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}



