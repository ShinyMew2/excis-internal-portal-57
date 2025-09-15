import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnnouncementCard from './AnnouncementCard';
import AnnouncementsModal from './AnnouncementsModal';
import { mockAnnouncements } from './data';
import { getActiveAnnouncements, dismissAnnouncement, isAnnouncementActive } from './utils';

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Force re-render when dismissed announcements change
  const activeAnnouncements = getActiveAnnouncements(announcements);
  const displayedAnnouncements = activeAnnouncements.slice(0, 3);
  const totalActiveCount = announcements.filter(isAnnouncementActive).length;

  const handleDismiss = (id: string) => {
    dismissAnnouncement(id);
    setRefreshKey(prev => prev + 1); // Force re-render
  };

  // Refresh on mount to check for expired dismissals
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  if (displayedAnnouncements.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-6" key={refreshKey}>
      <div className="space-y-4">
        {displayedAnnouncements.map(announcement => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            onDismiss={handleDismiss}
            isCompact={true}
          />
        ))}
        
        {totalActiveCount > 3 && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(true)}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              View all announcements ({totalActiveCount})
            </Button>
          </div>
        )}
      </div>

      <AnnouncementsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        announcements={announcements}
        onDismiss={handleDismiss}
      />
    </div>
  );
};

export default Announcements;