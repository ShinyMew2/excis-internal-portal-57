import { Announcement } from './types';

// Mock announcements data - replace with API calls in production
export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'System Maintenance Window',
    body: 'We will be performing scheduled maintenance on our servers this weekend from **Saturday 2 AM to 6 AM GMT**. During this time, some services may be temporarily unavailable. We apologize for any inconvenience and appreciate your patience as we work to improve our infrastructure.',
    severity: 'warning',
    pinned: true,
    startAt: '2025-01-15T00:00:00Z',
    endAt: '2025-12-15T23:59:59Z',
    cta: {
      label: 'View maintenance details',
      href: '#maintenance'
    }
  },
  {
    id: 'ann-2',
    title: 'New Microsoft 365 Features Available',
    body: 'Microsoft has released several exciting new features for Office 365 users including enhanced collaboration tools in Teams, improved AI writing assistance in Word, and new data visualization options in Excel. These features are now available across all our Microsoft 365 subscriptions.',
    severity: 'info',
    pinned: false,
    startAt: '2025-01-10T09:00:00Z',
    endAt: '2025-12-10T23:59:59Z',
    cta: {
      label: 'Learn more',
      href: 'https://office.com'
    }
  },
  {
    id: 'ann-3',
    title: 'Security Update Required',
    body: 'Action required: Please update your passwords for all Excis services by **October 30th**. This is part of our quarterly security enhancement program. Use the password manager in your browser or contact IT support for assistance.',
    severity: 'critical',
    pinned: false,
    startAt: '2025-01-12T08:00:00Z',
    endAt: '2025-10-30T23:59:59Z',
    cta: {
      label: 'Update passwords',
      href: '#security'
    }
  },
  {
    id: 'ann-4',
    title: 'Holiday Schedule Reminder',
    body: 'Please remember that our offices will be closed during the upcoming holiday period. Emergency support will still be available through the Service Desk portal.',
    severity: 'info',
    pinned: false,
    startAt: '2025-01-08T00:00:00Z',
    endAt: '2025-12-25T23:59:59Z'
  },
  {
    id: 'ann-5',
    title: 'New Employee Portal Features',
    body: 'We\'ve added several new applications to the employee portal including Excis Logger for productivity tracking and enhanced integration with our cloud storage platform.',
    severity: 'info',
    pinned: false,
    startAt: '2025-01-05T00:00:00Z',
    endAt: '2025-12-28T23:59:59Z'
  }
];