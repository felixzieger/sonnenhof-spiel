
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TopHighscore {
  id: string;
  player_name: string;
  time_ms: number;
  created_at: string;
  rank: number;
}

export const useTopHighscores = () => {
  const [topHighscores, setTopHighscores] = useState<TopHighscore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopHighscores = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase.functions.invoke('top-highscores');
        
        if (error) {
          console.error('Error invoking top-highscores function:', error);
          setError('Failed to fetch top highscores');
          return;
        }
        
        if (data.success && data.highscores) {
          setTopHighscores(data.highscores);
        } else {
          setError('Invalid response format from server');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopHighscores();
  }, []);

  return { topHighscores, isLoading, error };
};
