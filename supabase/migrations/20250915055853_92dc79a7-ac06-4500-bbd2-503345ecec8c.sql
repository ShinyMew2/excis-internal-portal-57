-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can create announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins can update announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins can delete announcements" ON public.announcements;

-- Create new policies that allow operations without authentication
-- This makes the table publicly accessible for admin operations
CREATE POLICY "Allow public insert on announcements" 
ON public.announcements 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update on announcements" 
ON public.announcements 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete on announcements" 
ON public.announcements 
FOR DELETE 
USING (true);