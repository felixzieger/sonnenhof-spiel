import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Highscore {
  id: string;
  player_name: string;
  time_ms: number;
  created_at: string;
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
        .order('time_ms', { ascending: true })
        .limit(10);

      if (error) {
        console.error('Error fetching highscores:', error);
        throw error;
      }

      return data as Highscore[];
    },
  });

  const { mutateAsync: saveHighscore } = useMutation({
    mutationFn: async ({ playerName, timeMs }: { playerName: string; timeMs: number }) => {
      console.log('Saving highscore to Supabase:', { playerName, timeMs });
      const { data, error } = await supabase
        .from('highscores')
        .insert([{ player_name: playerName, time_ms: timeMs }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique violation
          throw new Error('Du hast bereits einen Highscore eingetragen!');
        }
        console.error('Error saving highscore:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highscores'] });
      toast.success('Dein Highscore wurde gespeichert!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    highscores,
    isLoading,
    saveHighscore,
  };
};