import { useState } from "react";
import AppCard, { AppData } from "./AppCard";

interface AppGridProps {
  apps: AppData[];
  searchQuery?: string;
}

const AppGrid = ({ apps, searchQuery }: AppGridProps) => {
  const filteredApps = apps.filter(app => 
    !searchQuery || 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Your Applications
        </h2>
        <p className="text-muted-foreground">
          {searchQuery 
            ? `Found ${filteredApps.length} applications matching "${searchQuery}"`
            : `${apps.length} applications available`
          }
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredApps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
      
      {filteredApps.length === 0 && searchQuery && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4 opacity-20">🔍</div>
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">
            No applications found
          </h3>
          <p className="text-muted-foreground">
            Try searching with different keywords
          </p>
        </div>
      )}
    </div>
  );
};

export default AppGrid;