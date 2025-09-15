import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Announcement } from '@/components/announcements/types';

interface DatabaseAnnouncement {
  id: string;
  title: string;
  body: string;
  severity: 'info' | 'warning' | 'critical';
  pinned: boolean;
  start_at: string;
  end_at: string | null;
  cta_label: string | null;
  cta_href: string | null;
  created_at: string;
  updated_at: string;
}

const mapDatabaseToAnnouncement = (dbAnn: DatabaseAnnouncement): Announcement => ({
  id: dbAnn.id,
  title: dbAnn.title,
  body: dbAnn.body,
  severity: dbAnn.severity,
  pinned: dbAnn.pinned,
  startAt: dbAnn.start_at,
  endAt: dbAnn.end_at,
  cta: dbAnn.cta_label && dbAnn.cta_href ? {
    label: dbAnn.cta_label,
    href: dbAnn.cta_href
  } : undefined
});

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('pinned', { ascending: false })
        .order('start_at', { ascending: false });

      if (error) throw error;

      const mappedAnnouncements = (data || []).map(mapDatabaseToAnnouncement);
      setAnnouncements(mappedAnnouncements);
      setError(null);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();

    // Set up real-time subscription
    const channel = supabase
      .channel('announcements-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'announcements'
        },
        () => {
          fetchAnnouncements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createAnnouncement = async (announcement: Omit<Announcement, 'id'>) => {
    try {
      // Get admin password from localStorage
      const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
      if (!isAuthenticated) {
        throw new Error('Admin authentication required');
      }

      const password = "admin_super_secure_password_2025_excis_portal_announcements_manager_123456789";
      
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: {
          action: 'create',
          password: password,
          data: announcement
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Failed to create announcement');
      
      return { success: true };
    } catch (err) {
      console.error('Error creating announcement:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create announcement' };
    }
  };

  const updateAnnouncement = async (id: string, announcement: Omit<Announcement, 'id'>) => {
    try {
      // Get admin password from localStorage
      const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
      if (!isAuthenticated) {
        throw new Error('Admin authentication required');
      }

      const password = "admin_super_secure_password_2025_excis_portal_announcements_manager_123456789";
      
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: {
          action: 'update',
          password: password,
          data: { ...announcement, id }
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Failed to update announcement');
      
      return { success: true };
    } catch (err) {
      console.error('Error updating announcement:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update announcement' };
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      // Get admin password from localStorage
      const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
      if (!isAuthenticated) {
        throw new Error('Admin authentication required');
      }

      const password = "admin_super_secure_password_2025_excis_portal_announcements_manager_123456789";
      
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: {
          action: 'delete',
          password: password,
          data: { id }
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Failed to delete announcement');
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting announcement:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete announcement' };
    }
  };

  return {
    announcements,
    loading,
    error,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    refresh: fetchAnnouncements
  };
}