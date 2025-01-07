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

    // Cast the response to SaveHighscoreResponse and validate its shape
    const response = data as SaveHighscoreResponse;
    if (typeof response.success !== 'boolean' || typeof response.message !== 'string') {
      throw new Error('Invalid response format from update_highscore');
    }

    // Invalidate and refetch highscores after successful save
    await queryClient.invalidateQueries({ queryKey: ['highscores'] });

    return response;
  };

  return {
    highscores,
    isLoading,
    saveHighscore,
  };
};