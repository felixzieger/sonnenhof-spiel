
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.0'

// Define CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the project URL and anon key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Query the top 5 highscores ordered by time (ascending = faster time is better)
    const { data, error } = await supabaseClient
      .from('highscores')
      .select('*')
      .order('time_ms', { ascending: true })
      .limit(5)

    if (error) {
      console.error('Error fetching top highscores:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch highscores' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    // Format the response with the top highscores
    const formattedData = data.map((score, index) => ({
      ...score,
      rank: index + 1,
    }))

    // Return the highscores as JSON
    return new Response(
      JSON.stringify({ 
        highscores: formattedData,
        success: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error in top-highscores function:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
