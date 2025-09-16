import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, RefreshCw, Globe } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

// Note: In production, store API key securely. For demo, using a placeholder.
// Get your free API key from: https://newsapi.org/
const NEWS_API_KEY = "your_api_key_here"; // Replace with your actual API key

const WorldNewsWidget = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For demo purposes, we'll use a CORS proxy with NewsAPI
      // In production, you'd want to use your own backend to avoid exposing API keys
      const proxyUrl = "https://cors-anywhere.herokuapp.com/";
      const targetUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=6&apiKey=${NEWS_API_KEY}`;
      
      // Fallback to mock data if API key is not configured or CORS issues
      if (NEWS_API_KEY === "your_api_key_here") {
        // Using realistic mock data from various news sources
        const mockArticles: NewsArticle[] = [
          {
            title: "Global Technology Summit Announces Revolutionary AI Breakthroughs",
            description: "World leaders in technology gather to discuss the latest advancements in artificial intelligence and their impact on global industries.",
            url: "https://www.reuters.com/technology/",
            urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop",
            publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            source: { name: "Reuters" }
          },
          {
            title: "International Climate Agreement Reaches New Milestone",
            description: "Countries worldwide commit to enhanced environmental protection measures with ambitious new targets for carbon reduction.",
            url: "https://www.bbc.com/news",
            urlToImage: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=400&h=225&fit=crop",
            publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            source: { name: "BBC News" }
          },
          {
            title: "World Markets Show Strong Performance Amid Economic Recovery",
            description: "Global stock exchanges report positive gains as economic indicators suggest continued recovery and growth across major economies.",
            url: "https://www.cnbc.com/world/",
            urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop",
            publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            source: { name: "CNBC" }
          },
          {
            title: "Scientific Discovery Could Transform Medical Treatment",
            description: "Researchers announce a groundbreaking medical advancement that promises to revolutionize treatment approaches for complex diseases.",
            url: "https://www.nature.com/",
            urlToImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=225&fit=crop",
            publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            source: { name: "Nature" }
          },
          {
            title: "Space Exploration Mission Achieves Historic First",
            description: "International space agencies celebrate a major milestone in space exploration with successful completion of ambitious mission objectives.",
            url: "https://www.nasa.gov/news/",
            urlToImage: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=225&fit=crop",
            publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            source: { name: "NASA" }
          },
          {
            title: "Global Education Initiative Launches in 50 Countries",
            description: "A comprehensive educational program designed to enhance digital literacy and skills training begins implementation worldwide.",
            url: "https://www.unesco.org/",
            urlToImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=225&fit=crop",
            publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            source: { name: "UNESCO" }
          }
        ];
        
        setArticles(mockArticles);
        setLastFetch(new Date());
        setLoading(false);
        return;
      }

      // Real API call (requires proper API key and CORS handling)
      const response = await fetch(`${proxyUrl}${targetUrl}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'ok' && data.articles) {
        setArticles(data.articles.slice(0, 6));
        setLastFetch(new Date());
      } else {
        throw new Error(data.message || 'Failed to fetch news');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError("Failed to fetch news articles");
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to load news articles. Please check your internet connection.",
        variant: "destructive",
      });
    }
  };

  // Auto-refresh every 3 hours
  useEffect(() => {
    fetchNews();
    
    const interval = setInterval(() => {
      fetchNews();
    }, 3 * 60 * 60 * 1000); // 3 hours in milliseconds
    
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
              <div key={index} className="group cursor-pointer">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="space-y-3 h-full">
                    {article.urlToImage && (
                      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                        <img
                          src={article.urlToImage}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="space-y-2 flex-1">
                      <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(article.publishedAt)}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {article.source.name}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
          
          {NEWS_API_KEY === "your_api_key_here" && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Demo Mode:</strong> Showing sample articles. 
                <a 
                  href="https://newsapi.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline ml-1"
                >
                  Get your free NewsAPI key
                </a> 
                {" "}to display real-time news.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorldNewsWidget;