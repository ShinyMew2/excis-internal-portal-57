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
    const { action, table, password, data, id } = await req.json();
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

      case 'create': {
        if (table === 'blog_posts') {
          console.log('Creating blog post');
          const makeSlug = (title?: string, slug?: string) => {
            const base = (slug || title || '').toString().toLowerCase();
            const cleaned = base
              .replace(/[^a-z0-9\s-]/g, '')
              .trim()
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-');
            return cleaned || `post-${Date.now()}`;
          };

          const post = {
            title: data.title,
            slug: makeSlug(data.title, data.slug),
            content: data.content,
            excerpt: data.excerpt || null,
            featured_image: data.featured_image || null,
            images: Array.isArray(data.images) ? data.images : [],
            tags: Array.isArray(data.tags) ? data.tags : [],
            category: data.category || null,
            status: data.status || 'draft',
            author_name: data.author_name || 'Admin',
            published_at: data.published_at || null,
          };

          result = await supabase.from('blog_posts').insert(post);
        } else if (!table || table === 'announcements') {
          console.log('Creating announcement');
          result = await supabase.from('announcements').insert({
            title: data.title,
            body: data.body,
            severity: data.severity,
            pinned: data.pinned,
            start_at: data.startAt,
            end_at: data.endAt || null,
            cta_label: data.cta?.label || null,
            cta_href: data.cta?.href || null,
          });
        } else {
          return new Response(
            JSON.stringify({ error: 'Unsupported table for create' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        break;
      }

      case 'update': {
        const targetId = data?.id || id;
        if (!targetId) {
          return new Response(
            JSON.stringify({ error: 'Missing id for update' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (table === 'blog_posts') {
          console.log('Updating blog post:', targetId);
          const makeSlug = (title?: string, slug?: string) => {
            const base = (slug || title || '').toString().toLowerCase();
            const cleaned = base
              .replace(/[^a-z0-9\s-]/g, '')
              .trim()
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-');
            return cleaned || `post-${Date.now()}`;
          };

          const update = {
            title: data.title,
            slug: makeSlug(data.title, data.slug),
            content: data.content,
            excerpt: data.excerpt ?? null,
            featured_image: data.featured_image ?? null,
            images: Array.isArray(data.images) ? data.images : [],
            tags: Array.isArray(data.tags) ? data.tags : [],
            category: data.category ?? null,
            status: data.status || 'draft',
            author_name: data.author_name || 'Admin',
            published_at: data.published_at ?? null,
          };

          result = await supabase.from('blog_posts').update(update).eq('id', targetId);
        } else if (!table || table === 'announcements') {
          console.log('Updating announcement:', targetId);
          result = await supabase.from('announcements').update({
            title: data.title,
            body: data.body,
            severity: data.severity,
            pinned: data.pinned,
            start_at: data.startAt,
            end_at: data.endAt || null,
            cta_label: data.cta?.label || null,
            cta_href: data.cta?.href || null,
          }).eq('id', targetId);
        } else {
          return new Response(
            JSON.stringify({ error: 'Unsupported table for update' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        break;
      }

      case 'delete': {
        const targetId = data?.id || id;
        if (!targetId) {
          return new Response(
            JSON.stringify({ error: 'Missing id for delete' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (table === 'blog_posts') {
          console.log('Deleting blog post:', targetId);
          result = await supabase.from('blog_posts').delete().eq('id', targetId);
        } else if (!table || table === 'announcements') {
          console.log('Deleting announcement:', targetId);
          result = await supabase.from('announcements').delete().eq('id', targetId);
        } else {
          return new Response(
            JSON.stringify({ error: 'Unsupported table for delete' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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