import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { adminApi } from '@/services/adminApi';
import { useAuth0 } from '@auth0/auth0-react';
import { ExternalLink, GraduationCap, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Favorite {
  id: number;
  programa_id: number;
  programa: string;
  nombre_programa: string | null;
  universidad: string | null;
  pais: string | null;
  enlace: string | null;
  created_at: string | null;
}

interface UserFavoritesProps {
  userId: number;
  userName: string;
}

export default function UserFavorites({ userId, userName }: UserFavoritesProps) {
  const { getAccessTokenSilently } = useAuth0();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminApi.getUserFavorites(userId, getAccessTokenSilently);
        setFavorites(data.favorites);
      } catch (err: any) {
        setError(err.message || 'Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchFavorites();
    }
  }, [userId]);

  if (loading) {
    return <div className="text-center py-8">Loading favorites...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Favorites for {userName}</CardTitle>
        <CardDescription>{favorites.length} favorite program{favorites.length !== 1 ? 's' : ''}</CardDescription>
      </CardHeader>
      <CardContent>
        {favorites.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            This user has no favorites yet.
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((fav) => (
              <div
                key={fav.id}
                className="p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      {fav.nombre_programa || fav.programa}
                    </h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {fav.universidad && (
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          {fav.universidad}
                        </div>
                      )}
                      {fav.pais && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {fav.pais}
                        </div>
                      )}
                      {fav.created_at && (
                        <div className="text-xs mt-2">
                          Added: {new Date(fav.created_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  {fav.enlace && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(fav.enlace!, '_blank')}
                      className="ml-4"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Program
                    </Button>
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

