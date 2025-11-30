import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

console.log('Create-profile function booting up!');

Deno.serve(async (req) => {
  console.log('Function received a request.');

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request.');
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('Request body:', body);

    const { user_id, full_name, phone } = body;

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SERVICE_KEY');

    console.log('Supabase URL available:', !!supabaseUrl);
    console.log('Service Key available:', !!serviceKey);

    if (!supabaseUrl || !serviceKey) {
      throw new Error('Missing environment variables.');
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey);
    console.log('Supabase admin client created.');

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: user_id,
        full_name: full_name,
        phone: phone,
        role: 'user',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase upsert error:', error);
      throw error;
    }

    console.log('Profile upserted successfully:', data);

    return new Response(JSON.stringify({ profile: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Caught an error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});