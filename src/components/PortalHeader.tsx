import { Search, Newspaper, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PortalHeaderProps {
  onSearch?: (query: string) => void;
}

const PortalHeader = ({ onSearch }: PortalHeaderProps) => {
  const location = useLocation();
  const isOnBlogPage = location.pathname.startsWith('/blog');

  return (
    <header className="bg-gradient-hero shadow-elevated">
      <div className="container mx-auto px-6 py-8">
        {/* Top Navigation */}
        <div className="flex justify-end mb-6">
          <div className="flex gap-2">
            {isOnBlogPage ? (
              <Link to="/">
                <Button variant="ghost" className="text-white hover:bg-white/10 gap-2">
                  <Home className="w-4 h-4" />
                  Back to Portal
                </Button>
              </Link>
            ) : (
              <Link to="/blog">
                <Button variant="ghost" className="text-white hover:bg-white/10 gap-2">
                  <Newspaper className="w-4 h-4" />
                  News
                </Button>
              </Link>
            )}
            <a href="https://excis.com" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" className="text-white hover:bg-white/10 gap-2">
                <Newspaper className="w-4 h-4" />
                Excis site
              </Button>
            </a>
          </div>
        </div>

        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/e5a60800-09c9-479b-96c5-638f55742306.png" 
            alt="Excis Logo" 
            className="h-24 w-auto mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-white mb-2">
            Excis Compliance
          </h1>
          <p className="text-white/90 text-lg">
            Your Global IT Solution
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search applications, documents, or people..."
              className="pl-12 py-4 text-lg bg-white/95 backdrop-blur-sm border-0 shadow-card focus:shadow-card-hover transition-shadow duration-300"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default PortalHeader;