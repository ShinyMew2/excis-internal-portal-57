import { ExternalLink, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface AppData {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: LucideIcon;
  color: string;
  category?: string;
}

interface AppCardProps {
  app: AppData;
  onClick?: () => void;
}

const AppCard = ({ app, onClick }: AppCardProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.open(app.url, '_blank');
    }
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 bg-gradient-card border-0"
      onClick={handleClick}
    >
      <CardContent className="p-6 text-center">
        <div 
          className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: app.color }}
        >
          <app.icon className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="font-semibold text-lg text-card-foreground mb-2">
          {app.name}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
          {app.description}
        </p>
        
        <div className="flex items-center justify-center text-portal-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-sm font-medium mr-2">Open</span>
          <ExternalLink className="w-4 h-4" />
        </div>
      </CardContent>
    </Card>
  );
};

export default AppCard;