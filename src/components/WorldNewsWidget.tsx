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
  image?: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

// GNews.io API integration
const GNEWS_API_KEY = "d88039e4c79d44049fbe36c34a718a55";

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
      // Fetch news from GNews.io API
      const response = await fetch(
        `https://gnews.io/api/v4/top-headlines?token=${GNEWS_API_KEY}&lang=en&country=us&max=6&in=title,description&sortby=publishedAt`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.articles) {
        setArticles(data.articles);
        setLastFetch(new Date());
      } else {
        throw new Error(data.errors?.[0] || 'Failed to fetch news');
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
                     {article.image && (
                       <div className="aspect-video rounded-lg overflow-hidden bg-muted">
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
          
        </CardContent>
      </Card>
    </div>
  );
};

export default WorldNewsWidget;