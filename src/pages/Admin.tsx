import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { Announcement, AnnouncementSeverity } from '@/components/announcements/types';
import { LogOut, Plus, Trash2, Edit, Calendar, Flag, FileText, Megaphone } from 'lucide-react';

export default function Admin() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { announcements, loading, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useAnnouncements();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    severity: 'info' as AnnouncementSeverity,
    pinned: false,
    startAt: '',
    endAt: '',
    ctaLabel: '',
    ctaHref: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      body: '',
      severity: 'info',
      pinned: false,
      startAt: '',
      endAt: '',
      ctaLabel: '',
      ctaHref: ''
    });
    setIsEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const announcementData = {
      title: formData.title,
      body: formData.body,
      severity: formData.severity,
      pinned: formData.pinned,
      startAt: formData.startAt,
      endAt: formData.endAt || undefined,
      cta: formData.ctaLabel && formData.ctaHref ? {
        label: formData.ctaLabel,
        href: formData.ctaHref
      } : undefined
    };

    let result;
    if (isEditing) {
      result = await updateAnnouncement(isEditing, announcementData);
      if (result.success) {
        toast({ title: 'Announcement updated successfully' });
      } else {
        toast({ title: 'Error', description: result.error, variant: 'destructive' });
      }
    } else {
      result = await createAnnouncement(announcementData);
      if (result.success) {
        toast({ title: 'Announcement created successfully' });
      } else {
        toast({ title: 'Error', description: result.error, variant: 'destructive' });
      }
    }

    if (result.success) {
      resetForm();
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      body: announcement.body,
      severity: announcement.severity,
      pinned: announcement.pinned,
      startAt: announcement.startAt,
      endAt: announcement.endAt || '',
      ctaLabel: announcement.cta?.label || '',
      ctaHref: announcement.cta?.href || ''
    });
    setIsEditing(announcement.id);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteAnnouncement(id);
    if (result.success) {
      toast({ title: 'Announcement deleted' });
    } else {
      toast({ title: 'Error', description: result.error, variant: 'destructive' });
    }
  };

  const getSeverityColor = (severity: AnnouncementSeverity) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      case 'info': return 'default';
    }
  };

  if (!isAuthenticated || loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Portal</h1>
            <p className="text-muted-foreground">Manage portal content and announcements</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Admin Navigation Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="hover:shadow-card-hover transition-shadow duration-300 cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Megaphone className="h-6 w-6 text-primary" />
                </div>
                Announcements
              </CardTitle>
              <CardDescription>
                Manage system-wide announcements and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Create and manage company announcements
              </div>
            </CardContent>
          </Card>

          <Link to="/blog/admin">
            <Card className="hover:shadow-card-hover transition-shadow duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <FileText className="h-6 w-6 text-accent" />
                  </div>
                  Blog Management
                </CardTitle>
                <CardDescription>
                  Create and manage company blog posts and news
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Write articles, manage content, and publish news
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Announcement Management</h2>
          <p className="text-muted-foreground">Create and manage portal announcements below</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                {isEditing ? 'Edit Announcement' : 'Create Announcement'}
              </CardTitle>
              <CardDescription>
                {isEditing ? 'Update the selected announcement' : 'Add a new announcement to the portal'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Announcement title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body">Message (Markdown supported)</Label>
                  <Textarea
                    id="body"
                    value={formData.body}
                    onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                    placeholder="**Bold text** or *italic text*"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity</Label>
                    <Select value={formData.severity} onValueChange={(value: AnnouncementSeverity) => 
                      setFormData(prev => ({ ...prev, severity: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Flag className="w-4 h-4" />
                      Pinned
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.pinned}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, pinned: checked }))}
                      />
                      <span className="text-sm text-muted-foreground">
                        {formData.pinned ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startAt">Start Date</Label>
                    <Input
                      id="startAt"
                      type="datetime-local"
                      value={formData.startAt.replace('Z', '').slice(0, 16)}
                      onChange={(e) => setFormData(prev => ({ ...prev, startAt: e.target.value + ':00Z' }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endAt">End Date (optional)</Label>
                    <Input
                      id="endAt"
                      type="datetime-local"
                      value={formData.endAt.replace('Z', '').slice(0, 16)}
                      onChange={(e) => setFormData(prev => ({ ...prev, endAt: e.target.value ? e.target.value + ':00Z' : '' }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Call to Action (optional)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Button text"
                      value={formData.ctaLabel}
                      onChange={(e) => setFormData(prev => ({ ...prev, ctaLabel: e.target.value }))}
                    />
                    <Input
                      placeholder="URL or #anchor"
                      value={formData.ctaHref}
                      onChange={(e) => setFormData(prev => ({ ...prev, ctaHref: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    {isEditing ? 'Update' : 'Create'} Announcement
                  </Button>
                  {isEditing && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Existing Announcements ({announcements.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{announcement.title}</h3>
                          <Badge variant={getSeverityColor(announcement.severity)}>
                            {announcement.severity}
                          </Badge>
                          {announcement.pinned && (
                            <Badge variant="outline">
                              <Flag className="w-3 h-3 mr-1" />
                              Pinned
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {announcement.body}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(announcement.startAt).toLocaleDateString()} - {' '}
                          {announcement.endAt 
                            ? new Date(announcement.endAt).toLocaleDateString()
                            : 'No end date'
                          }
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(announcement)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(announcement.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {announcements.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No announcements yet. Create your first one!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}