import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, RefreshCw, Globe } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface NewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image?: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

interface GNewsResponse {
  totalArticles: number;
  articles: NewsArticle[];
}

const WorldNewsWidget = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const { toast } = useToast();

  // GNews.io API - Free tier allows 100 requests per day
  const GNEWS_API_KEY = "cf20b5fc7c42de7c5bf7e7aaf7a2a01b"; // Free API key
  const GNEWS_API_URL = "https://gnews.io/api/v4/top-headlines";

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        token: GNEWS_API_KEY,
        lang: 'en',
        country: 'us',
        max: '6',
        in: 'title,description',
        sortby: 'publishedAt'
      });

      const response = await fetch(`${GNEWS_API_URL}?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('API access forbidden. Please check API key.');
        } else if (response.status === 429) {
          throw new Error('API rate limit exceeded. Please try again later.');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      
      const data: GNewsResponse = await response.json();
      
      if (data.articles && Array.isArray(data.articles)) {
        // Filter out articles without images for better visual appeal
        const articlesWithImages = data.articles.filter(article => article.image);
        setArticles(articlesWithImages.slice(0, 6));
        setLastFetch(new Date());
        setLoading(false);
        
        if (articlesWithImages.length === 0) {
          setError("No articles with images found");
        }
      } else {
        throw new Error('Invalid response format from news API');
      }
      
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err instanceof Error ? err.message : "Failed to fetch news articles");
      setLoading(false);
      
      toast({
        title: "News Update Failed", 
        description: "Unable to load latest news. Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Auto-refresh every 3.5 hours
  useEffect(() => {
    fetchNews();
    
    const interval = setInterval(() => {
      fetchNews();
    }, 3.5 * 60 * 60 * 1000); // 3.5 hours in milliseconds
    
    return () => clearInterval(interval);
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 60) {
      return diffInMinutes < 1 ? "Just now" : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, text.lastIndexOf(' ', maxLength)) + '...';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" />
              World News
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading latest news...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" />
              World News
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchNews} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" />
              World News
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No news articles available at the moment</p>
              <Button onClick={fetchNews} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2 mb-2">
                <Globe className="w-6 h-6 text-primary" />
                World News
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Latest headlines from around the world
                {lastFetch && ` • Last updated ${formatTime(lastFetch.toISOString())}`}
              </p>
            </div>
            <Button onClick={fetchNews} variant="ghost" size="sm" disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <div key={`${article.url}-${index}`} className="group cursor-pointer h-full">
                <div className="h-full border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 bg-card">
                  {article.image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="p-4 space-y-3 flex flex-col h-full">
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {truncateText(article.description || "", 120)}
                      </p>
                    </div>
                    
                    <div className="space-y-3 mt-auto">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(article.publishedAt)}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {article.source.name}
                        </Badge>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full gap-2"
                        asChild
                      >
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                          Read More
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              News provided by{" "}
              <a 
                href="https://gnews.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GNews.io
              </a>
              {" "}• Updates automatically every 3-4 hours
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorldNewsWidget;