import React, { useState } from 'react';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Announcement, AnnouncementFilters, AnnouncementSeverity } from './types';
import AnnouncementCard from './AnnouncementCard';
import { isAnnouncementActive } from './utils';

interface AnnouncementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcements: Announcement[];
  onDismiss: (id: string) => void;
}

const AnnouncementsModal: React.FC<AnnouncementsModalProps> = ({
  isOpen,
  onClose,
  announcements,
  onDismiss
}) => {
  const [filters, setFilters] = useState<AnnouncementFilters>({
    search: '',
    severity: 'all'
  });

  const filteredAnnouncements = announcements
    .filter(isAnnouncementActive)
    .filter(announcement => {
      const matchesSearch = !filters.search || 
        announcement.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        announcement.body.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesSeverity = filters.severity === 'all' || 
        announcement.severity === filters.severity;
      
      return matchesSearch && matchesSeverity;
    })
    .sort((a, b) => {
      // Pinned first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      
      // Then by start date (newest first)
      return new Date(b.startAt).getTime() - new Date(a.startAt).getTime();
    });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>All Announcements</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search announcements..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-9"
            />
          </div>
          
          <Select
            value={filters.severity}
            onValueChange={(value) => setFilters(prev => ({ 
              ...prev, 
              severity: value as AnnouncementSeverity | 'all' 
            }))}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-4 pr-4">
            {filteredAnnouncements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {filters.search || filters.severity !== 'all' 
                  ? 'No announcements match your filters.' 
                  : 'No active announcements.'}
              </div>
            ) : (
              filteredAnnouncements.map(announcement => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onDismiss={onDismiss}
                  isCompact={false}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementsModal;