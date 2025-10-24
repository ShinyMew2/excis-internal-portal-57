-- Create storage bucket for PDF newsletters
INSERT INTO storage.buckets (id, name, public)
VALUES ('newsletters', 'newsletters', true);

-- Create RLS policies for newsletter PDFs
CREATE POLICY "Anyone can view newsletter PDFs"
ON storage.objects FOR SELECT
USING (bucket_id = 'newsletters');

CREATE POLICY "Authenticated admins can upload newsletter PDFs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'newsletters' 
  AND is_admin_authenticated()
);

CREATE POLICY "Authenticated admins can update newsletter PDFs"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'newsletters' 
  AND is_admin_authenticated()
);

CREATE POLICY "Authenticated admins can delete newsletter PDFs"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'newsletters' 
  AND is_admin_authenticated()
);

-- Add pdf_url column to blog_posts table
ALTER TABLE public.blog_posts
ADD COLUMN pdf_url text;