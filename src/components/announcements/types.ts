export type AnnouncementSeverity = 'info' | 'warning' | 'critical';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  severity: AnnouncementSeverity;
  pinned: boolean;
  startAt: string;
  endAt?: string;
  cta?: {
    label: string;
    href: string;
  };
}

export interface AnnouncementFilters {
  search: string;
  severity: AnnouncementSeverity | 'all';
}