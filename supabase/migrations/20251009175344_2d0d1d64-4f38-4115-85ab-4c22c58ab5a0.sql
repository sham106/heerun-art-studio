-- Create enum for service categories
CREATE TYPE service_category AS ENUM ('wedding', 'event', 'corporate', 'portrait', 'commercial', 'other');

-- Create portfolio items table
CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category service_category NOT NULL,
  description TEXT,
  image_url TEXT,
  video_url TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- Public can view all portfolio items
CREATE POLICY "Anyone can view portfolio items"
ON public.portfolio_items
FOR SELECT
USING (true);

-- Create booking requests table
CREATE TABLE public.booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  location TEXT NOT NULL,
  duration TEXT NOT NULL,
  requirements TEXT,
  budget TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit booking requests
CREATE POLICY "Anyone can create booking requests"
ON public.booking_requests
FOR INSERT
WITH CHECK (true);

-- Create admin roles table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE email = user_email
  );
$$;

-- Admins can view booking requests
CREATE POLICY "Admins can view booking requests"
ON public.booking_requests
FOR SELECT
USING (is_admin((SELECT auth.jwt()->>'email')));

-- Admins can update booking requests
CREATE POLICY "Admins can update booking requests"
ON public.booking_requests
FOR UPDATE
USING (is_admin((SELECT auth.jwt()->>'email')));

-- Admins can manage portfolio items
CREATE POLICY "Admins can insert portfolio items"
ON public.portfolio_items
FOR INSERT
WITH CHECK (is_admin((SELECT auth.jwt()->>'email')));

CREATE POLICY "Admins can update portfolio items"
ON public.portfolio_items
FOR UPDATE
USING (is_admin((SELECT auth.jwt()->>'email')));

CREATE POLICY "Admins can delete portfolio items"
ON public.portfolio_items
FOR DELETE
USING (is_admin((SELECT auth.jwt()->>'email')));

-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true);

-- Storage policies
CREATE POLICY "Anyone can view portfolio images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'portfolio');

CREATE POLICY "Admins can upload portfolio images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio' AND
  is_admin((SELECT auth.jwt()->>'email'))
);

CREATE POLICY "Admins can delete portfolio images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'portfolio' AND
  is_admin((SELECT auth.jwt()->>'email'))
);