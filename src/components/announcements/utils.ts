import { Announcement, AnnouncementSeverity } from './types';

const DISMISS_STORAGE_KEY = 'dismissed-announcements';
const DISMISS_DURATION_DAYS = 7;

export const isDismissed = (announcementId: string): boolean => {
  try {
    const dismissed = JSON.parse(localStorage.getItem(DISMISS_STORAGE_KEY) || '{}');
    const dismissedAt = dismissed[announcementId];
    
    if (!dismissedAt) return false;
    
    const dismissedDate = new Date(dismissedAt);
    const now = new Date();
    const daysSinceDismissed = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
    
    return daysSinceDismissed < DISMISS_DURATION_DAYS;
  } catch {
    return false;
  }
};

export const dismissAnnouncement = (announcementId: string): void => {
  try {
    const dismissed = JSON.parse(localStorage.getItem(DISMISS_STORAGE_KEY) || '{}');
    dismissed[announcementId] = new Date().toISOString();
    localStorage.setItem(DISMISS_STORAGE_KEY, JSON.stringify(dismissed));
  } catch {
    // Fail silently if localStorage is not available
  }
};

export const isAnnouncementActive = (announcement: Announcement): boolean => {
  const now = new Date();
  const startAt = new Date(announcement.startAt);
  const endAt = announcement.endAt ? new Date(announcement.endAt) : null;
  
  return now >= startAt && (!endAt || now <= endAt);
};

/**
 * Gets announcements from localStorage or returns empty array
 */
export function getStoredAnnouncements(): Announcement[] {
  const stored = localStorage.getItem('admin_announcements');
  return stored ? JSON.parse(stored) : [];
}

export const getActiveAnnouncements = (announcements: Announcement[]): Announcement[] => {
  return announcements
    .filter(isAnnouncementActive)
    .filter(ann => !isDismissed(ann.id))
    .sort((a, b) => {
      // Pinned first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      
      // Then by start date (newest first)
      return new Date(b.startAt).getTime() - new Date(a.startAt).getTime();
    });
};

export const getSeverityConfig = (severity: AnnouncementSeverity) => {
  switch (severity) {
    case 'critical':
      return {
        bgColor: 'bg-destructive/10',
        borderColor: 'border-destructive/30',
        iconColor: 'text-destructive',
        textColor: 'text-destructive-foreground'
      };
    case 'warning':
      return {
        bgColor: 'bg-amber-50 dark:bg-amber-950/20',
        borderColor: 'border-amber-200 dark:border-amber-800',
        iconColor: 'text-amber-600 dark:text-amber-400',
        textColor: 'text-amber-900 dark:text-amber-100'
      };
    case 'info':
    default:
      return {
        bgColor: 'bg-primary/5',
        borderColor: 'border-primary/20',
        iconColor: 'text-primary',
        textColor: 'text-foreground'
      };
  }
};

export const truncateMarkdown = (markdown: string, maxLength: number = 240): string => {
  // Remove markdown formatting for character counting
  const plainText = markdown
    .replace(/\*\*(.*?)\*\*/g, '$1') // bold
    .replace(/\*(.*?)\*/g, '$1') // italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // links
    .replace(/#{1,6}\s/g, '') // headers
    .replace(/`(.*?)`/g, '$1'); // inline code
  
  if (plainText.length <= maxLength) return markdown;
  
  // Find the last complete word before the limit
  const truncated = plainText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  const cutPoint = lastSpaceIndex > 0 ? lastSpaceIndex : maxLength;
  
  return plainText.substring(0, cutPoint) + '...';
};