import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const newsApiKey = Deno.env.get('NEWSAPI_KEY');
    
    if (!newsApiKey) {
      console.error('NEWSAPI_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Fetching news from NewsAPI.org...');
    
    // Fetch news from NewsAPI.org
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=world -anime -manga -otaku&language=en&sortBy=publishedAt&pageSize=6&apiKey=${newsApiKey}`,
      {
        headers: {
          'User-Agent': 'Supabase-Edge-Function',
        },
      }
    );

    if (!response.ok) {
      console.error(`NewsAPI error: ${response.status} ${response.statusText}`);
      const errorData = await response.text();
      console.error('Error response:', errorData);
      
      return new Response(
        JSON.stringify({ 
          error: `Failed to fetch news: ${response.status}`,
          details: errorData
        }), 
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    console.log(`Successfully fetched ${data.articles?.length || 0} articles`);

    if (data.status === 'ok' && data.articles) {
      // Transform the data to match our interface
      const transformedArticles = data.articles.map((article: any) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        image: article.urlToImage,
        publishedAt: article.publishedAt,
        source: {
          name: article.source.name
        }
      }));

      return new Response(
        JSON.stringify({ 
          articles: transformedArticles,
          status: 'success'
        }), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      console.error('Invalid response from NewsAPI:', data);
      return new Response(
        JSON.stringify({ 
          error: data.message || 'Invalid response from news API',
          status: 'error'
        }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('Error in fetch-news function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message,
        status: 'error'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});