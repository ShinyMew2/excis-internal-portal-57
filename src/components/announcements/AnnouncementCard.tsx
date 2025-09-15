import React from 'react';
import ReactMarkdown from 'react-markdown';
import { X, Pin, Info, AlertTriangle, AlertCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Announcement } from './types';
import { getSeverityConfig, truncateMarkdown } from './utils';

interface AnnouncementCardProps {
  announcement: Announcement;
  onDismiss?: (id: string) => void;
  isCompact?: boolean;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  onDismiss,
  isCompact = false
}) => {
  const severityConfig = getSeverityConfig(announcement.severity);
  
  const getSeverityIcon = () => {
    switch (announcement.severity) {
      case 'critical':
        return <AlertCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const body = isCompact ? truncateMarkdown(announcement.body) : announcement.body;

  return (
    <Card className={`${severityConfig.bgColor} ${severityConfig.borderColor} border-2`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className={severityConfig.iconColor}>
                {getSeverityIcon()}
              </div>
              <h3 className={`font-semibold text-sm ${severityConfig.textColor}`}>
                {announcement.title}
              </h3>
              {announcement.pinned && (
                <Pin className="h-3 w-3 text-muted-foreground" />
              )}
              <Badge 
                variant="outline" 
                className={`text-xs ${severityConfig.iconColor} border-current`}
              >
                {announcement.severity}
              </Badge>
            </div>
            
            <div className={`text-sm ${severityConfig.textColor} prose prose-sm max-w-none`}>
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="underline hover:no-underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {body}
              </ReactMarkdown>
            </div>

            {announcement.cta && (
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className={`${severityConfig.iconColor} border-current hover:bg-current/10`}
                >
                  <a
                    href={announcement.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1"
                  >
                    {announcement.cta.label}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            )}
          </div>

          {onDismiss && (
            <Button
              variant="ghost"
              size="icon"
              className={`h-6 w-6 ${severityConfig.iconColor} hover:bg-current/10 flex-shrink-0`}
              onClick={() => onDismiss(announcement.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnouncementCard;