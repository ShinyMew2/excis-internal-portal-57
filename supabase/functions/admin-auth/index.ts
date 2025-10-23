import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, password, data } = await req.json();
    const ADMIN_PASSWORD = Deno.env.get('ADMIN_PASSWORD');

    console.log('Admin auth request:', { action, hasPassword: !!password });

    // Validate admin password
    if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
      console.log('Invalid admin password provided');
      return new Response(
        JSON.stringify({ error: 'Invalid admin credentials' }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let result;

    switch (action) {
      case 'verify':
        // Simple password verification - returns success if password matches
        console.log('Password verification successful');
        return new Response(
          JSON.stringify({ success: true }), 
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'create':
        console.log('Creating announcement:', data);
        result = await supabase.from('announcements').insert({
          title: data.title,
          body: data.body,
          severity: data.severity,
          pinned: data.pinned,
          start_at: data.startAt,
          end_at: data.endAt || null,
          cta_label: data.cta?.label || null,
          cta_href: data.cta?.href || null
        });
        break;

      case 'update':
        console.log('Updating announcement:', data.id);
        result = await supabase.from('announcements').update({
          title: data.title,
          body: data.body,
          severity: data.severity,
          pinned: data.pinned,
          start_at: data.startAt,
          end_at: data.endAt || null,
          cta_label: data.cta?.label || null,
          cta_href: data.cta?.href || null
        }).eq('id', data.id);
        break;

      case 'delete':
        console.log('Deleting announcement:', data.id);
        result = await supabase.from('announcements').delete().eq('id', data.id);
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }

    if (result.error) {
      console.error('Database operation failed:', result.error);
      throw result.error;
    }

    console.log('Operation successful:', action);
    return new Response(
      JSON.stringify({ success: true, data: result.data }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in admin-auth function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});