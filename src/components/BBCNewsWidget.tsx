import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, RefreshCw } from "lucide-react";
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

const BBCNewsWidget = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Using a free news API (News API) - you'll need to get an API key
      // For now, using mock data to demonstrate the widget
      const mockArticles: NewsArticle[] = [
        {
          title: "Technology Advances Drive Business Innovation",
          description: "Companies worldwide are adopting new technologies to streamline operations and improve customer experiences.",
          url: "https://bbc.co.uk/news/technology",
          urlToImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop",
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          source: { name: "BBC News" }
        },
        {
          title: "Global Markets Show Positive Growth",
          description: "Stock markets across major economies demonstrate resilience amid changing economic conditions.",
          url: "https://bbc.co.uk/news/business",
          urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop",
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          source: { name: "BBC News" }
        },
        {
          title: "Climate Change Solutions in Corporate Sector",
          description: "Businesses are implementing sustainable practices to address environmental challenges and reduce carbon footprint.",
          url: "https://bbc.co.uk/news/science-environment",
          urlToImage: "https://images.unsplash.com/photo-1569163139382-de7a9376a1c8?w=300&h=200&fit=crop",
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          source: { name: "BBC News" }
        }
      ];
      
      setArticles(mockArticles);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch news articles");
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to load news articles",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
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
              <div className="w-6 h-6 bg-red-600 rounded"></div>
              BBC News
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading news...</span>
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
              <div className="w-6 h-6 bg-red-600 rounded"></div>
              BBC News
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
            <CardTitle className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-600 rounded"></div>
              BBC News
            </CardTitle>
            <Button onClick={fetchNews} variant="ghost" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <div key={index} className="group cursor-pointer">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="space-y-3">
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
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
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
          <div className="mt-6 text-center">
            <Button variant="outline" asChild>
              <a href="https://www.bbc.co.uk/news" target="_blank" rel="noopener noreferrer" className="gap-2">
                View More News
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BBCNewsWidget;