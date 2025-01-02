import { useQuery, useQueryClient } from '@tanstack/react-query';
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

interface UpdateHighscoreParams {
  p_player_name: string;
  p_time_ms: number;
}

export const useHighscores = () => {
  const queryClient = useQueryClient();

  const { data: highscores = [], isLoading } = useQuery({
    queryKey: ['highscores'],
    queryFn: async () => {
      console.log('Fetching highscores from Supabase');
      const { data, error } = await supabase
        .from('highscores')
        .select('*')
        .order('time_ms', { ascending: true });

      if (error) {
        console.error('Error fetching highscores:', error);
        throw error;
      }

      return data as Highscore[];
    },
  });

  const saveHighscore = async ({ 
    playerName, 
    timeMs 
  }: { 
    playerName: string; 
    timeMs: number 
  }): Promise<SaveHighscoreResponse> => {
    console.log('Saving highscore:', { playerName, timeMs });
    
    const { data, error } = await supabase
      .rpc('update_highscore', {
        p_player_name: playerName,
        p_time_ms: timeMs
      });

    if (error) {
      console.error('Error saving highscore:', error);
      throw error;
    }

    // Invalidate and refetch highscores after successful save
    await queryClient.invalidateQueries({ queryKey: ['highscores'] });

    return data as SaveHighscoreResponse;
  };

  return {
    highscores,
    isLoading,
    saveHighscore,
  };
};