-- Create announcements table
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  pinned BOOLEAN NOT NULL DEFAULT false,
  start_at TIMESTAMP WITH TIME ZONE NOT NULL,
  end_at TIMESTAMP WITH TIME ZONE,
  cta_label TEXT,
  cta_href TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (announcements are public)
CREATE POLICY "Anyone can view announcements" 
ON public.announcements 
FOR SELECT 
USING (true);

-- Create policies for admin access (only authenticated users with admin role can modify)
CREATE POLICY "Admins can create announcements" 
ON public.announcements 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update announcements" 
ON public.announcements 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete announcements" 
ON public.announcements 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_announcements_updated_at
BEFORE UPDATE ON public.announcements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;

-- Insert some initial announcements
INSERT INTO public.announcements (title, body, severity, pinned, start_at, end_at, cta_label, cta_href) VALUES
('Scheduled Maintenance', 'We will be performing scheduled maintenance on our servers this weekend from **Saturday 2 AM to 6 AM GMT**. During this time, some services may be temporarily unavailable.', 'warning', true, '2025-01-15T00:00:00Z', '2025-12-15T23:59:59Z', 'View maintenance details', '#maintenance'),
('New Office 365 Features', 'Microsoft has released several exciting new features for Office 365 users including enhanced collaboration tools in Teams, improved AI writing assistance in Word, and new data visualization options in Excel.', 'info', false, '2025-01-10T09:00:00Z', '2025-12-10T23:59:59Z', 'Learn more', 'https://office.com'),
('Security Update Required', 'Action required: Please update your passwords for all Excis services by **October 30th**. This is part of our quarterly security enhancement program.', 'critical', false, '2025-01-12T08:00:00Z', '2025-10-30T23:59:59Z', 'Update passwords', '#security');