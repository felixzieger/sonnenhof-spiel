import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Highscore {
  id: string;
  player_name: string;
  time_ms: number;
  created_at: string;
}

interface SaveHighscoreResponse {
  success: boolean;
  message: string;
}

export const useHighscores = () => {
  const queryClient = useQueryClient();

  const { data: highscores = [], isLoading } = useQuery({
    queryKey: ['highscores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('highscores')
        .select('*')
        .order('time_ms', { ascending: true })
        .limit(10);

      if (error) throw error;
      return data as Highscore[];
    },
  });

  const { mutateAsync: saveHighscore } = useMutation({
    mutationFn: async ({ playerName, timeMs }: { playerName: string; timeMs: number }) => {
      const { data, error } = await supabase
        .rpc('update_highscore', {
          p_player_name: playerName,
          p_time_ms: timeMs,
        });

      if (error) throw error;

      // Cast to unknown first, then to SaveHighscoreResponse to satisfy TypeScript
      const response = data as unknown as SaveHighscoreResponse;
      if (typeof response.success !== 'boolean' || typeof response.message !== 'string') {
        throw new Error('Invalid response format from update_highscore');
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highscores'] });
    },
  });

  return {
    highscores,
    isLoading,
    saveHighscore,
  };
};